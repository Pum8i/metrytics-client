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
import analytics, { initialize } from "metrytics-client";
```

Then, initialize the analytics with your server URL and API key:

```typescript
initialize({
  serverUrl: "https://your-metrytics-server.com",
  apiKey: "YOUR_API_KEY",
});
```

Now you can track visitor data:

```typescript
analytics.trackVisitor(
  "your-app-name", // App Name
  "127.0.0.1", // IP Address
  navigator.userAgent, // User Agent
  document.referrer, // Referrer
  window.location.pathname // Current Page
);
```

## API Reference

### `initialize(config: { serverUrl: string; apiKey: string }): void`

Configures the analytics client with your server URL and API key. This must be called before tracking any data.

### `analytics.trackVisitor(ipAddress: string, userAgent: string, referrer: string, page: string): void`

Tracks a visitor with the specified information and sends the data over to the specified server url.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
