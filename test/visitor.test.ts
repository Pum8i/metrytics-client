import { MetryticsClient } from "../src/metrytics-client";
import { IVisitorExtras } from "../src/types/visitor";
import { Visitor } from "../src/visitor";

// Mock fetch globally
global.fetch = jest.fn();

describe("Visitor", () => {
  const testConfig = {
    url: "http://test.com",
    apiKey: "test-key-123",
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    // Mock implementations
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: "POST request received" }),
    });
  });

  describe("Initialization", () => {
    it("should throw an error when not initialized", () => {
      expect(() => Visitor.getInstance()).toThrow(
        "Visitors client not initialized. Call MetryticsClient.initialize() first."
      );
    });

    it("should properly initialize the analytics system", () => {
      MetryticsClient.initialize(testConfig.url, testConfig.apiKey);
      const visitors = MetryticsClient.visitors;
      expect(visitors).toBeInstanceOf(Visitor);
    });
  });

  describe("Visitor Tracking", () => {
    const testData = {
      appName: "test-app",
      page: "/test-page",
      extras: {
        ipAddress: "127.0.0.1",
        browser: "Chrome",
        os: "Windows",
        referrer: "http://referrer.com",
        timestamp: new Date("2024-01-01"),
        extraHeaders: { "Custom-Header": "test" },
        city: "London",
        country: "UK",
      } as IVisitorExtras,
    };

    beforeEach(() => {
      MetryticsClient.initialize(testConfig.url, testConfig.apiKey);
    });

    it("should send visitor data with correct parameters and extras", async () => {
      const visitors = MetryticsClient.visitors;
      await visitors.trackVisitor(
        testData.appName,
        testData.page,
        testData.extras
      );

      expect(fetch).toHaveBeenCalledWith(
        `${testConfig.url}/api/analytics/visitor`,
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": testConfig.apiKey,
            "Custom-Header": "test",
          },
          body: expect.any(String),
        })
      );

      const callBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(callBody).toEqual({
        appName: testData.appName,
        page: testData.page,
        ipAddress: testData.extras.ipAddress,
        browser: testData.extras.browser,
        os: testData.extras.os,
        referrer: testData.extras.referrer,
        timestamp: testData.extras.timestamp?.toISOString(),
        city: testData.extras.city,
        country: testData.extras.country,
      });
    });

    it("should send visitor data with default values when extras are not provided", async () => {
      const visitors = MetryticsClient.visitors;
      await visitors.trackVisitor(testData.appName, testData.page);

      const callBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(callBody).toEqual({
        appName: testData.appName,
        page: testData.page,
      });

      expect(fetch).toHaveBeenCalledWith(
        `${testConfig.url}/api/analytics/visitor`,
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
            "x-api-key": testConfig.apiKey,
          },
        })
      );
    });

    it("should handle non-ok responses", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        text: () => Promise.resolve("Bad Request"),
      });
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const visitors = MetryticsClient.visitors;
      await expect(
        visitors.trackVisitor(testData.appName, testData.page)
      ).rejects.toThrow("HTTP error! status: 400, message: Bad Request");

      expect(consoleSpy).toHaveBeenCalledWith(
        "API request failed:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it("should handle failed requests", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

      const visitors = MetryticsClient.visitors;
      await expect(
        visitors.trackVisitor(testData.appName, testData.page)
      ).rejects.toThrow("Network error");

      expect(consoleSpy).toHaveBeenCalledWith(
        "API request failed:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("Singleton Behavior", () => {
    it("should maintain single instance of Visitors", () => {
      MetryticsClient.initialize(testConfig.url, testConfig.apiKey);
      const instance1 = MetryticsClient.visitors;
      const instance2 = MetryticsClient.visitors;
      expect(instance1).toBe(instance2);
    });

    it("should share configuration across instances", async () => {
      MetryticsClient.initialize(testConfig.url, testConfig.apiKey);
      const visitors1 = MetryticsClient.visitors;
      const visitors2 = MetryticsClient.visitors;
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      // Both instances should be able to make requests without throwing
      await expect(
        visitors1.trackVisitor("test-app", "/test-page")
      ).resolves.not.toThrow();
      expect(consoleSpy).not.toHaveBeenCalled();

      await expect(
        visitors2.trackVisitor("test-app", "/test-page")
      ).resolves.not.toThrow();
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
