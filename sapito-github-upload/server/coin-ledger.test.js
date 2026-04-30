"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createLedger } = require("./coin-ledger");

function makeLedger() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sapito-ledger-test-"));
  return createLedger({
    storagePath: path.join(dir, "ledger.json")
  });
}

test("credits a purchase once per transaction id", () => {
  const ledger = makeLedger();
  const first = ledger.creditCoins({
    userId: "discord-user-1",
    amount: 8,
    source: "purchase",
    transactionId: "discord-entitlement-abc",
    reason: "pack2"
  });
  const duplicate = ledger.creditCoins({
    userId: "discord-user-1",
    amount: 8,
    source: "purchase",
    transactionId: "discord-entitlement-abc",
    reason: "pack2 duplicate"
  });

  assert.equal(first.credited, true);
  assert.equal(first.balance, 8);
  assert.equal(duplicate.credited, false);
  assert.equal(duplicate.duplicate, true);
  assert.equal(ledger.getBalance("discord-user-1"), 8);
  assert.equal(ledger.listCredits("discord-user-1").length, 1);
  assert.equal(ledger.getCreditByTransactionId("discord-entitlement-abc").amount, 8);
  assert.equal(ledger.getCreditByTransactionId("missing-entitlement"), null);
});

test("credits win rewards and keeps users separated", () => {
  const ledger = makeLedger();
  ledger.creditCoins({
    userId: "discord-user-1",
    amount: 2,
    source: "win",
    transactionId: "game-run-1-level-8"
  });
  ledger.creditCoins({
    userId: "discord-user-2",
    amount: 5,
    source: "win",
    transactionId: "game-run-2-level-16"
  });

  assert.equal(ledger.getBalance("discord-user-1"), 2);
  assert.equal(ledger.getBalance("discord-user-2"), 5);
  assert.equal(ledger.listCredits("discord-user-1")[0].source, "win");
});

test("rejects invalid credits", () => {
  const ledger = makeLedger();

  assert.throws(() => {
    ledger.creditCoins({
      userId: "discord-user-1",
      amount: 0,
      source: "purchase",
      transactionId: "bad-amount"
    });
  }, /positive integer/);

  assert.throws(() => {
    ledger.creditCoins({
      userId: "discord-user-1",
      amount: 3,
      source: "browser-cheat",
      transactionId: "bad-source"
    });
  }, /unsupported credit source/);
});
