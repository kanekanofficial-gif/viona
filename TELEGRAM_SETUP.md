# VIONA Telegram Login — Render deployment

VIONA uses the **classic Telegram Login Widget**, linked to **@viona_appbot** and the domain **viona.space** in BotFather → Bot Settings → Domain.

## Render → Web Service → Environment

- `TELEGRAM_BOT_TOKEN`: fresh bot token from @BotFather → API Token. Keep private.
- `SESSION_SECRET`: randomly generated secret, at least 32 characters. Keep private.
- `PUBLIC_BASE_URL`: `https://viona.space`
- `TELEGRAM_BOT_USERNAME`: `viona_appbot` (optional; defaults to this)

Do not commit secrets or send them in chat/screenshots. Rotate any exposed bot tokens and session secrets.

## How login works

Open **VIONA ID** and select the official Telegram login widget. Telegram redirects the browser to `https://viona.space/auth/telegram/widget` with signed user fields. The server checks the HMAC-SHA256 signature using SHA256(bot token) as the key, a five-minute `auth_date` freshness window, and required fields. On success it issues a 7-day HttpOnly, Secure, SameSite=Lax signed session cookie. The profile reads `/api/auth/me`; logout clears the cookie.

No external client ID or client secret is required for this classic widget. Telegram OIDC was replaced because the owner configured the classic domain-based login in BotFather.

**Important:** This authenticates Telegram identity only. It does not yet persist customer accounts or orders in a user database. Real checkout/payment is not enabled.

## Deployment

This branch currently builds on the VIONA v15 feature branch. Merge the parent V15 PR into main first, then merge the Telegram PR (or rebase its target to main) and allow Render to deploy. Setting environment variables alone does not publish code.

## Verify after deploy

1. `/api/auth/config` reports `{"telegram":true,"mode":"widget","botUsername":"viona_appbot"}`.
2. VIONA ID displays the official Telegram login button.
3. Complete authorization with Telegram, then confirm VIONA ID shows your Telegram identity.
4. Reload: session persists; click logout: identity disappears.
5. Tampered signatures, expired timestamps and unknown fields are rejected.
6. Test mobile layout and all five worlds.

Static syntax checks do not replace real browser/security integration testing.
