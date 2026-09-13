# Panduan Publikasi Resmi: Visual Studio Marketplace & Open VSX

Panduan lengkap untuk mempublikasikan ekstensi **Antigravity Account Switcher** (`boygr.antigravity-account-switcher`) ke:
1. **Visual Studio Marketplace** (VS Code resmi)
2. **Open VSX Registry** (Cursor, VSCodium, Gitpod, dsb.)

---

## 1. Visual Studio Code Marketplace (Official)

Identitas publisher di `package.json`:
- **Publisher ID**: `boygr`
- **Extension Name**: `antigravity-account-switcher`
- **VSIX File**: `release/antigravity-account-switcher-1.0.0.vsix`

---

### METODE A: Upload Langsung via Web (Paling Cepat & Mudah ⚡)
Metode ini **tidak membutuhkan token CLI** dan bisa langsung dilakukan lewat browser:

1. Buka portal manajemen: **[https://marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage)**
2. Login menggunakan akun Microsoft Anda.
3. Jika belum memiliki Publisher:
   - Klik **Create publisher**.
   - **Name**: `boygr` *(harus sama persis dengan yang ada di package.json)*.
   - **ID**: `boygr`.
   - Isi bio / website (`https://boygr.com`) dan simpan.
4. Di dashboard publisher `boygr`:
   - Klik tombol **New extension** $\rightarrow$ pilih **Visual Studio Code**.
   - Drag & drop atau pilih file:
     ```
     release/antigravity-account-switcher-1.0.0.vsix
     ```
   - Klik **Upload**.
5. Tunggu proses verifikasi Microsoft (biasanya 2–5 menit). Ekstensi akan berstatus **Active** dan langsung dapat dicari di Extensions tab VS Code sedunia!

---

### METODE B: Publikasi Otomatis via Terminal / CLI

Jika Anda ingin mempublikasikan langsung dari terminal setiap kali ada versi baru:

#### Langkah 1: Buat Azure DevOps Personal Access Token (PAT)
1. Buka **[https://dev.azure.com/](https://dev.azure.com/)** dan login.
2. Di pojok kanan atas, klik ikon **User settings** (ikon pengguna di samping avatar) $\rightarrow$ pilih **Personal access tokens**.
3. Klik **+ New Token**:
   - **Name**: `VS Code Marketplace - boygr`
   - **Organization**: Pilih **All accessible organizations** *(PENTING! Jangan hanya pilih 1 org default)*.
   - **Expiration**: Pilih durasi (misal 90 hari atau 1 tahun).
   - **Scopes**: Scroll ke bawah, cari **Marketplace** $\rightarrow$ centang **Manage** (atau **Acquire and Publish**).
4. Klik **Create**, lalu **salin dan simpan token** tersebut dengan aman.

#### Langkah 2: Login vsce di Terminal
Jalankan perintah berikut di PowerShell / terminal:
```powershell
npx @vscode/vsce login boygr
```
Ketika diminta:
```text
Personal Access Token for publisher 'boygr': <paste-token-anda-di-sini>
```

#### Langkah 3: Publish Ekstensi
Setelah login berhasil, Anda cukup menjalankan:
```powershell
npm run publish:marketplace
```
Atau jika ingin mempublikasikan file VSIX yang sudah dibuat:
```powershell
npx @vscode/vsce publish --packagePath release/antigravity-account-switcher-1.0.0.vsix
```

---

## 2. Open VSX Registry (Cursor, VSCodium, Gitpod)

Open VSX adalah registry open-source alternatif yang digunakan oleh editor berbasis VS Code seperti **Cursor IDE**, **VSCodium**, dan **Gitpod**.

### METODE A: Upload via Web
1. Buka **[https://open-vsx.org/](https://open-vsx.org/)**.
2. Klik **Log In** di pojok kanan atas (bisa login menggunakan akun GitHub `BoyGR`).
3. Buat Namespace:
   - Masuk ke profil Anda $\rightarrow$ **Namespaces**.
   - Daftarkan namespace `boygr`.
4. Klik **Publish Extension**:
   - Unggah file `release/antigravity-account-switcher-1.0.0.vsix`.
   - Ekstensi langsung tersedia untuk pengguna Cursor dan VSCodium.

---

### METODE B: Publish via CLI
1. Di profil Open VSX Anda, buka tab **Access Tokens** $\rightarrow$ **Generate Token**.
2. Simpan token tersebut.
3. Jalankan perintah publish:
```powershell
npx ovsx publish release/antigravity-account-switcher-1.0.0.vsix -p <OPEN_VSX_TOKEN>
```
Atau login:
```powershell
npx ovsx login boygr
```
Lalu jalankan:
```powershell
npm run publish:openvsx
```

---

## 3. Checklist Verifikasi Sebelum Publish

- [x] Versi `package.json` dan `package-lock.json` sudah sinkron (`1.0.0`).
- [x] Ikon ekstensi berformat PNG dan transparan (`media/icon.png`).
- [x] Dokumentasi `README.md` dan `CHANGELOG.md` sudah lengkap dan rapi.
- [x] Lisensi MIT (`LICENSE.txt`) disertakan.
- [x] Kompilasi berhasil tanpa peringatan TypeScript atau error bundler esbuild (`npm run compile`).
- [x] File VSIX telah terbuat dan diuji instalasinya secara lokal (`release/antigravity-account-switcher-1.0.0.vsix`).

