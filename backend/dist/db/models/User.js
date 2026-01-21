import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: false },
    provider: {
        type: String,
        required: true,
        enum: ["email", "google"],
        default: "email"
    },
    googleId: { type: String, required: false }
}, { timestamps: true });
export const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
