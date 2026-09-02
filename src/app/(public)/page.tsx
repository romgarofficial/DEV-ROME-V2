import { SectionRenderer } from "@/components/sections/renderer";
import { getPortfolio } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getPortfolio();

  if (!data.dbReady) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-24">
        <p className="text-[11px] tracking-[0.28em] text-muted uppercase">Setup</p>
        <h1 className="font-display mt-3 text-4xl tracking-tight">Connect MongoDB to load the portfolio</h1>
        <p className="mt-4 text-muted">
          Copy <code className="text-foreground">.env.example</code> to{" "}
          <code className="text-foreground">.env.local</code>, set{" "}
          <code className="text-foreground">MONGODB_URI</code>, then restart the dev server. The first
          request will seed an admin user, profile, and sample sections.
        </p>
        {data.error ? <p className="mt-4 text-sm text-red-400">{data.error}</p> : null}
      </section>
    );
  }

  return <SectionRenderer data={data} />;
}
