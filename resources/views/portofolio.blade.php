@extends('layouts.app')

@section('title', 'Portfolio | Ahmad A')

@section('content')

<div class="bg-glow"></div>

    <nav id="navbar">
        <div class="container nav-container">

            <h2 class="logo">
                Ahmad<span>A</span>
            </h2>

            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">Tentang</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#projects">Project</a></li>
                <li><a href="#contact">Kontak</a></li>
            </ul>

        </div>
    </nav>

    <section class="hero" id="home">

        <div class="container hero-container">

            <div class="hero-text">

                <p class="small-text reveal">
                    Halo, saya
                </p>
                
                <h1 class="title" id="title">Ahmad</h1>

                <h2 id="pre-typing"><div id="pretyping">I'm a</div><span id="typing"></span></h2>

                <p class="description reveal" id="description">Web Developer, Android Developer,dan Pengajar TIK yang berfokus pada pengembangan sistem informasi, e-learning, serta teknologi pendidikan.</p>

                <div class="hero-buttons reveal">
                    <a href="#projects" class="btn primary">
                        Lihat Project
                    </a>

                    <a href="#contact" class="btn secondary">
                        Kontak
                    </a>
                </div>

            </div>

            <div class="hero-image">
                <div class="image-wrapper">
                    <img src="{{ asset ('dist/imgs/self.webp') }}"
                        alt="Ahmad A">
                </div>

            </div>

        </div>

    </section>

    <section id="about">
        <div class="container">

            <h2 class="section-title reveal">
                Tentang Saya
            </h2>
            <div class="glass-card reveal">
                <p class="scramble-text">
                    Saya memiliki pengalaman dalam
                    pengembangan aplikasi berbasis
                    Laravel, Android Java, MySQL,
                    serta pengajaran Teknologi Informasi.
                </p>

                <p class="scramble-text">
                    Saya mengembangkan berbagai sistem
                    seperti SIAKAD, absensi QR Code,
                    e-learning, dan aplikasi pendidikan.
                </p>
            </div>
        </div>
    </section>

    <section id="skills">
        <div class="container">

            <h2 class="section-title reveal">
                Skills
            </h2>

            <div class="card-grid">

                <div class="card skill-card">
                    <i class="fa-brands fa-laravel"></i>
                    <h3>Laravel</h3>
                </div>

                <div class="card skill-card">
                    <i class="fa-brands fa-php"></i>
                    <h3>PHP</h3>
                </div>

                <div class="card skill-card">
                    <i class="fa-brands fa-java"></i>
                    <h3>Java</h3>
                </div>

                <div class="card skill-card">
                    <i class="fa-solid fa-database"></i>
                    <h3>MySQL</h3>
                </div>

                <div class="card skill-card">
                    <i class="fa-brands fa-android"></i>
                    <h3>Android</h3>
                </div>

                <div class="card skill-card">
                    <i class="fa-brands fa-linux"></i>
                    <h3>Linux</h3>
                </div>

                <div class="card skill-card">
                    <i class="fa-solid fa-file-excel"></i>
                    <h3>Excel</h3>
                </div>

            </div>
        </div>
    </section>

    <section id="projects">

        <div class="container">

            <h2 class="section-title reveal">
                Featured Projects
            </h2>

            <div class="project-showcase">

                <!-- SIAKAD -->
                <div class="project-expand">

                    <img src="{{ asset('dist/imgs/siakad.webp') }}"
                        alt="SIAKAD">

                    <div class="project-overlay">

                        <span class="project-type">
                            Laravel | MySQL
                        </span>

                        <h3>SIAKAD</h3>

                        <p>
                            Sistem Informasi Akademik
                            berbasis Laravel yang
                            menangani data siswa,
                            kelas, absensi,
                            dan administrasi akademik.
                        </p>

                        <div class="tech-stack">
                            <span>Laravel</span>
                            <span>Bootstrap</span>
                            <span>MySQL</span>
                        </div>

                        <div class="project-buttons">
                        </div>

                    </div>
                </div>

                <!-- QR Attendance -->
                <div class="project-expand">

                    <img src="{{ asset('dist/imgs/halaman_login.webp') }}"
                        alt="Attendance">

                    <div class="project-overlay">

                        <span class="project-type">
                            Laravel | API | Android
                        </span>

                        <h3>QR Attendance</h3>

                        <p>
                            Sistem absensi karyawan
                            menggunakan QR Code,
                            export Excel/PDF,
                            dan monitoring realtime.
                        </p>

                        <div class="tech-stack">
                            <span>Laravel</span>
                            <span>Java (Android)</span>
                            <span>MySQL</span>
                        </div>

                        <div class="project-buttons">
                            <a href="https://github.com/kryzer0/qrAbsen" target="_blank">Github</a>
                        </div>

                    </div>
                </div>

                <!-- E-Learning -->
                <div class="project-expand">

                    <img src="https://placehold.co/700x500"
                        alt="E-Learning">

                    <div class="project-overlay">

                        <span class="project-type">
                            Education Platform
                        </span>

                        <h3>E-Learning</h3>

                        <p>
                            Platform pembelajaran
                            online untuk siswa
                            dengan materi, tugas,
                            dan evaluasi.
                        </p>

                        <div class="tech-stack">
                            <span>Laravel</span>
                            <span>Blade</span>
                            <span>MySQL</span>
                        </div>

                    </div>
                </div>

                <!-- Presentasi Geolokasi -->
                <div class="project-expand">

                    <img src="dist/imgs/geolokasi.webp"
                        alt="Presentasi geolokasi">

                    <div class="project-overlay">

                        <span class="project-type">
                            Laravel | MySQL
                        </span>

                        <h3>Presentasi Geolokasi</h3>

                        <p>
                            Sistem presensi berbasis geolokasi yang terdiri dari 
                            dua bagian utama: dashboard HR berbasis web untuk 
                            mengelola data karyawan, presensi, serta API terintegrasi 
                            untuk aplikasi Android karyawan 
                            sebagai media melakukan presensi secara real-time.
                        </p>

                        <div class="tech-stack">
                            <span>Laravel</span>
                            <span>Bootstrap</span>
                            <span>MySQL</span>
                        </div>

                        <div class="project-buttons">
                            <a href="https://hrdrci-ritra.com" target="_blank">Preview</a>
                        </div>

                    </div>
                </div>

                <!-- Java Game -->
                <div class="project-expand">

                    <img src="dist/imgs/platformer.gif"
                        alt="Java Game">

                    <div class="project-overlay">

                        <span class="project-type">
                            Java Desktop
                        </span>

                        <h3>Platformer Game</h3>

                        <p>
                            Game platformer Java
                            desktop untuk tugas akhir
                            semester pemrograman.
                        </p>

                        <div class="tech-stack">
                            <span>Java</span>
                            <span>Swing</span>
                        </div>

                    </div>
                </div>

            </div>

        </div>

    </section>

    <section id="contact">
        <div class="container">
            <h2 class="section-title reveal">
                Kontak
            </h2>
            <div class="contact-grid">
                <!-- Email -->
                <div class="contact-card reveal">

                    <div class="contact-icon">
                        <i class="fa-solid fa-envelope"></i>
                    </div>
                    <h3>Email</h3>
                    <p>
                        ahmad1412@gmail.com
                    </p>
                    <a href="mailto:ahmad02001412@gmail.com">
                        Kirim Email
                    </a>
                </div>
                <!-- WhatsApp -->
                <div class="contact-card reveal">
                    <div class="contact-icon">
                        <i class="fa-brands fa-whatsapp"></i>
                    </div>
                    <h3>WhatsApp</h3>
                    <p>
                        +62 812 xxxx xxxx
                    </p>
                    <a href="https://wa.me/6288213467882"
                        target="_blank">
                        Chat WhatsApp
                    </a>
                </div>
                <!-- Github -->
                <div class="contact-card reveal">
                    <div class="contact-icon">
                        <i class="fa-brands fa-github"></i>
                    </div>
                    <h3>Github</h3>
                    <p>
                        github.com/kryzer0
                    </p>
                    <a href="https://github.com/kryzer0"
                        target="_blank">
                        Lihat Github
                    </a>
                </div>
                <!-- LinkedIn (Optional) -->
                <div class="contact-card reveal">
                    <div class="contact-icon">
                        <i class="fa-brands fa-linkedin"></i>
                    </div>
                    <h3>LinkedIn</h3>
                    <p>
                        linkedin.com/in/Ahmad
                    </p>
                    <a href="#"
                        target="_blank">
                        Lihat Profil
                    </a>
                </div>
            </div>
        </div>
    </section>

@endsection