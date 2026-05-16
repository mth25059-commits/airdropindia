import { NextResponse, type NextRequest } from "next/server";
import { calculateTax, type SurchargeBracket } from "@/lib/tax/calculator";
import { renderTaxPdf } from "@/lib/tax/pdf";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const buyPrice = parseFloat(searchParams.get("buyPrice") ?? "0");
  const sellPrice = parseFloat(searchParams.get("sellPrice") ?? "0");
  const quantity = parseFloat(searchParams.get("quantity") ?? "0");
  const buyDate = searchParams.get("buyDate") ?? "";
  const sellDate = searchParams.get("sellDate") ?? "";
  const asset = searchParams.get("asset") ?? "";
  const surcharge = parseFloat(searchParams.get("surcharge") ?? "0") as SurchargeBracket;
  const specifiedPerson = searchParams.get("specifiedPerson") === "1";
  const yearlyTransferTotal = parseFloat(searchParams.get("yearlyTransferTotal") ?? "0");

  const input = {
    assetName: asset || undefined,
    buyPrice,
    sellPrice,
    quantity,
    buyDate,
    sellDate,
    surchargeOverride: surcharge,
    isSpecifiedPerson: specifiedPerson,
    yearlyTransferTotal: yearlyTransferTotal || undefined,
  };
  const result = calculateTax(input);

  try {
    const buffer = await renderTaxPdf({ input, result });
    const body = new Uint8Array(buffer);
    return new NextResponse(body, {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="CryptoTaxIndia-${Date.now()}.pdf"`,
      },
    });
  } catch (e) {
    console.error("PDF render error:", e);
    return NextResponse.json(
      { ok: false, message: "Could not generate PDF." },
      { status: 500 },
    );
  }
}
