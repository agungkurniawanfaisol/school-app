# Deploy ke Hostinger (SSH + rsync)

Push ke `main` → GitHub Actions build + sync ke `public_html`.

## Langkah di Hostinger (hPanel) — sekali saja

### 1. Aktifkan SSH

1. Login [hPanel](https://hpanel.hostinger.com)
2. Pilih website domain kamu → **Dashboard**
3. **Advanced → SSH Access**
4. **Enable** SSH
5. Catat:
   - **IP / Host**
   - **Username** (biasanya `u123456789`)
   - **Port** → biasanya **`65002`** (bukan 22)

Uji dari laptop:

```bash
ssh -p 65002 u123456789@IP_ATAU_HOST
```

### 2. Tambah SSH key untuk GitHub Actions

Di laptop:

```bash
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/hostinger_deploy -N ""
cat ~/.ssh/hostinger_deploy.pub
```

Di hPanel: **Advanced → SSH Access → SSH Keys** (atau tempel ke `~/.ssh/authorized_keys` via SSH) → paste isi `.pub`.

Private key untuk GitHub:

```bash
cat ~/.ssh/hostinger_deploy
```

### 3. Buat database MySQL

1. hPanel → **Databases → MySQL Databases**
2. Buat database + user + password
3. Catat: DB name, username, password, host (sering `localhost` / `127.0.0.1`)

### 4. Cari path `public_html`

Via SSH:

```bash
pwd
ls
# biasanya:
# /home/u123456789/domains/namadomain.com/public_html
```

Atau File Manager → buka `public_html` → lihat path di atas.

---

## Secret di GitHub

Repo → **Settings → Secrets and variables → Actions → New repository secret**

| Secret           | Isi dari Hostinger                               |
| ---------------- | ------------------------------------------------ |
| `DEPLOY_HOST`    | IP / hostname SSH                                |
| `DEPLOY_USER`    | username `u…`                                    |
| `DEPLOY_SSH_KEY` | isi penuh private key (`BEGIN` … `END`)          |
| `DEPLOY_PATH`    | `/home/u…/domains/namadomain.com/public_html`    |
| `DEPLOY_PORT`    | `65002` (opsional; default workflow sudah 65002) |

Opsional: `DEPLOY_PHP` jika `php` tidak ketemu (mis. `/opt/alt/php83/usr/bin/php`).

---

## Setelah deploy pertama (buat `.env` di server)

```bash
ssh -p 65002 u…@HOST
cd /home/u…/domains/namadomain.com/public_html/backend

cp .env.example .env
nano .env
```

Isi minimal:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://namadomain.com

FRONTEND_URL=https://namadomain.com
SANCTUM_STATEFUL_DOMAINS=namadomain.com,www.namadomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_db_hostinger
DB_USERNAME=user_db_hostinger
DB_PASSWORD=password_db

CACHE_STORE=file
SESSION_DRIVER=file
QUEUE_CONNECTION=database

# Google OAuth (login admin)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
# Hanya URL-nya saja — JANGAN tulis ulang nama key di nilai
# ❌ GOOGLE_REDIRECT_URI=GOOGLE_REDIRECT_URI=https://...
# ✅ GOOGLE_REDIRECT_URI=https://namadomain.com/api/admin/auth/google/callback
GOOGLE_REDIRECT_URI=https://namadomain.com/api/admin/auth/google/callback
```

Pastikan juga:

```env
SANCTUM_STATEFUL_DOMAINS=namadomain.com,www.namadomain.com
FRONTEND_URL=https://namadomain.com
APP_URL=https://namadomain.com
```

Di [Google Cloud Console](https://console.cloud.google.com/) → Credentials → OAuth client:

| Setting                       | Nilai                                                   |
| ----------------------------- | ------------------------------------------------------- |
| Authorized redirect URIs      | `https://namadomain.com/api/admin/auth/google/callback` |
| Authorized JavaScript origins | `https://namadomain.com`                                |

Setelah ubah `.env` Google:

```bash
php artisan config:clear
php artisan config:cache
```

Jika login Google mengarahkan ke landing page (bukan ke Google), biasanya service worker lama masih menangkap `/api/...`. Setelah deploy frontend baru: hard refresh, atau di DevTools → Application → Service Workers → Unregister, lalu reload.

**Catatan Google login:** email akun Google harus **sudah ada** di tabel `users` (role `admin`/`guru`). OAuth tidak membuat user baru.

Setup pertama kali (sekali saja):

```bash
php artisan key:generate
php artisan storage:link
php artisan migrate --force
```

`.env` dan `storage/` **tidak** dihapus saat deploy berikutnya.

### Upload gambar / file (admin)

File disimpan di `backend/storage/app/public/uploads/...` dan diakses lewat URL:

`https://namadomain.com/storage/uploads/{collection}/{file}`

`.htaccess` di `public_html/` menyajikan `/storage/*` langsung dari `backend/storage/app/public/` (tidak wajib andalkan symlink).

Setelah `.env` dibuat, pastikan:

```bash
cd ~/domains/namadomain.com/public_html/backend
grep APP_URL .env
# harus: APP_URL=https://namadomain.com  (tanpa /backend)

chmod -R ug+rwx storage bootstrap/cache
mkdir -p storage/app/public/uploads
php artisan config:clear
php artisan config:cache
```

Uji satu file upload:

```bash
curl -I "https://namadomain.com/storage/uploads/general/NAMA_FILE.jpg"
# harus HTTP/1.1 200
```

Kalau preview admin kosong tapi URL terisi, biasanya penyebabnya: folder `storage/app/public` tidak writable atau `APP_URL` salah.

---

## Alur tiap push

```
push main → GitHub Actions
  → build frontend/dist
  → rsync ke public_html/          (jangan hapus backend/)
  → rsync backend/                 (jangan hapus storage/ + .env)
  → php artisan migrate + cache
```

Hasil di Hostinger:

```
public_html/           ← website (Document Root Hostinger)
  .htaccess
  index.html           ← React
  assets/
  backend/             ← Laravel
    .env               ← server only
    storage/           ← server only
    public/
```

| URL                                  | Hasil       |
| ------------------------------------ | ----------- |
| `https://namadomain.com/`            | Frontend    |
| `https://namadomain.com/api/v1/...`  | API Laravel |
| `https://namadomain.com/storage/...` | File upload |

---

## Catatan Hostinger

- Document root **tidak bisa diganti** dari `public_html` → makanya frontend di root, Laravel di `public_html/backend/`.
- Fitur **Git** di hPanel **tidak** dipakai di setup ini (kita pakai GitHub Actions + SSH, lebih cocok untuk build React).
- Pastikan PHP **8.4+** di hPanel → **Advanced → PHP Configuration** (project Laravel ini butuh PHP 8.4).
