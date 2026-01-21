import { OAuth2Client } from "google-auth-library";

import { getRequiredEnv } from "../utils/env.js";
import { UserModel } from "../db/models/User.js";
import { signAccessToken } from "../utils/jwt.js";

export interface GoogleLoginInput {
  credential: string; // ID token tá»« Google Identity Services
}

export const googleAuthService = {
  async loginWithGoogle(input: GoogleLoginInput) {
    const clientId = getRequiredEnv("GOOGLE_CLIENT_ID");
    const client = new OAuth2Client(clientId);

    const ticket = await client.verifyIdToken({
      idToken: input.credential,
      audience: clientId
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const sub = payload?.sub;

    if (!email || !sub) {
      return { message: "KhĂ´ng thá»ƒ xĂ¡c thá»±c Google." };
    }

    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({
        email,
        provider: "google",
        googleId: sub
      });
    }

    const token = signAccessToken({ userId: String(user._id) });
    return { token, user: { id: String(user._id), email: user.email } };
  }
};
