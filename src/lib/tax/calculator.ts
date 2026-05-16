/**
 * Indian crypto tax calculator
 *
 * Implements:
 *  - Section 115BBH (Finance Act, 2022): 30% flat tax on transfer of Virtual
 *    Digital Assets (VDA). No deduction except cost of acquisition. No loss
 *    set-off, no carry-forward.
 *  - +4% Health & Education Cess on the income tax. Effective rate = 31.2%.
 *  - Optional surcharge for high-income filers (10/15/25/37% slab).
 *  - Section 194S: 1% TDS on consideration paid for transfer of VDA when
 *    aggregate consideration in the FY exceeds:
 *      ₹10,000 — general payer
 *      ₹50,000 — "specified persons" (small individuals/HUFs, etc.)
 *
 * Inputs are in INR. Quantity is a plain number (e.g. tokens).
 *
 * This is informational only and not tax advice.
 */

export const TAX_RATE = 0.3;
export const CESS_RATE = 0.04;
export const TDS_RATE = 0.01;
export const TDS_THRESHOLD_DEFAULT = 10_000;
export const TDS_THRESHOLD_SPECIFIED = 50_000;
export const EFFECTIVE_RATE = TAX_RATE * (1 + CESS_RATE); // 0.312

export type SurchargeBracket = 0 | 0.1 | 0.15 | 0.25 | 0.37;

export interface TaxInput {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  buyDate?: string;
  sellDate?: string;
  assetName?: string;
  /** Aggregate sells in this FY incl. this trade. Used to decide TDS. */
  yearlyTransferTotal?: number;
  isSpecifiedPerson?: boolean;
  /** If provided, computes surcharge based on user's total income */
  totalIncomeInr?: number;
  /** Explicit surcharge override (decimal e.g. 0.10) */
  surchargeOverride?: SurchargeBracket;
}

export interface TaxResult {
  totalBuy: number;
  totalSell: number;
  profitLoss: number;
  isProfit: boolean;
  taxableGain: number;
  baseTax: number;
  surchargeRate: SurchargeBracket;
  surcharge: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  tds: number;
  tdsThreshold: number;
  netCashFromSale: number;
  notes: string[];
}

export function surchargeFromIncome(income: number): SurchargeBracket {
  if (income > 5_00_00_000) return 0.37; // > 5 crore
  if (income > 2_00_00_000) return 0.25; // 2-5 crore
  if (income > 1_00_00_000) return 0.15; // 1-2 crore
  if (income > 50_00_000) return 0.1; // 50L-1Cr
  return 0;
}

export function calculateTax(input: TaxInput): TaxResult {
  const buyPrice = Math.max(0, Number(input.buyPrice) || 0);
  const sellPrice = Math.max(0, Number(input.sellPrice) || 0);
  const quantity = Math.max(0, Number(input.quantity) || 0);

  const totalBuy = round2(buyPrice * quantity);
  const totalSell = round2(sellPrice * quantity);
  const profitLoss = round2(totalSell - totalBuy);
  const isProfit = profitLoss > 0;
  const taxableGain = Math.max(0, profitLoss);

  const baseTax = round2(taxableGain * TAX_RATE);

  const surchargeRate: SurchargeBracket =
    input.surchargeOverride ??
    (input.totalIncomeInr != null ? surchargeFromIncome(input.totalIncomeInr) : 0);
  const surcharge = round2(baseTax * surchargeRate);

  const cess = round2((baseTax + surcharge) * CESS_RATE);
  const totalTax = round2(baseTax + surcharge + cess);

  const tdsThreshold = input.isSpecifiedPerson
    ? TDS_THRESHOLD_SPECIFIED
    : TDS_THRESHOLD_DEFAULT;
  const yearlyTotal =
    input.yearlyTransferTotal != null
      ? Math.max(input.yearlyTransferTotal, totalSell)
      : totalSell;
  const tds = yearlyTotal > tdsThreshold ? round2(totalSell * TDS_RATE) : 0;

  const effectiveRate = taxableGain > 0 ? totalTax / taxableGain : 0;
  const netCashFromSale = round2(totalSell - totalTax - tds);

  const notes: string[] = [];
  if (!isProfit) {
    notes.push(
      "Loss-making trade — Section 115BBH does not let you offset this loss against any other income or carry it forward. Your tax on this trade is ₹0, but the loss is dead capital for tax purposes.",
    );
  }
  if (yearlyTotal > tdsThreshold) {
    notes.push(
      `1% TDS under Section 194S applies because annual transfer value (≥ ₹${tdsThreshold.toLocaleString(
        "en-IN",
      )}) is crossed. The buyer/exchange should deduct it — you claim it back as a TDS credit when filing ITR.`,
    );
  } else if (totalSell > 0) {
    notes.push(
      `No 1% TDS for this trade — your annual VDA transfer total is under the ₹${tdsThreshold.toLocaleString(
        "en-IN",
      )} threshold.`,
    );
  }
  if (surchargeRate > 0) {
    notes.push(
      `Surcharge of ${(surchargeRate * 100).toFixed(0)}% added because total income > ₹${
        surchargeRate === 0.1 ? "50L" : surchargeRate === 0.15 ? "1Cr" : surchargeRate === 0.25 ? "2Cr" : "5Cr"
      }.`,
    );
  }
  notes.push(
    "Informational only — consult a Chartered Accountant before filing your ITR.",
  );

  return {
    totalBuy,
    totalSell,
    profitLoss,
    isProfit,
    taxableGain,
    baseTax,
    surchargeRate,
    surcharge,
    cess,
    totalTax,
    effectiveRate,
    tds,
    tdsThreshold,
    netCashFromSale,
    notes,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
