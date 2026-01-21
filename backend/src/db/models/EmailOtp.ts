import mongoose, { type InferSchemaType } from "mongoose";

const emailOtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    purpose: { type: String, required: true, enum: ["register", "reset"] },
    otpHash: { type: String, required: true },
    attempts: { type: Number, required: true, default: 0 },
    expiresAt: { type: Date, required: true, index: true }
  },
  { timestamps: true }
);

// TTL index: tá»± xĂ³a document khi háº¿t háº¡n
emailOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
emailOtpSchema.index({ email: 1, purpose: 1, createdAt: -1 });

export type EmailOtpDoc = InferSchemaType<typeof emailOtpSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const EmailOtpModel =
  mongoose.models.EmailOtp || mongoose.model("EmailOtp", emailOtpSchema);
