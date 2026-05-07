"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { createLedger } = require("./server/coin-ledger");

const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || "0.0.0.0";
const ROOT_DIR = __dirname;
const DATA_DIR = process.env.SAPITO_DATA_DIR || path.join(ROOT_DIR, "server", "data");
const ADMIN_TOKEN = process.env.SAPITO_API_ADMIN_TOKEN || "";
const DISCORD_APPLICATION_ID = process.env.DISCORD_APPLICATION_ID || "";
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || "";
const DISCORD_API_BASE = process.env.DISCORD_API_BASE || "https://discord.com/api/v10";

const COIN_PACKS = {
  pack1: { coins: 3, usd: 0.99, discordSkuId: process.env.DISCORD_SKU_PACK1 || "" },
  pack2: { coins: 8, usd: 1.99, discordSkuId: process.env.DISCORD_SKU_PACK2 || "" },
  pack5: { coins: 20, usd: 4.99, discordSkuId: process.env.DISCORD_SKU_PACK5 || "" }
};

const ledger = createLedger({
  storagePath: path.join(DATA_DIR, "coin-ledger.json")
});

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  res.end(`${JSON.stringify(payload, null, 2)}\n`);
}

function sendError(res, statusCode, message) {
  sendJson(res, statusCode, { ok: false, error: message });
}

function parseUrl(req) {
  return new URL(req.url || "/", `http://${req.headers.host || "127.0.0.1"}`);
}

