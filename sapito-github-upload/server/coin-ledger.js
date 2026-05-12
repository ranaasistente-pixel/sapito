"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const DEFAULT_DATA = {
  version: 1,
  users: {},
  credits: []
};

const CREDIT_SOURCES = new Set([
  "purchase",
  "win",
  "admin-adjustment",
  "migration",
  "refund-reversal"
]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeUserId(userId) {
  const safe = String(userId || "").trim();
  if (!safe) {
    throw new Error("userId is required");
  }
  if (!/^[a-zA-Z0-9_.:-]{2,80}$/.test(safe)) {
    throw new Error("userId contains unsupported characters");
  }
  return safe;
}

function normalizeAmount(amount) {
  const safe = Math.floor(Number(amount));
  if (!Number.isFinite(safe) || safe <= 0) {
    throw new Error("amount must be a positive integer");
  }
  if (safe > 100000) {
    throw new Error("amount is too large for one credit");
  }
  return safe;
}

function normalizeSource(source) {
  const safe = String(source || "").trim();
  if (!CREDIT_SOURCES.has(safe)) {
    throw new Error(`unsupported credit source: ${safe || "(empty)"}`);
  }
  return safe;
}

function normalizeTransactionId(transactionId, source) {
  const safe = String(transactionId || "").trim();
  if (safe) return safe.slice(0, 140);
  return `${source}-${Date.now()}-${crypto.randomUUID()}`;
}

function createLedger({ storagePath }) {
  if (!storagePath) {
    throw new Error("storagePath is required");
  }

  const absoluteStoragePath = path.resolve(storagePath);

  function ensureStorageDir() {
    fs.mkdirSync(path.dirname(absoluteStoragePath), { recursive: true });
  }

  function readData() {
    ensureStorageDir();
    try {
      const raw = fs.readFileSync(absoluteStoragePath, "utf8");
      const parsed = JSON.parse(raw);
      return {
        version: 1,
        users: parsed && typeof parsed.users === "object" ? parsed.users : {},
        credits: Array.isArray(parsed && parsed.credits) ? parsed.credits : []
      };
    } catch (error) {
      if (error && error.code === "ENOENT") {
        return clone(DEFAULT_DATA);
      }
      throw error;
    }
  }

  function writeData(data) {
    ensureStorageDir();
    const tmpPath = `${absoluteStoragePath}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(tmpPath, `${JSON.stringify(data, null, 2)}\n`);
    fs.renameSync(tmpPath, absoluteStoragePath);
  }

  function getOrCreateUser(data, userId) {
    if (!data.users[userId]) {
      data.users[userId] = {
        coinBalance: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    return data.users[userId];
  }

  function getBalance(userId) {
    const safeUserId = normalizeUserId(userId);
    const data = readData();
    const user = data.users[safeUserId];
    return user ? Math.max(0, Math.floor(Number(user.coinBalance) || 0)) : 0;
  }

  function listCredits(userId) {
    const safeUserId = normalizeUserId(userId);
    const data = readData();
    return data.credits
      .filter((entry) => entry.userId === safeUserId)
      .slice(-100);
  }

  function getCreditByTransactionId(transactionId) {
    const safeTransactionId = String(transactionId || "").trim();
    if (!safeTransactionId) return null;
    const data = readData();
    const existing = data.credits.find((entry) => entry.transactionId === safeTransactionId);
    return existing ? clone(existing) : null;
  }

  function creditCoins({ userId, amount, source, transactionId, reason = "", metadata = {} }) {
    const safeUserId = normalizeUserId(userId);
    const safeAmount = normalizeAmount(amount);
    const safeSource = normalizeSource(source);
    const safeTransactionId = normalizeTransactionId(transactionId, safeSource);
    const data = readData();
    const existing = data.credits.find((entry) => entry.transactionId === safeTransactionId);

    if (existing) {
      return {
        credited: false,
        duplicate: true,
        balance: getBalance(existing.userId),
        credit: clone(existing)
      };
    }

    const user = getOrCreateUser(data, safeUserId);
    user.coinBalance = Math.max(0, Math.floor(Number(user.coinBalance) || 0)) + safeAmount;
    user.updatedAt = new Date().toISOString();

    const credit = {
      id: crypto.randomUUID(),
      userId: safeUserId,
      source: safeSource,
      amount: safeAmount,
      balanceAfter: user.coinBalance,
      transactionId: safeTransactionId,
      reason: String(reason || "").slice(0, 240),
      metadata: metadata && typeof metadata === "object" ? metadata : {},
      createdAt: new Date().toISOString()
    };

    data.credits.push(credit);
    data.credits = data.credits.slice(-10000);
    writeData(data);

    return {
      credited: true,
      duplicate: false,
      balance: user.coinBalance,
      credit: clone(credit)
    };
  }

  return {
    getBalance,
    listCredits,
    getCreditByTransactionId,
    creditCoins
  };
}

module.exports = {
  createLedger,
  CREDIT_SOURCES
};
