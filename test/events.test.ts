import { MetryticsClient } from "../src/metrytics-client";
import { Event } from "../src/events";
import { IEventExtras } from "../src/types/events";

// Mock fetch globally
global.fetch = jest.fn();

describe("Event", () => {
  const testConfig = {
    url: "http://test.com",
    apiKey: "test-key-123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: "POST request received" }),
    });
  });

  describe("Initialization", () => {
    it("should throw an error when not initialized", () => {
      expect(() => Event.getInstance()).toThrow(
        "Events client not initialized. Call MetryticsClient.initialize() first."
      );
    });

    it("should properly initialize with apiKey", () => {
      MetryticsClient.initialize(testConfig.url, testConfig.apiKey);
      const events = MetryticsClient.events;
      expect(events).toBeInstanceOf(Event);
    });
  });

  describe("Event Tracking", () => {
    const testData = {
      appName: "test-app",
      eventName: "button_click",
      eventData: {
        eventDescription: "submit-btn",
        ip: "127.0.0.1",
        timestamp: new Date("2024-01-01"),
        extraHeaders: { "Custom-Header": "test" },
      } as IEventExtras,
    };

    beforeEach(() => {
      MetryticsClient.initialize(testConfig.url, testConfig.apiKey);
    });

    it("should send event data with correct parameters and data", async () => {
      const events = MetryticsClient.events;
      await events.trackEvent(
        testData.appName,
        testData.eventName,
        testData.eventData
      );

      expect(fetch).toHaveBeenCalledWith(
        `${testConfig.url}/api/analytics/events`,
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
        eventName: testData.eventName,
        eventDescription: testData.eventData.eventDescription,
        ip: testData.eventData.ip,
        timestamp: testData.eventData.timestamp?.toISOString(),
      });
    });

    it("should send event data with default values when eventData is not provided", async () => {
      const events = MetryticsClient.events;
      await events.trackEvent(testData.appName, testData.eventName);

      const callBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(callBody).toEqual({
        appName: testData.appName,
        eventName: testData.eventName,
      });

      expect(fetch).toHaveBeenCalledWith(
        `${testConfig.url}/api/analytics/events`,
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

      const events = MetryticsClient.events;
      await expect(
        events.trackEvent(testData.appName, testData.eventName)
      ).rejects.toThrow(
        "Metrytics - makeRequest API call failed, status: 400, message: Bad Request"
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        "Metrytics - makeRequest API call failed:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("Singleton Behavior", () => {
    it("should maintain single instance of Events", () => {
      MetryticsClient.initialize(testConfig.url, testConfig.apiKey);
      const instance1 = MetryticsClient.events;
      const instance2 = MetryticsClient.events;
      expect(instance1).toBe(instance2);
    });

    it("should share configuration across instances", async () => {
      MetryticsClient.initialize(testConfig.url, testConfig.apiKey);
      const events1 = MetryticsClient.events;
      const events2 = MetryticsClient.events;

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await expect(
        events1.trackEvent("test-app", "button_click")
      ).resolves.not.toThrow();
      expect(consoleSpy).not.toHaveBeenCalled();

      await expect(
        events2.trackEvent("test-app", "button_click")
      ).resolves.not.toThrow();
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
