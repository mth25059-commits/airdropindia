import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export function NewAirdropEmail({
  airdropName,
  airdropUrl,
  chain,
  description,
  unsubscribeUrl,
}: {
  airdropName: string;
  airdropUrl: string;
  chain: string;
  description?: string | null;
  unsubscribeUrl: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>New airdrop: {airdropName}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={brand}>AirdropIndia</Heading>
          <Heading style={h1}>New airdrop: {airdropName}</Heading>
          <Text style={p}>
            <strong>Chain:</strong> {chain}
          </Text>
          {description && <Text style={p}>{description}</Text>}
          <Section style={btnRow}>
            <Button style={btn} href={airdropUrl}>
              See the step-by-step guide
            </Button>
          </Section>
          <Text style={pSmall}>
            Tip: always double-check the official URL before connecting your
            wallet. Phishing sites copy the look perfectly.
          </Text>
          <Hr style={hr} />
          <Text style={pSmall}>
            You&rsquo;re receiving this because you subscribed to airdrop alerts.{" "}
            <Link href={unsubscribeUrl} style={link}>
              Unsubscribe
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = { backgroundColor: "#0a0a0a", color: "#fafafa", margin: 0, padding: 0 };
const container = {
  maxWidth: "560px",
  margin: "0 auto",
  padding: "40px 24px",
  fontFamily:
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
};
const brand = { color: "#a78bfa", fontSize: "20px", margin: "0 0 16px 0" };
const h1 = { color: "#fff", fontSize: "26px", margin: "0 0 16px 0" };
const p = { color: "#d4d4d8", lineHeight: 1.6, fontSize: "15px" };
const pSmall = { color: "#a1a1aa", lineHeight: 1.5, fontSize: "13px" };
const btnRow = { textAlign: "center" as const, padding: "24px 0" };
const btn = {
  background: "linear-gradient(135deg,#8b5cf6 0%,#3b82f6 100%)",
  color: "#fff",
  borderRadius: "10px",
  padding: "12px 24px",
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
  display: "inline-block",
};
const hr = { borderColor: "#2a2a2a", margin: "32px 0 16px 0" };
const link = { color: "#a78bfa", textDecoration: "underline" };
