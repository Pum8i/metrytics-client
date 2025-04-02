# Metrytics Web Client

The Metrytics Web Client is a lightweight npm package that collects and sends website analytics data to a Metrytics server. It tracks visitor information, including IP address, operating system, browser, referring URL, and page views. This client is designed to work seamlessly with the [Metrytics Dashboard](https://github.com/Pum8i/metrytics-dashboard), which provides a server and dashboard for managing and visualizing the collected data.

## Installation

To install the package, run:

```bash
pnpm install metrytics-client
```

## Usage

First, import the analytics instance and the `initialize` function:

```typescript
import { MetryticsClient } from "metrytics-client";
```

Then, initialize the analytics with your server URL and API key:

```typescript
MetryticsClient.initialize({
  serverUrl: "https://your-metrytics-server.com",
  apiKey: "YOUR_API_KEY",
});
```

### Visitor Tracking

To track visitors to your application, use the `trackVisitor` method:

```typescript
MetryticsClient.visitors.trackVisitor(
  "MyApp", // application name
  "/home", // current page
  {
    // optional extras
    ip: "123.456.1.1",
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
  - `ip` (optional: string): Visitor's IP address
  - `browser` (optional: string): Visitor's browser information
  - `city` (optional: string): Visitor's city location
  - `country` (optional: string): Visitor's country location
  - `extraHeaders` (optional: object): Custom headers to include in the request
  - `os` (optional: string): Visitor's operating system
  - `referrer` (optional: string): The referring URL
  - `timestamp` (optional: Date): Time of the visit

### Event Tracking

To track custom events in your application, use the `trackEvent` method:

```typescript
MetryticsClient.events.trackEvent(
  "MyApp", // application name
  "button_click", // event name
  {
    // optional event data
    eventDescription: "Clicking on submit",
    ip: "123.456.1.1",
    timestamp: "2025-03-29 21:31:39.35",
    extraHeaders: {
      "Custom-Header": "value",
    },
  }
);
```

#### Parameters

- `appName` (string): The name of your application
- `eventName` (string): Name of the event being tracked
- `eventData` (optional: IEventData): Additional event data and configuration
  - `eventDescription` (optional: string): Custom headers to include in the request
  - `ip` (optional: string): Visitor's IP address
  - `timestamp` (optional: Date): Time of the event
  - `extraHeaders` (optional: object): Custom headers to include in the request

## API Reference

### `MetryticsClient.initialize(config: { serverUrl: string; apiKey: string }): void`

Configures the analytics client with your server URL and API key. This must be called before tracking any data.

#### `MetryticsClient.visitors.trackVisitor(appName: string, page: string, extras?: IVisitorExtras): Promise<void>`

Tracks a visitor with the specified information and sends the data over to the specified server url.

#### `MetryticsClient.events.trackEvent(appName: string, eventName: string, eventData?: IEventData): Promise<void>`

Tracks a custom event with the specified information and sends the event data over to the specified server url.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
