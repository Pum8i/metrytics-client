import { Analytics } from "./analytics";
import { VisitorData } from "./types";
import { getBrowserInfo, getOSInfo } from "./utils/browser";

export class Visitors extends Analytics {
  private static _instance: Visitors;

  private constructor() {
    super();
  }

  public static getInstance(): Visitors {
    if (!Visitors._instance) {
      Visitors._instance = new Visitors();
    }
    return Visitors._instance;
  }

  public trackVisitor(
    appName: string,
    ipAddress: string,
    userAgent: string,
    referrer: string,
    page: string,
    timestamp = new Date()
  ): void {
    const analyticsData: VisitorData = {
      appName,
      browser: getBrowserInfo(userAgent),
      os: getOSInfo(userAgent),
      referrer: referrer,
      ipAddress: ipAddress,
      timestamp,
      page,
    };
    this.sendVisitorData(analyticsData);
  }

  private sendVisitorData(data: VisitorData): void {
    if (!this.serverUrl || !this.apiKey) {
      return console.error(
        "Metrytics hasn't been initialized yet. Make sure to call initialize() before using."
      );
    }

    fetch(`${this.serverUrl}/analytics`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-api-key": this.apiKey ?? "",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `status: ${response.status} - statusText: ${response.statusText}`
          );
        }
      })
      .catch((error) => {
        console.error(
          "Metrytics - There was a problem with the fetch operation:",
          error
        );
      });
  }
}
export default Visitors.getInstance();
