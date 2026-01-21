import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { authRouter } from "./routes/authRoutes.js";
import { chatRouter } from "./routes/chatRoutes.js";
import { historyRouter } from "./routes/historyRoutes.js";
import { connectMongo } from "./db/mongo.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware.js";
dotenv.config();
async function bootstrap() {
    const app = express();
    app.use(cors());
    app.use(express.json({ limit: "1mb" }));
    app.get("/health", (_req, res) => {
        res.json({ ok: true, name: "ChatSF API" });
    });
    app.use("/auth", authRouter);
    app.use("/chat", chatRouter);
    app.use("/history", historyRouter);
    app.use(notFoundMiddleware);
    app.use(errorMiddleware);
    await connectMongo();
    const port = Number(process.env.PORT || 8080);
    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`[ChatSF] Backend listening on :${port}`);
    });
}
bootstrap().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("[ChatSF] Fatal bootstrap error:", err);
    process.exit(1);
});
