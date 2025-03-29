import { Visitor } from "./visitor";
// import { Events } from './events';

export class MetryticsClient {
  private static instance: MetryticsClient | null = null;
  private baseUrl: string;
  private apiKey: string;

  // Static references to child clients
  private static visitorsClient: Visitor | null = null;
  // private static eventsClient: Events | null = null;

  private constructor(url: string, apiKey: string) {
    this.baseUrl = url;
    this.apiKey = apiKey;
  }

  public static initialize(url: string, apiKey: string): MetryticsClient {
    if (!this.instance) {
      this.instance = new MetryticsClient(url, apiKey);

      // Initialize child clients
      this.visitorsClient = Visitor.initialize(url, apiKey);
      // this.eventsClient = Events.initialize(url, apiKey);
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

  // public static get events(): Events {
  //   if (!this.eventsClient) {
  //     throw new Error('Events client not initialized. Call MetryticsClient.initialize() first.');
  //   }
  //   return this.eventsClient;
  // }
}
