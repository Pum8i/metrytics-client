import { Visitor } from "./visitors";
import { Event } from "./events";

export class MetryticsClient {
  private static instance: MetryticsClient | null = null;
  private baseUrl: string;
  private apiKey: string;

  // Static references to child clients
  private static visitorsClient: Visitor | null = null;
  private static eventsClient: Event | null = null;

  private constructor(url: string, apiKey: string) {
    this.baseUrl = url;
    this.apiKey = apiKey;
  }

  public static initialize(url: string, apiKey: string): MetryticsClient {
    if (!url || typeof url !== "string") {
      throw new Error(
        "A valid server URL is required to initialize MetryticsClient"
      );
    }

    if (!apiKey || typeof apiKey !== "string") {
      throw new Error(
        "A valid API key is required to initialize MetryticsClient"
      );
    }

    if (!this.instance) {
      this.instance = new MetryticsClient(url, apiKey);

      // Initialize child clients
      this.visitorsClient = Visitor.initialize(url, apiKey);
      this.eventsClient = Event.initialize(url, apiKey);
    }
    return this.instance;
  }

  public static getInstance(): MetryticsClient {
    if (!this.instance) {
      throw new Error("MetryticsClient must be initialized first");
    }
    return this.instance;
  }

  // Getter methods for child clients
  public static get visitors(): Visitor {
    if (!this.visitorsClient) {
      throw new Error(
        "Visitors client not initialized. Call MetryticsClient.initialize() first."
      );
    }
    return this.visitorsClient;
  }

  public static get events(): Event {
    if (!this.eventsClient) {
      throw new Error('Events client not initialized. Call MetryticsClient.initialize() first.');
    }
    return this.eventsClient;
  }
}
