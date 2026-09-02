import { Schema } from "mongoose";
import { getModel } from "@/lib/model";

export type UserRecord = {
  email: string;
  passwordHash: string;
  name: string;
  role: "admin";
};

const UserSchema = new Schema<UserRecord>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" },
  },
  { timestamps: true },
);

export const User = getModel<UserRecord>("User", UserSchema);
