# YASLAM LINK BYPASS

Website dark-themed untuk menyelesaikan link SFL menggunakan Zapi API melalui Vercel Serverless Function.

## Deploy lewat HP

1. Buat repository GitHub baru, misalnya `yaslam-link-bypass`.
2. Upload semua file/folder dari ZIP ini ke root repository:
   - `index.html`
   - `api/bypass.js`
   - `vercel.json`
3. Import repository itu di Vercel.
4. Di Vercel: Project → Settings → Environment Variables.
5. Tambahkan:
   - Name: `ZAPI_API_KEY`
   - Value: API key Zapi kamu (masukkan sendiri; jangan taruh di file frontend).
   - Environment: Production (boleh pilih Preview juga untuk testing).
6. Save, lalu redeploy project.
7. Buka URL `.vercel.app` hasil deploy dan tes dengan link SFL.

## Notes

- API key hanya dipakai di fungsi server, tidak dikirim ke browser.
- Endpoint: `https://api.zapi.ink/v1/bypass-tools:safelinku/resolve`
- Pastikan akun/key Zapi memiliki akses ke endpoint tersebut.
- Jangan upload `.env` atau API key ke GitHub.
