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

export function ConfirmSubscriptionEmail({
  confirmUrl,
  unsubscribeUrl,
}: {
  confirmUrl: string;
  unsubscribeUrl: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your AirdropIndia subscription</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={brand}>AirdropIndia</Heading>
          <Heading style={h1}>Confirm your subscription</Heading>
          <Text style={p}>
            Click the button below to confirm your email and start receiving
            airdrop alerts. We&rsquo;ll only email when there&rsquo;s something worth
            your time.
          </Text>
          <Section style={btnRow}>
            <Button style={btn} href={confirmUrl}>
              Confirm email
            </Button>
          </Section>
          <Text style={pSmall}>
            Or paste this link:{" "}
            <Link href={confirmUrl} style={link}>
              {confirmUrl}
            </Link>
          </Text>
          <Hr style={hr} />
          <Text style={pSmall}>
            Didn&rsquo;t sign up? Just ignore this email.{" "}
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
