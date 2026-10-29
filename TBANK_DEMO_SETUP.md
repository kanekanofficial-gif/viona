# T-Bank test checkout (DEMO only)

1. In T-Bank merchant cabinet, **rotate the DEMO password exposed in the screenshot**.
2. In Render server environment (never in GitHub or browser), set:
   - `TBANK_DEMO_TERMINAL` = the DEMO terminal key ending in `DEMO`
   - `TBANK_DEMO_PASSWORD` = the newly rotated DEMO password
   - `PUBLIC_BASE_URL` = `https://viona.space`
   - `DATABASE_URL` = the existing PostgreSQL URL
3. Deploy the PR after review. The demo checkout button appears only when the server has the above configuration and database.
4. Log in via Telegram, add a fixed-price item, open cart -> checkout -> **Тестовая оплата Т-Банк**. T-Bank hosts the card form. Test card details must come from the bank's own test documentation.
5. Configure T-Bank DEMO notifications to `https://viona.space/api/payments/test/notification` (also passed during Init). The endpoint checks SHA-256 token and records **demo-only** status. It never marks real orders paid or releases digital goods.

**Safety:** The DEMO terminal is required (suffix `DEMO`), and amounts are recomputed server-side from catalog prices. The checkout requires Telegram sign-in. No production terminal fallback. No real charges or fulfillment. Status checks are authenticated.

**Not yet included:** receipts/tax handling, live payments, refunds, digital fulfillment, or switching production payments on.
