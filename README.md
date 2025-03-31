# Metrytics Web Client

This project is a simple pnpm package used for sending analytics data such as IP address, operating system, browser, and referrer information to a server. It is designed to work with the [Metrytics Dashboard](https://github.com/Pum8i/metrytics-dashboard) - which includes a dedicated server for collecting and processing the analytics data.

## Installation

To install the package, run:

```bash
pnpm install metrytics-client
```

## Usage

First, import the analytics instance and the `initialize` function:

```typescript
import analytics, { initialize } from "metrytics-client";
```

Then, initialize the analytics with your server URL and API key:

```typescript
initialize({
  serverUrl: "https://your-metrytics-server.com",
  apiKey: "YOUR_API_KEY",
});
```

To track visitors to your application, use the `trackVisitor` method:

```typescript
MetryticsClient.visitors.trackVisitor.trackVisitor(
  "MyApp", // application name
  "/home", // current page
  {
    // optional extras
    ipAddress: "123.456.1.1",
    browser: "Chrome",
    city: "New York",
    country: "United States",
    os: "Windows 11",
    referrer: "https://google.com",
    timestamp: "2025-03-29 21:31:39.35",
    extraHeaders: {
      // optional additional headers
      "Custom-Header": "value",
    },
  }
);
```

### Parameters

- `appName` (string): The name of your application
- `page` (string): The current page path or identifier
- `extras` (optional: IVisitorExtras): Additional data and configuration
  - `ipAddress` (optional: string): Visitor's IP address
  - `browser` (optional: string): Visitor's browser information
  - `city` (optional: string): Visitor's city location
  - `country` (optional: string): Visitor's country location
  - `extraHeaders` (optional: object): Custom headers to include in the request
  - `os` (optional: string): Visitor's operating system
  - `referrer` (optional: string): The referring URL
  - `timestamp` (optional: Date): Time of the visit

## API Reference

### `initialize(config: { serverUrl: string; apiKey: string }): void`

Configures the analytics client with your server URL and API key. This must be called before tracking any data.

### `analytics.trackVisitor(ipAddress: string, userAgent: string, referrer: string, page: string): void`

Tracks a visitor with the specified information and sends the data over to the specified server url.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
