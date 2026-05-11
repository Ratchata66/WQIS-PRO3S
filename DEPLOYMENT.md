# PRO3S WQIS Deployment Guide

This project is prepared for two delivery modes:

- Windows installer for internal desktop use
- Netlify web deployment for 24/7 HTTPS access with a professional domain

## 1. Windows installer for company users

Build command:

```bash
npm run build
```

Output:

```text
release/PRO3S WQIS Setup 1.0.0.exe
```

Share this `.exe` with company users. They do not need Node.js, npm, or VS Code.

## 2. Netlify web deployment

Recommended production URL pattern:

```text
https://wqis.pro3s.com
```

Netlify provides HTTPS automatically after the custom domain DNS is connected.

Required files:

```text
index.html
login.html
auth.js
netlify.toml
netlify/functions/auth.js
PRO3S_Logo_001.png
PRO3S_Full_Logo.jpg
PRO3S_White_Logo.png
```

The `.netlifyignore` file excludes Electron-only files such as `main.js`, `node_modules`, `dist`, and `release`.

Pre-deploy checks:

```bash
npm run users:build
npm run web:check
```

Deploy options:

1. Connect the project repository to Netlify and set the publish directory to the project root.
2. Or drag the project folder to Netlify Drop after confirming `.netlifyignore` is present.
3. Or use Netlify CLI from this folder:

```bash
npx netlify deploy --prod --dir . --functions netlify/functions
```

## 3. Netlify environment variables

For the most secure production setup, set these in Netlify:

```text
USER_ADMIN
PASS_ADMIN
USER_INSPECTOR
PASS_INSPECTOR
USER_VIEWER
PASS_VIEWER
```

Alternative company-user mode:

- Edit `database/WQIS_User_Database_Template.xlsx`
- Run `npm run users:build`
- Deploy again
- Netlify Function uses `netlify/functions/generated-users.js`

Do not publish `generated-users.js` to the public web root. `.netlifyignore` already excludes it.

The online login page calls:

```text
/.netlify/functions/auth
```

Credentials are checked server-side in the Netlify Function. The browser stores only a temporary session in `localStorage`.

## 4. Professional domain and HTTPS

In Netlify:

```text
Site configuration -> Domain management -> Add custom domain
```

Use one of these:

```text
wqis.pro3s.com
inspection.pro3s.com
quality.pro3s.com
```

DNS setup depends on where the PRO3S domain is managed:

- For a subdomain such as `wqis.pro3s.com`, create a CNAME record pointing to the Netlify site domain.
- For a root domain, use Netlify DNS or the A/ALIAS records shown by Netlify.

After DNS is connected, enable:

```text
HTTPS -> Verify DNS configuration -> Provision certificate
```

Netlify will issue and renew the TLS certificate automatically.

## 5. Local modes

Electron desktop:

```bash
npm start
```

Static web file check:

```bash
npm run web:check
```

Local web preview:

```bash
npm run web:serve
```

For local testing of the online auth function, use Netlify CLI or deploy to Netlify because `web:serve` serves static files only.

## 6. Updating company login users from Excel

Edit this workbook:

```text
database/WQIS_User_Database_Template.xlsx
```

Use the `Users` sheet. Required columns:

```text
email
temporary_password
full_name
role
status
```

Allowed `role` values:

```text
admin
inspector
viewer
```

Allowed `status` values:

```text
active
disabled
```

After editing and saving the Excel file, run:

```bash
npm run users:build
```

This creates:

```text
generated-users.js
netlify/functions/generated-users.js
```

Then rebuild the installer:

```bash
npm run build
```

For Netlify, deploy again after running `npm run users:build`.

## 7. Production checklist

- `npm run web:check` passes.
- `generated-users.js` is excluded from public deployment.
- `netlify/functions/generated-users.js` or Netlify env vars are configured.
- Custom domain is connected.
- HTTPS certificate is active.
- Roboflow API access is tested from the deployed site.
- Login roles are verified: `admin`, `inspector`, `viewer`.
- PRO3S logos load correctly.

## 8. Current limitations

- Inspection data is still stored in browser `localStorage`.
- Online login can use `netlify/functions/generated-users.js`, generated from the Excel file.
- Roboflow API key is currently present in the frontend. For production, move AI inference behind a serverless function.
