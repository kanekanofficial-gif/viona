# VIONA Telegram Login setup

This branch adds Telegram OIDC sign-in to VIONA ID. **Do not put secrets in GitHub, public JS, or chat.**

1. Open [@BotFather](https://t.me/BotFather) and create a bot with `/newbot` (or select an existing bot).
2. Open **Login Widget** in BotFather. Add allowed URLs:
   - `https://viona.space`
   - `https://viona.space/auth/telegram/callback`
3. Copy the Telegram **Client ID** and **Client Secret** from Login Widget settings.
4. In your deployment platform's **environment variables**, configure:
   - `TELEGRAM_CLIENT_ID`: client ID from BotFather
   - `TELEGRAM_CLIENT_SECRET`: secret from BotFather
   - `SESSION_SECRET`: a strong, randomly generated secret (32+ bytes)
   - `PUBLIC_BASE_URL`: `https://viona.space`
5. Deploy this branch after review and restart the server.
6. Open VIONA ID, click **Continue with Telegram**, authorize, and verify the Telegram profile is shown. Use **Log out** to clear the signed session cookie.

Security: authorization-code flow with PKCE S256, random state and nonce, server-side code exchange, Telegram JWKS signature verification, issuer/audience/expiry/nonce checks, 7-day signed HttpOnly SameSite=Lax session. A shared session secret must be configured on every server instance. Logout clears the browser session cookie. There is no account database or order history yet.

MAX Bot Starter is a **demo catalog listing**, not an already created or deployed MAX bot. MAX platform may require verified Russian business/sole proprietor/self-employed status to create actual bots.

To enable a real MAX bot, follow official MAX developer requirements separately: https://dev.max.ru/docs/chatbots/bots-create/create

**Test checklist:** Login before configuration should be clearly unavailable; configured login should redirect to Telegram and back; reject missing or tampered state; reject expired/mismatched tokens; verify session persists after reload; verify logout; test mobile, all five worlds, catalog, and cart. Browser tests and external Telegram authorization have not been executed in this PR.
