import "dotenv/config";

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getOptionalEnvVar(name: string, defaultValue: string): string {
  const value = process.env[name];
  return value ? value : defaultValue;
}

export interface AppConfig {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  environment: string;
  paymentProviderCurrency: string;
}

export const config: AppConfig = {
  port: Number(getOptionalEnvVar("PORT", "4000")),
  databaseUrl: getEnvVar("DATABASE_URL"),
  jwtSecret: getEnvVar("JWT_SECRET"),
  environment: getOptionalEnvVar("NODE_ENV", "development"),
  paymentProviderCurrency: getOptionalEnvVar("PAYMENT_PROVIDER_CURRENCY", "KES"),
};

export function getPaymentWebhookSecret(): string {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET ?? "";
  if (config.environment === "production" && !secret) {
    throw new Error("Missing required environment variable: PAYMENT_WEBHOOK_SECRET");
  }
  return secret;
}

if (!config.port || Number.isNaN(config.port)) {
  throw new Error("PORT must be a valid number");
}
