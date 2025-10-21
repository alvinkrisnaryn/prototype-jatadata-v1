# 🎬 Prototype Jatadata v1

Proyek ini merupakan setup awal dari pengerjaan Project Aplikasi Web **Jatadata** untuk mengelola data jamaah POMOSDA se-Jakarta dan Bekasi. Ini adalah prototipe yang berfungsi untuk eksplorasi fitur awal dan alur otentikasi.

---

## 🚀 Fitur Utama

Fitur-fitur yang sudah tersedia dalam prototipe ini meliputi:

- **Sistem Otentikasi Penuh:**
  - Halaman Login Admin.
  - Alur Lupa Password (Forgot Password) yang mencakup input email dan navigasi ke verifikasi OTP.
  - Verifikasi Kode OTP.
  - Ganti Password Baru (New Password).
  - Mekanisme penguncian akun (cooldown 5 menit) setelah 3 kali percobaan login gagal untuk keamanan.
- **Dashboard Admin:**
  - Halaman utama Dashboard Admin (termasuk sambutan dan tanggal/waktu).
  - Navigasi Sidebar untuk modul: **Home**, **Jamaah Management**, **Master Data**, dan **Report**.
  - Fitur Logout.

---

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun dengan teknologi-teknologi modern:

- **Frontend Framework:** [Vue 3](https://vuejs.org/) (Menggunakan Vite)
- **UI Component:** [CoreUI Vue](https://coreui.io/vue)
- **Routing:** [Vue Router](https://router.vuejs.org/)
- **Form Validation:** [Vee-Validate](https://vee-validate.logaretm.com/v4/) dan [Yup](https://github.com/jquense/yup)
- **Notifikasi/Alert:** [SweetAlert2](https://sweetalert2.github.io/)
- **Styling:** CSS Kustom dengan import [Bootstrap Icons](https://icons.getbootstrap.com/)
- **Tooling:**
  - **Development Server & Bundler:** [Vite](https://vitejs.dev/)
  - **Unit Testing:** [Vitest](https://vitest.dev/)
  - **Linter:** [ESLint](https://eslint.org/)
  - **Formatter:** [Prettier](https://prettier.io/)

---

## ⚙️ Prasyarat Instalasi

Pastikan Anda telah menginstal versi **Node.js** yang sesuai.

| Prasyarat   | Versi                       |
| :---------- | :-------------------------- |
| **Node.js** | `^20.19.0` atau `>=22.12.0` |

### Langkah-langkah Instalasi

Gunakan Yarn (dianjurkan) atau npm untuk menginstal dependensi:

```bash
# Menggunakan Yarn
yarn install

# Atau menggunakan npm
npm install


## 📂 Struktur Project
├── public/                  # Aset statis (logo, gambar)
├── src/
│   ├── __tests__/           # Unit tests untuk komponen
│   ├── layouts/             # Komponen layout (AuthNavbar, DashboardNavbar)
│   ├── pages/               # Halaman utama aplikasi
│   │   ├── auth/            # Halaman otentikasi (Login, ForgotPass, OtpVerify, NewPass)
│   │   └── dashboard/       # Halaman dashboard dan komponennya
│   ├── router/              # Konfigurasi Vue Router (index.js)
│   ├── styles/              # File styling kustom
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
├── yarn.lock
├── vite.config.js
├── vitest.config.js
└── ...
```
