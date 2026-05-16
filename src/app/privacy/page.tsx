import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "AirdropIndia privacy policy.",
};

export default function PrivacyPage() {
  return (
    <article className="container-prose prose-invert py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy</h1>
      <p className="mt-4 text-zinc-400">
        We store only what you explicitly give us: your email if you subscribe
        to alerts, and your saved tax calculations if you log in. No tracking
        across the web, no third-party ad cookies. Vercel Analytics is privacy-
        friendly and anonymized.
      </p>
      <h2 className="mt-8 text-xl font-semibold">What we store</h2>
      <ul className="mt-3 space-y-2 text-sm text-zinc-300">
        <li>• Email + chain preferences (if subscribed)</li>
        <li>• Saved tax calculations (if logged in with Google)</li>
        <li>• Anonymous page-view counts (Vercel Analytics)</li>
      </ul>
      <h2 className="mt-8 text-xl font-semibold">Your rights</h2>
      <p className="mt-3 text-sm text-zinc-400">
        Click &ldquo;Unsubscribe&rdquo; in any email to remove yourself. Delete
        your saved calculations any time from your dashboard. Email us to delete
        your account entirely.
      </p>
    </article>
  );
}
