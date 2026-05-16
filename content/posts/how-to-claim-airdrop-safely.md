---
title: "How to Claim a Crypto Airdrop Safely (Without Getting Drained)"
excerpt: "Step-by-step safety playbook for claiming any crypto airdrop without losing your wallet to phishing or malicious approvals."
category: airdrops
tags: [airdrops, safety, security]
date: 2025-04-25
---

Airdrops are free money — until they aren't. Most "I lost my wallet" stories come from one of three mistakes. Here's how to never make them.

## The 3 ways people get drained

1. **Phishing site copies** — fake `linea[.]build` instead of `linea.build`. You connect wallet, sign one transaction, lose everything.
2. **Malicious approvals** — you sign `setApprovalForAll` for an NFT contract that turns out to be malicious. The contract now has unlimited access to drain that NFT collection.
3. **Permit / off-chain signatures** — you sign a meta-transaction that gives a contract unlimited token allowance. Visible on chain, but you didn't pay gas, so you might not even realize you signed it.

## The safety playbook

### 1. Use a burner wallet

Don't use your main wallet. Create a fresh MetaMask/Phantom wallet, fund it with only the amount needed for the airdrop activity. If something goes wrong, your main wallet is untouched.

### 2. Bookmark the official URL

Once you find the official URL, **bookmark it**. Never click links from:
- Twitter DMs (always fake)
- Discord DMs (always fake)
- Google ads (often fake — Google's review is lax)
- "Support" agents (always fake)

### 3. Read every transaction

Hardware wallet users: read the screen. Software wallet users: expand the data tab and check what method is being called.

Watch for these red flags:
- `setApprovalForAll` to an unknown contract
- `approve` with an unlimited value (`2^256 - 1`)
- `transferFrom` calling YOUR address (someone's pulling tokens out of you)
- A request that asks for "permission to spend" instead of a normal swap

### 4. Use revoke.cash monthly

Visit [revoke.cash](https://revoke.cash), connect your wallet, and revoke any approvals you don't need. Costs a few rupees in gas. Saves your wallet.

### 5. Use a hardware wallet for the main bag

For anything > $200, a Ledger or Trezor is non-negotiable. The private keys never leave the device, even if your computer is fully compromised.

## The "is this a scam?" sniff test

Before connecting wallet, ask:

| Sniff test | Why |
|---|---|
| Did this URL come from official Twitter/blog/docs? | Phishing sites can't bait you here |
| Is the contract verified on Etherscan/Solscan? | Unverified = anything could be in the code |
| Are people on r/cryptocurrency claiming it works? | Reddit moderation usually catches scams within hours |
| Does the team have a public, doxxed CTO? | Anon teams = higher rug risk |

If 3 of these are "no", skip the airdrop.

## What to do if you get drained

1. **Move remaining funds immediately** — open a new wallet, send everything to it.
2. **Revoke all approvals** on the compromised wallet at revoke.cash.
3. **File an FIR** in India if the amount is significant. The cyber cell can sometimes trace exchange withdrawals.
4. **Report to the exchange** if the drainer sent funds to an exchange (CoinDCX/WazirX/Binance) — they sometimes freeze the account.

Sadly, most drained funds are gone forever. Prevention > recovery.

## TL;DR

- Burner wallet ✓
- Bookmark official URLs ✓
- Read every signature ✓
- Revoke monthly ✓
- Hardware wallet for main bag ✓

Stay safe. Now go check out our [curated airdrops →](/airdrops).
