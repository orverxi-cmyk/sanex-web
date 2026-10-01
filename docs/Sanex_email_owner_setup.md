# SANEX Project – Owner & Gmail OAuth2 Email Setup

**Purpose**

Provide a concise, step‑by‑step guide to ensure the SANEX organisation is an *Owner* of the Google Cloud project that hosts the SANEX website and to configure the application so it can send email from `sanexcompany@gmail.com` using OAuth2 (no personal login required).

---

## 1️⃣ Verify SANEX is already an Owner

Your IAM list confirms:

```
sanexcompany@gmail.com   Owner
orverxi@gmail.com        Owner
```

✅ **Already done** – no further IAM changes needed.

---

## 2️⃣ Enable Gmail API

1. Open **Google Cloud Console → APIs & Services → Library**.
2. Search **Gmail API** and click **Enable**.

```bash
gcloud services enable gmail.googleapis.com --project studio-9595184890-5bb3c
```

---

## 3️⃣ Create OAuth 2.0 credentials

1. **APIs & Services → Credentials → Create credentials → OAuth client ID**.
2. Choose **Web application** and give it a name (e.g., *SANEX Email Sender*).
3. Add an *Authorized redirect URI*:
   - `https://developers.google.com/oauthplayground`
4. (Optional) **Enable G Suite domain‑wide delegation** if you want a service‑account to act on behalf of `sanexcompany@gmail.com`.
5. Save – note the **Client ID** and **Client Secret**.

---

## 4️⃣ Generate a Refresh Token for `sanexcompany@gmail.com`

1. Open the **OAuth 2.0 Playground**: https://developers.google.com/oauthplayground
2. Click the gear ⚙️, enable **Use your own OAuth credentials**, and paste the Client ID & Secret from step 3.
3. In the left panel select the scopes:
   - `https://mail.google.com/`
   - `https://www.googleapis.com/auth/gmail.send`
4. Click **Authorize APIs**, sign‑in as `sanexcompany@gmail.com`, and grant consent.
5. Click **Exchange authorization code for tokens**.
6. Copy the **Refresh token** (a long string).

---

## 5️⃣ Add the credentials to the project's environment

Edit **`.env`** (or `.env.local` for local development) and add the following lines, replacing the placeholder values with the ones you obtained:

```dotenv
# ----- Gmail OAuth2 (preferred) -----
SMTP_USER=sanexcompany@gmail.com            # address used as the sender
SMTP_CLIENT_ID=YOUR_OAUTH_CLIENT_ID
SMTP_CLIENT_SECRET=YOUR_OAUTH_CLIENT_SECRET
SMTP_REFRESH_TOKEN=YOUR_OAUTH_REFRESH_TOKEN

# ----- Optional fallback (still keep for safety) -----
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
# SMTP_PASS=   # comment/remove – not needed when using OAuth2
```

> **Security note:** Do not commit `.env` to version control. Use your hosting platform's secret manager for production (Firebase App Hosting, Secret Manager, etc.).
>
> **For Firebase App Hosting:**
> If you create secrets in Google Cloud Secret Manager (`SMTP_CLIENT_SECRET`, `SMTP_REFRESH_TOKEN`), you must grant your App Hosting backend access:
> ```bash
> npx firebase-tools apphosting:secrets:grantaccess -l us-central1 -b studio SMTP_CLIENT_SECRET --project studio-9595184890-5bb3c
> npx firebase-tools apphosting:secrets:grantaccess -l us-central1 -b studio SMTP_REFRESH_TOKEN --project studio-9595184890-5bb3c
> ```

---

## 6️⃣ How the code picks up OAuth2

`src/lib/email.ts` contains a helper `getTransporter()`:

```ts
if (user && clientId && clientSecret && refreshToken) {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { type: 'OAuth2', user, clientId, clientSecret, refreshToken },
  });
}
```

When the four `SMTP_*` variables are present, Nodemailer automatically uses the OAuth2 transport – **no code change required**.

---

## 7️⃣ Restart / redeploy the application

| Platform         | Command                                                                 |
| ---------------- | ----------------------------------------------------------------------- |
| Vercel / Netlify | Push a commit or run `vercel --prod` / `netlify deploy --prod`          |
| Google Cloud Run | `gcloud run services update <SERVICE> --platform managed --region <R>`  |
| App Engine       | `gcloud app deploy`                                                     |
| Local dev        | Stop the dev server (`Ctrl‑C`) then `npm run dev`                       |

---

## 8️⃣ Verify the email flow

1. Trigger a booking‑status email (via the admin UI or a temporary test button).
2. In the server logs you should see something like:

   ```
   [sendBookingStatusEmail] Status email delivered to <addr> via SMTP: <messageId>
   ```

   (The log says *SMTP* but it is actually using the OAuth2 transport.)

3. Open Gmail for `sanexcompany@gmail.com` → **Sent** folder → confirm the message is there.
4. If the fallback "logged" block runs, double‑check that the four `SMTP_CLIENT_*` variables are correctly loaded:

   ```bash
   node -e "console.log(process.env.SMTP_CLIENT_ID)"
   ```

---

## 9️⃣ (Optional) Use a Service Account instead of a personal Gmail address

1. Create a service account, e.g., `sanex-email-sender@<PROJECT>.iam.gserviceaccount.com`.
2. Grant it **Service Account Token Creator** and **Service Account User** roles.
3. Enable domain‑wide delegation for the service account.
4. Generate a refresh token for the service account (same Playground flow).
5. Set `SMTP_USER` to the service‑account email and keep the same OAuth vars.
   - No code changes are required; the same OAuth2 branch will be used.

---

## ✅ Quick Checklist

- [ ] Confirm SANEX group/email appears as Owner in IAM (already done).
- [ ] Enable Gmail API on the project.
- [ ] Create OAuth client ID (Web app) and note ID/secret.
- [ ] Generate a refresh token for sanexcompany@gmail.com (OAuth Playground).
- [ ] Add `SMTP_USER`, `SMTP_CLIENT_ID`, `SMTP_CLIENT_SECRET`, `SMTP_REFRESH_TOKEN` to .env.
- [ ] (Optional) Remove/comment old `SMTP_PASS`.
- [ ] Restart / redeploy the application.
- [ ] Send a test email → verify it appears in Gmail Sent folder.
- [ ] (Optional) Set up a service‑account with domain‑wide delegation.