function getBearerToken(req) {
  const header = String(req.headers.authorization || "");
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

function requireAdmin(req, res) {
  if (!ADMIN_TOKEN) {
    sendError(res, 503, "Server credit endpoints require SAPITO_API_ADMIN_TOKEN.");
    return false;
  }
  if (getBearerToken(req) !== ADMIN_TOKEN) {
    sendError(res, 401, "Missing or invalid admin token.");
    return false;
  }
  return true;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function getUserId(req, url, body = {}) {
  return (
    body.discordUserId ||
    body.userId ||
    req.headers["x-sapito-user-id"] ||
    url.searchParams.get("userId") ||
    "local-dev"
  );
}

function getCoinPackBySkuId(skuId) {
  const safeSkuId = String(skuId || "").trim();
  return Object.entries(COIN_PACKS).find(([, pack]) => pack.discordSkuId === safeSkuId) || null;
}

function normalizeSnowflake(value, label) {
  const safe = String(value || "").trim();
  if (!/^\d{12,30}$/.test(safe)) {
    throw new Error(`${label} is missing or invalid.`);
  }
  return safe;
}

async function discordApiRequest(apiPath, options = {}) {
  if (!DISCORD_BOT_TOKEN) {
    throw new Error("DISCORD_BOT_TOKEN is required before real Discord purchases can be verified.");
  }
  if (typeof fetch !== "function") {
    throw new Error("This Node runtime does not support fetch; use Node 18+ for Discord verification.");
  }

  const response = await fetch(`${DISCORD_API_BASE}${apiPath}`, {
    method: options.method || "GET",
    headers: {
      authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      "content-type": "application/json"
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const text = await response.text();
  let payload = null;
  if (text.trim()) {
    try {
      payload = JSON.parse(text);
    } catch (error) {
      payload = { message: text };
    }
  }

  if (!response.ok) {
    const message = payload && payload.message ? payload.message : `Discord API returned ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

async function fetchDiscordEntitlement(entitlementId) {
  return discordApiRequest(`/applications/${DISCORD_APPLICATION_ID}/entitlements/${entitlementId}`);
}

async function consumeDiscordEntitlement(entitlementId) {
  await discordApiRequest(`/applications/${DISCORD_APPLICATION_ID}/entitlements/${entitlementId}/consume`, {
    method: "POST"
  });
}

function entitlementHasEnded(entitlement) {
  if (!entitlement || !entitlement.ends_at) return false;
  const endsAt = Date.parse(entitlement.ends_at);
  return Number.isFinite(endsAt) && endsAt <= Date.now();
}

async function claimDiscordEntitlement(body) {
  const entitlementId = normalizeSnowflake(body.entitlementId, "entitlementId");
  const transactionId = `discord-entitlement:${entitlementId}`;
  const entitlement = await fetchDiscordEntitlement(entitlementId);
  const applicationId = String(entitlement && entitlement.application_id || "");
  const skuId = String(entitlement && entitlement.sku_id || "");
  const userId = normalizeSnowflake(entitlement && entitlement.user_id, "Discord user id");

  if (applicationId !== DISCORD_APPLICATION_ID) {
    throw new Error("Discord entitlement belongs to a different application.");
  }

  const packMatch = getCoinPackBySkuId(skuId);
  if (!packMatch) {
    throw new Error("Discord entitlement SKU is not a Sapito Coins pack.");
  }

  const [packId, pack] = packMatch;
  const requestedPackId = String(body.packId || "").trim();
  if (requestedPackId && requestedPackId !== packId) {
    throw new Error("Discord entitlement does not match the requested pack.");
  }

  const existingCredit = ledger.getCreditByTransactionId(transactionId);
  if (existingCredit) {
    return {
      credited: false,
      duplicate: true,
      userId: existingCredit.userId,
      coinBalance: ledger.getBalance(existingCredit.userId),
      packId,
      amount: pack.coins,
      entitlementId
    };
  }

  if (entitlement.deleted || entitlement.consumed || entitlementHasEnded(entitlement)) {
    throw new Error("Discord entitlement is not available to claim.");
  }

  await consumeDiscordEntitlement(entitlementId);

  const result = ledger.creditCoins({
    userId,
    amount: pack.coins,
    source: "purchase",
    transactionId,
    reason: `Discord purchase ${packId}`,
    metadata: {
      packId,
      usd: pack.usd,
      discordSkuId: pack.discordSkuId,
      entitlementId,
      provider: "discord"
    }
  });

  return {
    credited: result.credited,
    duplicate: result.duplicate,
    userId,
    coinBalance: result.balance,
    packId,
    amount: pack.coins,
    entitlementId
  };
}

function serveStatic(req, res, url) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    sendError(res, 405, "Method not allowed.");
    return;
  }

  const requestedPath = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = path.resolve(ROOT_DIR, `.${requestedPath}`);

  if (!filePath.startsWith(ROOT_DIR) || filePath.includes(`${path.sep}server${path.sep}data${path.sep}`)) {
    sendError(res, 403, "Forbidden.");
    return;
  }

  fs.stat(filePath, (statError, stat) => {
    if (statError || !stat.isFile()) {
      sendError(res, 404, "Not found.");
      return;
    }
    const type = MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, {
      "content-type": type,
      "cache-control": "no-store"
    });
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    fs.createReadStream(filePath).pipe(res);
  });
}

async function handleApi(req, res, url) {
  if (url.pathname === "/api/health" && req.method === "GET") {
    sendJson(res, 200, {
      ok: true,
      app: "sapito",
      ledger: "ready",
      adminCreditEndpoints: ADMIN_TOKEN ? "enabled" : "locked",
      discordPurchaseVerification: DISCORD_BOT_TOKEN ? "enabled" : "locked"
    });
    return;
  }

  if (url.pathname === "/api/coins/packs" && req.method === "GET") {
    sendJson(res, 200, {
      ok: true,
      packs: Object.fromEntries(Object.entries(COIN_PACKS).map(([packId, pack]) => [
        packId,
        {
          coins: pack.coins,
          usd: pack.usd,
          discordSkuId: pack.discordSkuId
        }
      ]))
    });
    return;
  }

  if (url.pathname === "/api/discord/session" && req.method === "POST") {
    const body = await readJsonBody(req);
    const userId = getUserId(req, url, body);
    sendJson(res, 200, {
      ok: true,
      userId,
      coinBalance: ledger.getBalance(userId),
      note: "Local session scaffold. Production must verify Discord identity before trusting this user id."
    });
    return;
  }

  if (url.pathname === "/api/coins/balance" && req.method === "GET") {
    const userId = getUserId(req, url);
    sendJson(res, 200, {
      ok: true,
      userId,
      coinBalance: ledger.getBalance(userId)
    });
    return;
  }

  if (url.pathname === "/api/coins/verify" && req.method === "POST") {
    if (!requireAdmin(req, res)) return;
    const body = await readJsonBody(req);
    const pack = COIN_PACKS[String(body.packId || "")];
    if (!pack) {
      sendError(res, 400, "Unknown coin pack.");
      return;
    }
    const result = ledger.creditCoins({
      userId: getUserId(req, url, body),
      amount: pack.coins,
      source: "purchase",
      transactionId: body.transactionId,
      reason: `Verified purchase ${body.packId}`,
      metadata: {
        packId: body.packId,
        usd: pack.usd,
        discordSkuId: pack.discordSkuId,
        provider: body.provider || "discord"
      }
    });
    sendJson(res, 200, { ok: true, ...result });
    return;
  }

  if (url.pathname === "/api/coins/discord-claim" && req.method === "POST") {
    const body = await readJsonBody(req);
    const result = await claimDiscordEntitlement(body);
    sendJson(res, 200, { ok: true, ...result });
    return;
  }

  if (url.pathname === "/api/coins/win" && req.method === "POST") {
    if (!requireAdmin(req, res)) return;
    const body = await readJsonBody(req);
    const result = ledger.creditCoins({
      userId: getUserId(req, url, body),
      amount: body.amount,
      source: "win",
      transactionId: body.transactionId,
      reason: body.reason || "Verified game reward",
      metadata: {
        level: body.level,
        gameRunId: body.gameRunId
      }
    });
    sendJson(res, 200, { ok: true, ...result });
    return;
  }

  sendError(res, 404, "API route not found.");
}

const server = http.createServer((req, res) => {
  const url = parseUrl(req);
  if (url.pathname.startsWith("/api/")) {
    handleApi(req, res, url).catch((error) => {
      sendError(res, 500, error.message || "Internal server error.");
    });
    return;
  }
  serveStatic(req, res, url);
});

server.listen(PORT, HOST, () => {
  const displayHost = HOST === "0.0.0.0" ? "127.0.0.1" : HOST;
  console.log(`Sapito server running at http://${displayHost}:${PORT}/`);
  console.log(`Coin ledger: ${path.join(DATA_DIR, "coin-ledger.json")}`);
});
