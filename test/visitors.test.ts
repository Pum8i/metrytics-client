import { initialize } from "../src/index";
import { getBrowserInfo, getOSInfo } from "../src/utils/browser";
import { Visitors } from "../src/visitors";

// Mock the browser utils
jest.mock("../src/utils/browser", () => ({
  getBrowserInfo: jest.fn(),
  getOSInfo: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn();

describe("Visitors", () => {
  const testConfig = {
    serverUrl: "http://test.com",
    apiKey: "test-key-123",
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    // Mock implementations
    (getBrowserInfo as jest.Mock).mockReturnValue("Chrome");
    (getOSInfo as jest.Mock).mockReturnValue("Windows");
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
  });

  describe("Initialization", () => {
    it("should console.error when not initialized", () => {
      const visitors = Visitors.getInstance();
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      //Reset configuration to ensure it throws an error
      initialize({
        serverUrl: "",
        apiKey: "",
      });

      visitors.trackVisitor(
        "test-app",
        "127.0.0.1",
        "test-agent",
        "http://referrer.com",
        "/test-page"
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        "Metrytics hasn't been initialized yet. Make sure to call initialize() before using."
      );

      consoleSpy.mockRestore();
    });

    it("should properly initialize the analytics system", () => {
      initialize(testConfig);
      const visitors = Visitors.getInstance();
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      expect(() =>
        visitors.trackVisitor(
          "test-app",
          "127.0.0.1",
          "test-agent",
          "http://referrer.com",
          "/test-page"
        )
      ).not.toThrow();
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("Visitors Tracking", () => {
    const testData = {
      appName: "test-app",
      ipAddress: "127.0.0.1",
      userAgent: "test-agent",
      referrer: "http://referrer.com",
      page: "/test-page",
    };

    beforeEach(() => {
      initialize(testConfig);
    });

    it("should send visitor data with correct parameters", () => {
      const visitors = Visitors.getInstance();
      visitors.trackVisitor(
        testData.appName,
        testData.ipAddress,
        testData.userAgent,
        testData.referrer,
        testData.page
      );

      expect(getBrowserInfo).toHaveBeenCalledWith(testData.userAgent);
      expect(getOSInfo).toHaveBeenCalledWith(testData.userAgent);
      expect(fetch).toHaveBeenCalledWith(
        `${testConfig.serverUrl}/analytics`,
        expect.objectContaining({
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-api-key": testConfig.apiKey,
          },
          body: expect.any(String),
        })
      );

      const callBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(callBody).toEqual({
        appName: testData.appName,
        browser: "Chrome",
        os: "Windows",
        referrer: testData.referrer,
        ipAddress: testData.ipAddress,
        page: testData.page,
        timestamp: expect.any(String),
      });
    });

    it("should handle non-ok responses", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
      });
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const visitors = Visitors.getInstance();
      // try {
      visitors.trackVisitor(
        testData.appName,
        testData.ipAddress,
        testData.userAgent,
        testData.referrer,
        testData.page
      );
      // } catch (error) {
      // Wait for the promise to resolve
      await new Promise(process.nextTick);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Metrytics - There was a problem with the fetch operation:",
        new Error("status: 400 - statusText: Bad Request")
      );
      // }

      consoleSpy.mockRestore();
    });

    it("should handle failed requests", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

      const visitors = Visitors.getInstance();
      visitors.trackVisitor(
        testData.appName,
        testData.ipAddress,
        testData.userAgent,
        testData.referrer,
        testData.page
      );

      // Wait for the promise to resolve
      await new Promise(process.nextTick);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Metrytics - There was a problem with the fetch operation:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("Singleton Behavior", () => {
    it("should maintain single instance of Visitors", () => {
      const instance1 = Visitors.getInstance();
      const instance2 = Visitors.getInstance();
      expect(instance1).toBe(instance2);
    });

    it("should share configuration across instances", () => {
      initialize(testConfig);
      const visitors1 = Visitors.getInstance();
      const visitors2 = Visitors.getInstance();
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      // Both instances should be able to make requests without throwing
      expect(() =>
        visitors1.trackVisitor(
          "test-app",
          "127.0.0.1",
          "test-agent",
          "http://referrer.com",
          "/test-page"
        )
      ).not.toThrow();
      expect(consoleSpy).not.toHaveBeenCalled();

      expect(() =>
        visitors2.trackVisitor(
          "test-app",
          "127.0.0.1",
          "test-agent",
          "http://referrer.com",
          "/test-page"
        )
      ).not.toThrow();
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
