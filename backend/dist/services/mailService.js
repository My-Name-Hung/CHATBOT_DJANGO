import path from "node:path";
import nodemailer from "nodemailer";
import { getRequiredEnv } from "../utils/env.js";
function buildOtpEmailHtml(otp) {
    // KhĂ´ng dĂ¹ng gradient, bĂ¡m palette Neo Tech Dark
    return `
<div style="background:#0D0F12;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#111418;border:1px solid #2A2E35;border-radius:16px;overflow:hidden;">
    <div style="padding:20px 24px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #2A2E35;background:#111418;">
      <img src="cid:chatsf-logo" alt="ChatSF" style="width:36px;height:36px;object-fit:contain;" />
      <div style="color:#E6EEF8;font-weight:700;font-size:18px;letter-spacing:-0.3px;">ChatSF</div>
    </div>
    <div style="padding:24px;">
      <div style="color:#E6EEF8;font-size:18px;font-weight:600;margin-bottom:8px;">MĂ£ xĂ¡c thá»±c OTP</div>
      <div style="color:#A9B4C6;font-size:14px;line-height:1.6;margin-bottom:16px;">
        Báº¡n Ä‘ang Ä‘Äƒng kĂ½ tĂ i khoáº£n ChatSF. Vui lĂ²ng dĂ¹ng mĂ£ OTP dÆ°á»›i Ä‘Ă¢y Ä‘á»ƒ hoĂ n táº¥t Ä‘Äƒng kĂ½.
      </div>
      <div style="display:flex;justify-content:center;margin:18px 0;">
        <div style="font-size:28px;letter-spacing:6px;font-weight:800;color:#4C9EFF;background:#1A1D23;border:1px solid #2A2E35;border-radius:12px;padding:14px 18px;">
          ${otp}
        </div>
      </div>
      <div style="color:#8C96A8;font-size:13px;line-height:1.6;">
        MĂ£ cĂ³ hiá»‡u lá»±c trong <b style="color:#E6EEF8;">10 phĂºt</b>. Náº¿u khĂ´ng pháº£i báº¡n thá»±c hiá»‡n, hĂ£y bá» qua email nĂ y.
      </div>
    </div>
    <div style="padding:16px 24px;border-top:1px solid #2A2E35;background:#111418;color:#8C96A8;font-size:12px;">
      Â© ${new Date().getFullYear()} ChatSF. Báº£o máº­t & an toĂ n lĂ  Æ°u tiĂªn hĂ ng Ä‘áº§u.
    </div>
  </div>
</div>
  `;
}
export async function sendOtpEmail(input) {
    const host = getRequiredEnv("MAIL_SERVER");
    const port = Number(getRequiredEnv("MAIL_PORT"));
    const user = getRequiredEnv("MAIL_USERNAME");
    const pass = getRequiredEnv("MAIL_PASSWORD");
    const defaultSender = process.env.MAIL_DEFAULT_SENDER || user;
    const useTls = (process.env.MAIL_USE_TLS || "true").toLowerCase() === "true";
    const useSsl = (process.env.MAIL_USE_SSL || "false").toLowerCase() === "true";
    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: useSsl,
        auth: { user, pass },
        ...(useTls ? { requireTLS: true, tls: { rejectUnauthorized: false } } : {})
    });
    const html = buildOtpEmailHtml(input.otp);
    await transporter.sendMail({
        from: `ChatSF <${defaultSender}>`,
        to: input.to,
        subject: "[ChatSF] MĂ£ OTP xĂ¡c thá»±c Ä‘Äƒng kĂ½",
        html,
        attachments: [
            {
                filename: "logo.png",
                path: path.resolve("src/assets/logo.png"),
                cid: "chatsf-logo"
            }
        ]
    });
}
