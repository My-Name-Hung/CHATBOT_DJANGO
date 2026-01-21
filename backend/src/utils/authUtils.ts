import crypto from "node:crypto";

export function generateOtp(length = 6): string {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i += 1) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

export function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export function isStrongPassword(password: string): boolean {
  // >= 8, cĂ³ chá»¯ hoa, chá»¯ thÆ°á»ng, sá»‘
  if (password.length < 8) return false;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  return hasLower && hasUpper && hasNumber;
}
