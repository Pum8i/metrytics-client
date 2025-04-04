import { Analytics } from "./analytics";
import { IEventExtras } from "./types/events";

export class Event extends Analytics {
  private static instance: Event | null = null;

  private constructor(url: string, apiKey: string) {
    super(url, apiKey);
  }

  public static initialize(url: string, apiKey: string): Event {
    if (!this.instance) {
      this.instance = new Event(url, apiKey);
    }
    return this.instance;
  }

  public static getInstance(): Event {
    if (!this.instance) {
      throw new Error(
        "Events client not initialized. Call MetryticsClient.initialize() first."
      );
    }
    return this.instance;
  }

  public async trackEvent(
    appName: string,
    eventName: string,
    extras?: IEventExtras
  ): Promise<Response> {
    const { extraHeaders } = extras || {};
    delete extras?.extraHeaders;
    const eventData = {
      appName,
      eventName,
      ...extras,
    };
    return await this.makeRequest("/events", eventData, extraHeaders);
  }
}
