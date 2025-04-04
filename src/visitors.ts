import { Analytics } from "./analytics";
import { IVisitor, IVisitorExtras } from "./types/visitors";

export class Visitor extends Analytics {
  private static instance: Visitor | null = null;

  private constructor(url: string, apiKey: string) {
    super(url, apiKey);
  }

  public static initialize(url: string, apiKey: string): Visitor {
    if (!this.instance) {
      this.instance = new Visitor(url, apiKey);
    }
    return this.instance;
  }

  public static getInstance(): Visitor {
    if (!this.instance) {
      throw new Error(
        "Visitors client not initialized. Call MetryticsClient.initialize() first."
      );
    }
    return this.instance;
  }

  public async trackVisitor(
    appName: string,
    page: string,
    extras?: IVisitorExtras
  ): Promise<Response> {
    const { extraHeaders } = extras || {};
    delete extras?.extraHeaders;
    const visitorData: IVisitor = {
      appName,
      page,
      ...extras,
    };
    return await this.makeRequest("/visitors", visitorData, extraHeaders);
  }
}
