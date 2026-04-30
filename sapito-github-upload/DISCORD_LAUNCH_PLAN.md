# Sapito Discord Launch Plan

## Goal

Sapito is a free Discord game. Money comes from selling Sapito Coins. Coins buy puzzle pieces, food packs, skins, colors, and tattoos.

## Current App Status

- The game runs as a static web app at `index.html`.
- A local Node server scaffold now serves the app and exposes protected coin ledger endpoints.
- Public legal pages are hosted on GitHub Pages:
  - Terms: `https://ranaasistente-pixel.github.io/sapito/terms.html`
  - Privacy: `https://ranaasistente-pixel.github.io/sapito/privacy.html`
- Demo coin top-up is off.
- Client-side payment return credit is off. A URL like `?coin_paid=pack5` must not grant coins in public.
- The in-app Legal Notice now tells players purchases are final except where law/platform policy requires otherwise, Sapito is entertainment only, Sapito Coins have no cash value, and malfunctions should be reported for review.
- Coin packs exist in the UI:
  - `pack1`: 3 coins for $0.99, Discord SKU `1499163258878300205`
  - `pack2`: 8 total coins for $1.99 (7 + 1 bonus), Discord SKU `1499169911543562250`
  - `pack5`: 20 coins for $4.99, Discord SKU `1499170403325706412`

## Recommended Discord Payment Path

Use Discord native app monetization for Sapito Coins:

1. Create consumable SKU products in the Discord Developer Portal. Done.
2. Map those SKU IDs to `COIN_PAYMENT.discordSkuIds`. Done.
3. In the Discord Activity, call Discord's purchase flow for the selected pack. Implemented with `startPurchase({ sku_id })`.
4. Verify the purchase on a backend using Discord entitlement data. Implemented as `POST /api/coins/discord-claim`.
5. Credit Sapito Coins from the backend only. Implemented in the ledger.
6. Return the updated coin balance to the client. Implemented after a successful claim.

Do not trust client localStorage, URL query params, or browser JS for real-money coin credit.

Discord notes to keep in mind:

- Discord Activities are single page web apps hosted in an iframe.
- The Embedded App SDK is the bridge between Sapito and the Discord client.
- The SDK exposes `getSkus`, `getEntitlements`, and `startPurchase`.
- `startPurchase` is documented for web, but not iOS or Android, so mobile purchase UX needs a fallback.
- Sapito Coin SKUs should be consumable products.

## Required Backend

Minimum backend endpoints:

- `POST /api/discord/session`
  - Verifies Discord user identity for the activity.
  - Returns the player's saved Sapito state and coin balance.

- `POST /api/coins/purchase-intent`
  - Receives a pack id.
  - Returns the Discord SKU or external checkout instruction.

- `POST /api/coins/verify`
  - Verifies Discord entitlement or payment webhook.
  - Credits the coin ledger exactly once.

- `GET /api/coins/balance`
  - Returns the verified Sapito Coin balance.

- `POST /api/player/save`
  - Saves non-payment game progress.

Local scaffold already added:

- `GET /api/health`
- `POST /api/discord/session`
- `GET /api/coins/balance`
- `POST /api/coins/verify`
- `POST /api/coins/discord-claim`
- `POST /api/coins/win`

The admin credit endpoints require `SAPITO_API_ADMIN_TOKEN`. Discord purchase claims require `DISCORD_BOT_TOKEN` so the server can fetch and consume entitlements. Browser/client code must not be allowed to credit real-money coins by itself.

## Coin Ledger Rules

- Store each purchase transaction or Discord entitlement id.
- Enforce idempotency: the same transaction can credit coins once only.
- Keep coin balance server-side.
- Let the client display coins, but never be the source of truth.
- Purchases of in-game items should call the backend or sync to backend before public launch.
- Credit purchased coins only after Discord/payment verification succeeds.
- Credit earned win coins when a level/stage reward is confirmed, then persist the new balance immediately.
- Keep a ledger reason/source for each credit, such as `purchase`, `win`, or `admin-adjustment`.

## Discord Activity Prep

- Add Discord Embedded App SDK.
- Configure the Activity URL in Discord Developer Portal.
- Use a production HTTPS URL, not `127.0.0.1`.
- Add a backend domain for API calls.
- Test in Discord desktop/web first.
- Decide what to show if purchase APIs are unavailable on mobile.

## Public Launch Checklist

- [ ] Replace localStorage-only coin balance with backend coin balance.
- [ ] Create Discord Application and Activity.
- [ ] Create consumable coin SKUs.
- [ ] Add SKU IDs to app config.
- [ ] Implement Discord auth/session handshake.
- [ ] Implement backend entitlement verification.
- [ ] Disable all demo/debug coin grants in production.
- [ ] Host `terms.html` and `privacy.html` on a public HTTPS URL and paste those links into Discord.
- [ ] Add full Terms, Privacy Policy, and public refund/support pages before launch.
- [ ] Have the Legal Notice/refund wording reviewed against Discord rules and local law.
- [ ] Test purchase success, cancel, duplicate webhook, and refresh flows.
- [ ] Test one account cannot edit another account's coins.
