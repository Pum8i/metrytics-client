export interface AnalyticsConfig {
  serverUrl: string;
  apiKey: string;
}
export interface VisitorData {
  appName: string;
  ipAddress: string;
  os: string;
  browser: string;
  referrer: string;
  timestamp: Date;
  page: string;
}
export interface IExtras {
  timestamp?: Date;
  extraHeaders?: {};
}
