# Konversi video MP4 menjadi HLS adaptif (360p / 720p / 1080p) untuk Windows
# Pemakaian (PowerShell):
#   .\make-hls.ps1 vegas-1.mp4 dist\videos\vegas\project-1
# Hasil: <folder-output>\master.m3u8  (pakai file ini di data 'hls')
#
# Syarat: ffmpeg dan ffprobe sudah terpasang dan ada di PATH
#   (cek dengan:  ffmpeg -version)
param(
  [Parameter(Mandatory = $true, Position = 0)][string]$InputFile,
  [Parameter(Mandatory = $true, Position = 1)][string]$OutDir
)

$ErrorActionPreference = 'Stop'

foreach ($tool in 'ffmpeg', 'ffprobe') {
  if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
    throw "$tool tidak ditemukan. Pasang ffmpeg lalu tambahkan ke PATH."
  }
}
if (-not (Test-Path -LiteralPath $InputFile)) { throw "File tidak ditemukan: $InputFile" }

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$OutFull = (Resolve-Path -LiteralPath $OutDir).Path -replace '\\', '/'

# Tinggi video asli, supaya tidak membuat kualitas yang lebih besar dari sumber
$srcH = [int](& ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 $InputFile | Select-Object -First 1)

# Kualitas yang dibuat: tinggi, bitrate video, bitrate audio
$all = @(
  @{ H = 360;  V = 800;  A = 96  },
  @{ H = 720;  V = 2800; A = 128 },
  @{ H = 1080; V = 5000; A = 128 }
)
$levels = @($all | Where-Object { $_.H -le $srcH })
# Video sumber lebih kecil dari 360p: tetap buat satu kualitas
if ($levels.Count -eq 0) { $levels = @(@{ H = $srcH; V = 800; A = 96 }) }

$n = $levels.Count

# Filter: pecah video menjadi N salinan lalu ubah ukurannya
$filter = "[0:v]split=$n" + ((0..($n - 1) | ForEach-Object { "[v$_]" }) -join '') + ';'
$filter += ((0..($n - 1) | ForEach-Object { "[v$_]scale=-2:$($levels[$_].H)[v${_}o]" }) -join ';')

$ffArgs = @('-y', '-i', $InputFile, '-filter_complex', $filter)
$streamMap = @()

for ($i = 0; $i -lt $n; $i++) {
  $lv = $levels[$i]
  $ffArgs += @(
    '-map', "[v${i}o]", '-map', '0:a:0',
    "-c:v:$i", 'libx264', '-preset', 'veryfast', '-profile:v', 'main', '-crf', '22',
    "-maxrate:v:$i", "$($lv.V)k", "-bufsize:v:$i", "$($lv.V * 2)k",
    '-g', '48', '-keyint_min', '48', '-sc_threshold', '0',
    "-c:a:$i", 'aac', "-b:a:$i", "$($lv.A)k", '-ar', '48000'
  )
  $streamMap += "v:$i,a:$i,name:$($lv.H)p"
}

$ffArgs += @(
  '-f', 'hls', '-hls_time', '4', '-hls_playlist_type', 'vod',
  '-hls_flags', 'independent_segments',
  '-hls_segment_filename', "$OutFull/%v_%03d.ts",
  '-master_pl_name', 'master.m3u8',
  '-var_stream_map', ($streamMap -join ' '),
  "$OutFull/%v.m3u8"
)

& ffmpeg @ffArgs
if ($LASTEXITCODE -ne 0) { throw "ffmpeg gagal (kode $LASTEXITCODE)" }

Write-Host "Selesai: $OutDir\master.m3u8"
