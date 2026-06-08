<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">

    <meta name="viewport"
        content="width=device-width, initial-scale=1.0">

    {{-- Primary SEO --}}
    <title>
        @yield('title', 'Ahmad A - Web Developer & Android Developer')
    </title>

    <meta name="description"
        content="@yield('meta_description',
        'Portfolio Ahmad A, Web Developer, Android Developer, dan Pengajar TIK. Berpengalaman membangun sistem informasi, e-learning, absensi QR Code, dan aplikasi pendidikan berbasis Laravel & Android.')">

    <meta name="keywords"
        content="Ahmad A, Web Developer, Laravel Developer, Android Developer, Pengajar TIK, Portfolio Laravel, MySQL, Java Android">

    <meta name="author"
        content="Ahmad A">

    <meta name="robots"
        content="index, follow">

    {{-- Canonical URL --}}
    <link rel="canonical"
        href="{{ url()->current() }}">

    {{-- Open Graph (WhatsApp, Facebook, LinkedIn) --}}
    <meta property="og:type"
        content="website">

    <meta property="og:title"
        content="@yield('title', 'Ahmad A - Web Developer & Android Developer')">

    <meta property="og:description"
        content="@yield('meta_description',
        'Portfolio Ahmad A, Web Developer, Android Developer, dan Pengajar TIK.')">

    <meta property="og:image"
        content="{{ secure_asset('dist/imgs/self.webp') }}">

    <meta property="og:url"
        content="{{ url()->current() }}">
        
    <meta property="og:image:width"
        content="1200">

    <meta property="og:image:height"
        content="630">

    <meta property="og:site_name"
        content="Ahmad A Portfolio">

    {{-- Twitter Card --}}
    <meta name="twitter:card"
        content="summary_large_image">

    <meta name="twitter:title"
        content="@yield('title',
        'Ahmad A - Web Developer & Android Developer')">

    <meta name="twitter:description"
        content="@yield('meta_description',
        'Portfolio Ahmad A, Web Developer, Android Developer, dan Pengajar TIK.')">

    <meta name="twitter:image"
        content="{{ asset('dist/imgs/self.webp') }}">

    {{-- Favicon --}}
    <link rel="icon"
        type="image/png"
        href="{{ asset('dist/imgs/favicon.png') }}">

    {{-- Google Fonts (lebih cepat) --}}
    <link rel="preconnect"
        href="https://fonts.googleapis.com">

    <link rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin>

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet">

    {{-- CSS --}}
    <link rel="stylesheet"
        href="{{ asset('dist/css/style.min.css') }}">

    {{-- Font Awesome --}}
    <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

    {{-- Structured Data / Schema.org --}}
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Ahmad A",
      "jobTitle": "Web Developer",
      "url": "{{ url('/') }}",
      "image": "{{ asset('dist/imgs/self.webp') }}",
      "sameAs": [
        "https://github.com/kryzer0"
      ],
      "knowsAbout": [
        "Laravel",
        "Android Development",
        "MySQL",
        "Java",
        "Web Development"
      ]
    }
    </script>

    {{-- Anime.js --}}
    <script defer
        src="https://cdn.jsdelivr.net/npm/animejs/dist/bundles/anime.umd.min.js">
    </script>

    {{-- Main JS --}}
    <script defer
        src="{{ asset('dist/js/script.min.js') }}">
    </script>

</head>

<body>

    @yield('content')

</body>

</html>