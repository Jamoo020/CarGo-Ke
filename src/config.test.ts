import {
  getRuntimeEnvironment,
  isValidProductionPaymentWebhookSecret,
  validateProductionEnvironment,
} from "./config";

describe("production payment webhook secret validation", () => {
  it("requires at least 32 non-whitespace characters", () => {
    expect(isValidProductionPaymentWebhookSecret("a".repeat(32))).toBe(true);
    expect(isValidProductionPaymentWebhookSecret("a".repeat(31))).toBe(false);
    expect(isValidProductionPaymentWebhookSecret(" ".repeat(32))).toBe(false);
  });
});

describe("explicit runtime environment", () => {
  it("accepts only explicitly named supported environments", () => {
    expect(getRuntimeEnvironment("development")).toBe("development");
    expect(getRuntimeEnvironment("test")).toBe("test");
    expect(getRuntimeEnvironment("production")).toBe("production");
    const currentNodeEnv = process.env.NODE_ENV;
    delete process.env.NODE_ENV;
    try {
      expect(() => getRuntimeEnvironment()).toThrow(
        "NODE_ENV must be explicitly set to development, test, or production",
      );
    } finally {
      if (currentNodeEnv === undefined) {
        delete process.env.NODE_ENV;
      } else {
        process.env.NODE_ENV = currentNodeEnv;
      }
    }
    expect(() => getRuntimeEnvironment("prod")).toThrow(
      "NODE_ENV must be explicitly set to development, test, or production",
    );
  });
});

describe("production configuration validation", () => {
  const validProductionEnvironment: NodeJS.ProcessEnv = {
    NODE_ENV: "production",
    JWT_SECRET: "j".repeat(32),
    PAYMENT_MODE: "live",
    PAYMENT_PROVIDER_CURRENCY: "KES",
    PAYMENT_WEBHOOK_SECRET: "w".repeat(32),
    SOCKET_ALLOWED_ORIGINS: "https://cargo.example",
  };

  it("requires a strong JWT secret and webhook secret", () => {
    expect(() =>
      validateProductionEnvironment("production", {
        ...validProductionEnvironment,
        JWT_SECRET: undefined,
      }),
    ).toThrow("JWT_SECRET must be configured");

    expect(() =>
      validateProductionEnvironment("production", {
        ...validProductionEnvironment,
        PAYMENT_WEBHOOK_SECRET: undefined,
      }),
    ).toThrow("PAYMENT_WEBHOOK_SECRET must be configured");
  });

  it("requires explicit live payment mode, currency, and HTTPS socket origins", () => {
    expect(() =>
      validateProductionEnvironment("production", {
        ...validProductionEnvironment,
        PAYMENT_MODE: undefined,
      }),
    ).toThrow("PAYMENT_MODE must be explicitly set to live");

    expect(() =>
      validateProductionEnvironment("production", {
        ...validProductionEnvironment,
        PAYMENT_MODE: "mock",
      }),
    ).toThrow("PAYMENT_MODE must be explicitly set to live");

    expect(() =>
      validateProductionEnvironment("production", {
        ...validProductionEnvironment,
        PAYMENT_PROVIDER_CURRENCY: undefined,
      }),
    ).toThrow("PAYMENT_PROVIDER_CURRENCY must be explicitly set");

    expect(() =>
      validateProductionEnvironment("production", {
        ...validProductionEnvironment,
        SOCKET_ALLOWED_ORIGINS: "http://cargo.example",
      }),
    ).toThrow("SOCKET_ALLOWED_ORIGINS must contain valid HTTPS origins");
  });

  it("does not apply production restrictions to explicit development and test environments", () => {
    expect(() => validateProductionEnvironment("development", {})).not.toThrow();
    expect(() => validateProductionEnvironment("test", {})).not.toThrow();
  });

  it("accepts a complete production security configuration", () => {
    expect(() =>
      validateProductionEnvironment("production", validProductionEnvironment),
    ).not.toThrow();
  });
});
