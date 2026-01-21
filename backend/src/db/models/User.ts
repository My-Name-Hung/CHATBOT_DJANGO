import mongoose, { type InferSchemaType } from "mongoose";

type Provider = "email" | "google";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: false },
    provider: {
      type: String,
      required: true,
      enum: ["email", "google"],
      default: "email"
    },
    googleId: { type: String, required: false }
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
  provider: Provider;
};

export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);
