import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeading } from "@/components/ui/page-heading";
import { COLLECTION_CONFIG } from "@/lib/collection-config";
import type { ItemCollection } from "@/lib/constants";
import { getAdminCounts } from "@/lib/portfolio";

export default async function AdminHomePage() {
  const counts = await getAdminCounts();

  return (
    <div className="space-y-8">
      <PageHeading
        kicker="Dashboard"
        title="Overview"
        description="Content lives in MongoDB. Add, hide, or reorder anything — the public site follows."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Object.values(COLLECTION_CONFIG).map((collection) => (
          <Link key={collection.key} href={`/admin/${collection.key}`}>
            <Card className="p-6 transition-colors hover:ring-accent/40">
              <p className="text-[11px] tracking-[0.2em] text-muted uppercase">{collection.title}</p>
              <p className="font-display mt-3 text-4xl tracking-tight">{counts[collection.key as ItemCollection]}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
