export abstract class Analytics {
  protected baseUrl: string;
  protected apiKey: string;

  protected constructor(url: string, apiKey: string) {
    this.baseUrl = url;
    this.apiKey = apiKey;
  }

  protected async makeRequest(
    endpoint: string,
    body: object = {},
    extraHeaders = {}
  ) {
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": this.apiKey,
      ...extraHeaders,
    };

    const config: RequestInit = {
      method: "POST",
      headers,
      ...(body && { body: JSON.stringify(body) }),
    };

    try {
      const response = await fetch(
        `${this.baseUrl}/api/analytics${endpoint}`,
        config
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorBody}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }
}
