import type { Metadata } from "next";
import { GlassCard } from "@/components/shared/GlassCard";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "AirdropIndia privacy policy — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="container py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="gradient-text">Privacy Policy</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: May 2026</p>

        <GlassCard className="mt-8 p-6">
          <h2 className="text-lg font-semibold">Information We Collect</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            We only collect information you explicitly provide:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• <strong>Email address</strong> — when you subscribe to airdrop alerts or contact us.</li>
            <li>• <strong>Google account info</strong> — name and email when you sign in via Google OAuth. We do not access your Google contacts, calendar, or any other data.</li>
            <li>• <strong>Tax calculations</strong> — saved only if you are logged in. You can delete these any time.</li>
            <li>• <strong>Contact messages</strong> — name, email, and message when you use our contact form.</li>
            <li>• <strong>Chain preferences</strong> — your selected blockchain preferences for airdrop alerts.</li>
          </ul>
        </GlassCard>

        <GlassCard className="mt-4 p-6">
          <h2 className="text-lg font-semibold">How We Use Your Data</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• Send airdrop alerts and weekly digests to subscribers.</li>
            <li>• Save your tax calculations for future reference.</li>
            <li>• Respond to contact form messages.</li>
            <li>• Improve our services based on aggregate, anonymized usage patterns.</li>
          </ul>
        </GlassCard>

        <GlassCard className="mt-4 p-6">
          <h2 className="text-lg font-semibold">Third-Party Services</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• <strong>Supabase</strong> — database and authentication. Data stored securely with row-level security.</li>
            <li>• <strong>Vercel</strong> — hosting and analytics. Vercel Analytics is privacy-friendly and anonymized.</li>
            <li>• <strong>Resend</strong> — transactional emails. We never share your email with third parties for marketing.</li>
            <li>• <strong>Google OAuth</strong> — authentication only. We request minimal scopes (email and profile).</li>
          </ul>
        </GlassCard>

        <GlassCard className="mt-4 p-6">
          <h2 className="text-lg font-semibold">Cookies &amp; Tracking</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            We do not use third-party advertising cookies or cross-site tracking. We use essential cookies
            for authentication (session tokens) and your theme preference. Vercel Analytics collects
            anonymized, aggregate page-view data with no personally identifiable information.
          </p>
        </GlassCard>

        <GlassCard className="mt-4 p-6">
          <h2 className="text-lg font-semibold">Your Rights</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• <strong>Unsubscribe</strong> — click &ldquo;Unsubscribe&rdquo; in any email to stop alerts immediately.</li>
            <li>• <strong>Delete data</strong> — delete saved tax calculations from your dashboard at any time.</li>
            <li>• <strong>Account deletion</strong> — contact us to delete your account and all associated data entirely.</li>
            <li>• <strong>Data export</strong> — contact us to request a copy of all data we hold about you.</li>
          </ul>
        </GlassCard>

        <GlassCard className="mt-4 p-6">
          <h2 className="text-lg font-semibold">Data Security</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            All data is transmitted over HTTPS. Database access is protected with row-level security
            policies. We follow industry best practices to protect your information. However, no method
            of transmission over the internet is 100% secure.
          </p>
        </GlassCard>

        <GlassCard className="mt-4 p-6">
          <h2 className="text-lg font-semibold">Contact</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            For privacy-related questions or data requests, email us at{" "}
            <a href="mailto:dxruxx@gmail.com" className="text-brand-purple hover:underline">dxruxx@gmail.com</a>{" "}
            or use our <a href="/contact" className="text-brand-purple hover:underline">contact form</a>.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
