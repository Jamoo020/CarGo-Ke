import "dotenv/config";

export type RuntimeEnvironment = "development" | "test" | "production";
export type PaymentMode = "live" | "mock";

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getOptionalEnvVar(name: string, defaultValue: string): string {
  const value = process.env[name];
  return value ? value : defaultValue;
}

export function getRuntimeEnvironment(value = process.env.NODE_ENV): RuntimeEnvironment {
  if (value === "development" || value === "test" || value === "production") {
    return value;
  }
  throw new Error("NODE_ENV must be explicitly set to development, test, or production");
}

const DEFAULT_SOCKET_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
];

function getSocketAllowedOrigins(
  environment: RuntimeEnvironment,
  env: NodeJS.ProcessEnv = process.env,
): string[] {
  const configuredOrigins = env.SOCKET_ALLOWED_ORIGINS;
  if (configuredOrigins) {
    const origins = configuredOrigins.split(",").map((origin) => origin.trim()).filter(Boolean);
    if (origins.length > 0) {
      return origins;
    }
  }

  if (environment === "production") {
    throw new Error("Missing required environment variable: SOCKET_ALLOWED_ORIGINS");
  }

  return DEFAULT_SOCKET_ALLOWED_ORIGINS;
}

function getPaymentMode(environment: RuntimeEnvironment, env: NodeJS.ProcessEnv): PaymentMode {
  const configuredMode = env.PAYMENT_MODE;
  if (!configuredMode && environment === "production") {
    throw new Error("PAYMENT_MODE must be explicitly set to live in production");
  }

  const paymentMode = configuredMode ?? "live";
  if (paymentMode !== "live" && paymentMode !== "mock") {
    throw new Error("PAYMENT_MODE must be either live or mock");
  }
  if (environment === "production" && paymentMode !== "live") {
    throw new Error("Mock payment mode is not allowed in production");
  }

  return paymentMode;
}

export interface AppConfig {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  environment: RuntimeEnvironment;
  socketAllowedOrigins: string[];
  paymentMode: PaymentMode;
  paymentProviderCurrency: string;
  googleMapsApiKey?: string;
}

export function isValidProductionPaymentWebhookSecret(secret: string): boolean {
  return secret.length >= 32 && secret.trim().length >= 32;
}

export function validateProductionEnvironment(
  environment: RuntimeEnvironment,
  env: NodeJS.ProcessEnv,
): void {
  if (environment !== "production") {
    return;
  }

  const jwtSecret = env.JWT_SECRET ?? "";
  if (jwtSecret.length < 32 || jwtSecret.trim().length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters in production");
  }

  if (env.PAYMENT_MODE !== "live") {
    throw new Error("PAYMENT_MODE must be explicitly set to live in production");
  }

  const currency = env.PAYMENT_PROVIDER_CURRENCY;
  if (!currency || !/^[A-Za-z]{3}$/.test(currency.trim())) {
    throw new Error("PAYMENT_PROVIDER_CURRENCY must be explicitly set to a 3-letter currency code in production");
  }

  const origins = getSocketAllowedOrigins(environment, env);
  for (const origin of origins) {
    let parsedOrigin: URL;
    try {
      parsedOrigin = new URL(origin);
    } catch {
      throw new Error("SOCKET_ALLOWED_ORIGINS must contain valid HTTPS origins in production");
    }

    if (
      parsedOrigin.protocol !== "https:" ||
      parsedOrigin.origin !== origin ||
      origin === "*"
    ) {
      throw new Error("SOCKET_ALLOWED_ORIGINS must contain valid HTTPS origins in production");
    }
  }

  if (!isValidProductionPaymentWebhookSecret(env.PAYMENT_WEBHOOK_SECRET ?? "")) {
    throw new Error("PAYMENT_WEBHOOK_SECRET must be configured with at least 32 characters in production");
  }
}

const environment = getRuntimeEnvironment();

export const config: AppConfig = {
  port: Number(getOptionalEnvVar("PORT", "4000")),
  databaseUrl: getEnvVar("DATABASE_URL"),
  jwtSecret: getEnvVar("JWT_SECRET"),
  environment,
  socketAllowedOrigins: getSocketAllowedOrigins(environment),
  paymentMode: getPaymentMode(environment, process.env),
  paymentProviderCurrency: getOptionalEnvVar("PAYMENT_PROVIDER_CURRENCY", "KES").trim().toUpperCase(),
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
};

validateProductionEnvironment(environment, process.env);

export function getPaymentWebhookSecret(): string {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET ?? "";
  if (config.environment === "production" && !isValidProductionPaymentWebhookSecret(secret)) {
    throw new Error("PAYMENT_WEBHOOK_SECRET must be configured with at least 32 characters in production");
  }
  return secret;
}

if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535) {
  throw new Error("PORT must be a valid number");
}
