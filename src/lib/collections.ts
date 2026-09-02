import { ITEM_COLLECTIONS, type ItemCollection } from "@/lib/constants";
import {
  Affiliation,
  Certificate,
  Education,
  Experience,
  Project,
  Skill,
  Training,
} from "@/models/items";

const MODEL_MAP = {
  experience: Experience,
  education: Education,
  affiliations: Affiliation,
  certificates: Certificate,
  trainings: Training,
  projects: Project,
  skills: Skill,
} as const;

export function isItemCollection(value: string): value is ItemCollection {
  return (ITEM_COLLECTIONS as readonly string[]).includes(value);
}

// Mongoose collection models have incompatible generic signatures across unions.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCollectionModel(key: ItemCollection): any {
  return MODEL_MAP[key];
}
