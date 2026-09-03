import { Schema } from "mongoose";
import { getModel } from "@/lib/model";

export type ContactMessageStatus = "unread" | "read" | "archived";

export type ContactReplyRecord = {
  html: string;
  text: string;
  createdAt: Date;
};

export type ContactMessageRecord = {
  name: string;
  email: string;
  message: string;
  status: ContactMessageStatus;
  readAt?: Date | null;
  replies: ContactReplyRecord[];
};

const ReplySchema = new Schema<ContactReplyRecord>(
  {
    html: { type: String, required: true },
    text: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const ContactMessageSchema = new Schema<ContactMessageRecord>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["unread", "read", "archived"],
      default: "unread",
      index: true,
    },
    readAt: { type: Date, default: null },
    replies: { type: [ReplySchema], default: [] },
  },
  { timestamps: true },
);

ContactMessageSchema.index({ createdAt: -1 });

export const ContactMessage = getModel<ContactMessageRecord>("ContactMessage", ContactMessageSchema);
