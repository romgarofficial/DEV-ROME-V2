import { notFound } from "next/navigation";
import { EntityManager } from "@/components/admin/entity-manager";
import { customSectionItemsConfig } from "@/lib/collection-config";
import { isCustomSection } from "@/lib/constants";
import { dbConnect } from "@/lib/db";
import { Section } from "@/models";

export const dynamic = "force-dynamic";

export default async function CustomSectionItemsPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  await dbConnect();
  const section = await Section.findOne({ key }).lean();
  if (!section || !isCustomSection(section)) notFound();
  return <EntityManager config={customSectionItemsConfig(section)} />;
}
