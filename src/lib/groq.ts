import Groq from "groq-sdk";

const GROQ_MODEL = "llama-3.1-70b-versatile";
const GROQ_MODEL_FAST = "llama-3.1-8b-instant";

let _client: Groq | null = null;

function getClient(): Groq {
  if (_client) return _client;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }
  _client = new Groq({ apiKey });
  return _client;
}

export function isGroqConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}

export interface TaxExplainInput {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  profitLoss: number;
  taxableGain: number;
  totalTax: number;
  tds: number;
  asset?: string | null;
  language?: "en" | "hinglish";
}

export async function explainTax(input: TaxExplainInput): Promise<string> {
  const lang = input.language ?? "en";
  const langInstruction =
    lang === "hinglish"
      ? "Reply in clear conversational Hinglish (Hindi-English mix in Roman script) like talking to a friend. Use rupee symbol ₹. Keep it under 180 words. Use 3 short paragraphs."
      : "Reply in clear, friendly English. Use the rupee symbol ₹. Keep it under 180 words. Use 3 short paragraphs.";

  const sys = `You are a friendly Indian crypto-tax explainer. India taxes crypto under Section 115BBH:
- Flat 30% on profits (no slab benefit, no deductions except cost of acquisition)
- +4% Health & Education cess on the 30% → 31.2% effective
- Section 194S: 1% TDS on sell transactions above ₹10,000 in a financial year
- Losses cannot offset other income or other VDAs, and cannot be carried forward
You explain the user's result in plain, friendly language. Do NOT give legal advice — always remind them to consult a CA for filing.`;

  const user = `Numbers (in INR):
Asset: ${input.asset ?? "Crypto"}
Buy price per unit: ₹${input.buyPrice}
Sell price per unit: ₹${input.sellPrice}
Quantity: ${input.quantity}
Total profit/loss: ₹${input.profitLoss.toFixed(2)} ${input.profitLoss >= 0 ? "(profit)" : "(loss)"}
Taxable gain (after 115BBH rules): ₹${input.taxableGain.toFixed(2)}
Tax payable (30% + 4% cess): ₹${input.totalTax.toFixed(2)}
TDS deducted at source (1%, if applicable): ₹${input.tds.toFixed(2)}

${langInstruction}
Explain WHY the tax is what it is, what the user should do next (set aside money, claim TDS as credit in ITR), and remind them this is informational only.`;

  const client = getClient();
  const completion = await client.chat.completions.create({
    model: GROQ_MODEL_FAST,
    temperature: 0.4,
    max_tokens: 600,
    messages: [
      { role: "system", content: sys },
      { role: "user", content: user },
    ],
  });

  return completion.choices[0]?.message?.content?.trim() ?? "";
}

export interface AirdropGuideInput {
  name: string;
  chain: string;
  description?: string | null;
  officialUrl?: string | null;
  estimatedValueUsd?: number | null;
}

export interface AirdropGuideOutput {
  title: string;
  excerpt: string;
  body: string;
  steps: Array<{ title: string; body: string }>;
}

export async function generateAirdropGuide(
  input: AirdropGuideInput,
): Promise<AirdropGuideOutput> {
  const sys = `You write detailed, no-fluff "how to claim" guides for crypto airdrops aimed at Indian users.
Style: clear, friendly, numbered steps, safety-first. Always warn about phishing and only use official links.
Output STRICT JSON with this shape:
{
  "title": "How to Claim XYZ Airdrop — Step-by-Step Guide (India)",
  "excerpt": "1-2 sentence summary for SEO meta description (max 160 chars)",
  "body": "Full markdown article 600-900 words. Sections: Intro, Eligibility, Step-by-Step, Safety Tips, Indian Tax Note (mention 30%+1% TDS), FAQs",
  "steps": [
    { "title": "Connect wallet", "body": "Use MetaMask / Phantom / etc..." },
    ...
  ]
}
The "steps" array should mirror the step-by-step section as 4–7 concise actionable cards. Reply with JSON ONLY — no prose before or after.`;

  const user = `Airdrop name: ${input.name}
Chain: ${input.chain}
Description: ${input.description ?? "(not provided)"}
Official URL: ${input.officialUrl ?? "(not provided)"}
Estimated value: ${
    input.estimatedValueUsd ? `$${input.estimatedValueUsd}` : "(unknown)"
  }

Write the guide now. Remember to include the Indian tax note and a phishing warning.`;

  const client = getClient();
  const completion = await client.chat.completions.create({
    model: GROQ_MODEL,
    temperature: 0.5,
    max_tokens: 2400,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: sys },
      { role: "user", content: user },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as AirdropGuideOutput;
  if (!parsed.title || !parsed.body) {
    throw new Error("Groq returned malformed JSON for airdrop guide.");
  }
  return parsed;
}
