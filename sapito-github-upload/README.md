# Sapito Butterfly Catcher

Minimal GitHub-ready copy of the Sapito butterfly game.

## Run

```sh
npm start
```

Open:

```text
http://127.0.0.1:8080/index.html
```

## Test

```sh
npm test
```

## Production Config

For Discord purchases, set environment variables in your hosting provider. Use `.env.example` as the template. Do not commit real tokens, private keys, local data, or `server/data/`.

## What Is Included

- Game files: `index.html`, `style.css`, `script.js`
- Legal pages: `privacy.html`, `terms.html`
- Local server/API: `server.js`
- Coin ledger code and tests
- Only the image assets referenced by the game

## What Is Not Included

- `node_modules`
- Local game ledger data
- Test output
- macOS `.DS_Store`
- Private Discord tokens or real SKU IDs
