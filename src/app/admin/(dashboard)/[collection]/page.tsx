import { notFound } from "next/navigation";
import { EntityManager } from "@/components/admin/entity-manager";
import { COLLECTION_CONFIG } from "@/lib/collection-config";
import { isItemCollection } from "@/lib/collections";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  if (!isItemCollection(collection)) notFound();
  const config = COLLECTION_CONFIG[collection];
  if (!config) notFound();
  return <EntityManager config={config} />;
}
