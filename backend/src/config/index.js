import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(5000),
    MONGODB_CONNECT_URI: z.string().min(1, "MongoDB URI is required"),
    API_PREFIX: z.string().default("/api"),
    API_VERSION: z.string().default("v1"),
    CORS_ORIGIN: z.string().default("http://localhost:3000"),
    CORS_CREDENTIALS: z.enum(["true", "false"]).default("false").transform(value => value === "true")
    .superRefine((env, context) => {
        if (env.CORS_ORIGIN === "*" && env.CORS_CREDENTIALS) {
            context.addIssue({
                code: "custom",
                path: ["CORS_ORIGIN"],
                message: "Wildcard CORS origin cannot be  used with credentials"
            });
        }
    }),
});

const result = envSchema.safeParse(process.env);
if (!result.success) {
    console.error("Invalid enviorment configuration:");

    for (const issue of result.error.issues) {
        console.error(`-${issue.path.join(".")}:${issue.message}`);
    }

    process.exit(1);
}

const env = result.data;

const config = Object.freeze ({
    env: env.NODE_ENV,
    port : env.PORT,
    mongodb: {
        uri: env.MONGODB_CONNECT_URI
    },
    api: {
        prefix: env.API_PREFIX,
        version: env.API_VERSION
    },
    cors: {
        origin: env.CORS_ORIGIN,
        credentials: env.CORS_CREDENTIALS,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
    },
});

export default config;