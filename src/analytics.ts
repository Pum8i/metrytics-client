import { AnalyticsConfig } from "./types";

export class Analytics {
  private static config: AnalyticsConfig;

  protected constructor() {}

  protected static getConfig(): AnalyticsConfig {
    if (!Analytics.config) {
      console.error("Analytics not initialized. Call initialize() first");
    }
    return Analytics.config;
  }

  public static initialize(config: AnalyticsConfig): void {
    Analytics.config = config;
  }

  protected get serverUrl(): string {
    return Analytics.getConfig()?.serverUrl;
  }

  protected get apiKey(): string {
    return Analytics.getConfig()?.apiKey;
  }
}
