import mongoose, { Schema } from "mongoose";
import { getModel } from "@/lib/model";

export type SectionKind = "system" | "custom";

export type SectionRecord = {
  key: string;
  label: string;
  visible: boolean;
  order: number;
  kind: SectionKind;
  kicker?: string;
  heading?: string;
  body?: string;
  imageUrl?: string;
  imageAlt?: string;
};

const SectionSchema = new Schema<SectionRecord>(
  {
    key: { type: String, required: true, unique: true, lowercase: true, trim: true },
    label: { type: String, required: true, trim: true, maxlength: 60 },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    kind: { type: String, enum: ["system", "custom"], required: true, default: "system" },
    kicker: { type: String, default: "", maxlength: 80 },
    heading: { type: String, default: "", maxlength: 120 },
    body: { type: String, default: "", maxlength: 20000 },
    imageUrl: { type: String, default: "" },
    imageAlt: { type: String, default: "", maxlength: 200 },
  },
  { timestamps: true },
);

if (mongoose.models.Section) {
  const cached = mongoose.models.Section;
  const keyPath = cached.schema.path("key") as { enumValues?: unknown[] } | undefined;
  const hasEnum = Boolean(keyPath?.enumValues && keyPath.enumValues.length > 0);
  if (!cached.schema.path("kind") || hasEnum) {
    mongoose.deleteModel("Section");
  }
}

export const Section = getModel<SectionRecord>("Section", SectionSchema);
