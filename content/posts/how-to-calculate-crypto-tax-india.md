---
title: "How to Calculate Crypto Tax in India — Step by Step (With Examples)"
excerpt: "The exact 4-step formula to compute Indian crypto tax, with three worked examples covering profit, loss, and a high-volume trade."
category: tax-guide
tags: [tax, india, calculator, examples]
date: 2025-04-15
---

You don't need a CA degree to compute Indian crypto tax. You need four numbers and a calculator. Here's the process.

## Step 1 — Find your profit (or loss)

For every transfer (sell or swap), compute:

```
Profit = (Sale value in INR) − (Cost of acquisition in INR)
```

Cost of acquisition = what you paid to buy the token. That's it — no fees, no internet bill, no gas, nothing else.

If the result is positive, you have a **profit**. If negative, a **loss**.

## Step 2 — Apply 30% flat tax to profits only

Under Section 115BBH:

- Profits are taxed at **30% flat**, no slab benefit.
- Losses are **ignored** for tax purposes — you cannot offset them against other income or carry them forward.

So your taxable gain is `max(0, profit)`.

```
Base tax = 30% × max(0, profit)
```

## Step 3 — Add 4% cess (and optionally surcharge)

The Health & Education Cess is 4% of the tax. So:

```
Cess = 4% × base tax
Total tax = base tax + cess
```

That's an effective **31.2%**.

If your total income is high, also add the surcharge before the cess:
- ₹50L–1Cr: 10%
- ₹1Cr–2Cr: 15%
- ₹2Cr–5Cr: 25%
- > ₹5Cr: 37%

## Step 4 — Compute 1% TDS (Section 194S)

If your aggregate VDA sales in the FY cross the threshold (₹10,000 for most, ₹50,000 for specified persons), 1% TDS applies:

```
TDS = 1% × sale value
```

This is withheld by the buyer/exchange. You claim it back in your ITR.

## Example 1 — Small profit on BTC

- Buy 0.01 BTC at ₹40,00,000
- Sell at ₹50,00,000

| Step | Value |
|---|---|
| Buy total | ₹40,000 |
| Sale total | ₹50,000 |
| Profit | ₹10,000 |
| Base tax (30%) | ₹3,000 |
| Cess (4%) | ₹120 |
| **Total tax** | **₹3,120** |
| TDS (₹50k crosses ₹10k) | ₹500 |
| Net cash | ₹46,380 |

## Example 2 — Loss on a memecoin

- Buy 50,000 tokens at ₹2 each (total ₹1,00,000)
- Sell at ₹0.50 each (total ₹25,000)
- Loss: ₹75,000 — but **dead capital**. Tax = ₹0. You can't offset other gains.

## Example 3 — Big trade with TDS

- Buy 5 ETH at ₹2,00,000 each (₹10,00,000 total)
- Sell at ₹2,50,000 each (₹12,50,000 total)

| Step | Value |
|---|---|
| Profit | ₹2,50,000 |
| Base tax (30%) | ₹75,000 |
| Cess (4%) | ₹3,000 |
| **Total tax** | **₹78,000** |
| TDS (1% × ₹12.5L) | ₹12,500 |
| Net cash | ₹11,59,500 |

## What about swaps?

Swapping ETH → USDT is a *transfer*. Compute it the same way: cost of acquisition of ETH vs INR fair-value of the USDT received. Then your cost basis for USDT is whatever INR value it had on swap day.

## Save the numbers

We made this calculator so you don't have to redo this by hand. [Open it now →](/tax)

You can save calculations to your history, download a PDF, and ask the AI to explain the result in Hinglish if 31.2% feels confusing.

---

*Not tax advice. Always validate with a CA before filing.*
