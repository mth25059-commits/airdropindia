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

export function WeeklyDigestEmail({
  airdrops,
  digestUrl,
  unsubscribeUrl,
}: {
  airdrops: Array<{ name: string; url: string; chain: string }>;
  digestUrl: string;
  unsubscribeUrl: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>This week&apos;s top crypto airdrops for India</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={brand}>AirdropIndia</Heading>
          <Heading style={h1}>Top airdrops this week</Heading>
          <Text style={p}>
            Here are the fresh airdrops worth checking out — all India-friendly,
            all step-by-step guides included.
          </Text>
          <Section>
            {airdrops.map((a) => (
              <div key={a.url} style={card}>
                <Text style={cardTitle}>
                  <Link href={a.url} style={link}>
                    {a.name}
                  </Link>
                </Text>
                <Text style={cardMeta}>{a.chain}</Text>
              </div>
            ))}
          </Section>
          <Section style={btnRow}>
            <Button style={btn} href={digestUrl}>
              See all airdrops
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={pSmall}>
            Always verify the official URL.{" "}
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
const card = {
  background: "#141414",
  border: "1px solid #2a2a2a",
  borderRadius: "10px",
  padding: "14px",
  margin: "10px 0",
};
const cardTitle = { color: "#fff", fontSize: "15px", margin: 0 };
const cardMeta = { color: "#a1a1aa", fontSize: "12px", margin: "4px 0 0 0" };
const hr = { borderColor: "#2a2a2a", margin: "32px 0 16px 0" };
const link = { color: "#a78bfa", textDecoration: "underline" };
