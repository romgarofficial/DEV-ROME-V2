import { Schema } from "mongoose";
import { getModel } from "@/lib/model";
import type { SocialLink } from "@/types";

export type ProfileRecord = {
  name: string;
  title: string;
  headline: string;
  bio: string;
  photoUrl: string;
  backgroundUrl: string;
  location: string;
  email: string;
  phone: string;
  socials: SocialLink[];
  resumeUrl: string;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
  availableForWork: boolean;
};

const ProfileSchema = new Schema<ProfileRecord>(
  {
    name: { type: String, required: true },
    title: { type: String, default: "" },
    headline: { type: String, default: "" },
    bio: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    backgroundUrl: { type: String, default: "" },
    location: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    socials: {
      type: [{ platform: String, url: String }],
      default: [],
    },
    resumeUrl: { type: String, default: "" },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    ogImageUrl: { type: String, default: "" },
    availableForWork: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Profile = getModel<ProfileRecord>("Profile", ProfileSchema);
