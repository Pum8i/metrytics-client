export interface IVisitor {
  appName: string;
  page: string;
}
export interface IVisitorExtras {
  ipAddress?: string;
  browser?: string;
  city?: string;
  country?: string;
  extraHeaders?: object;
  os?: string;
  referrer?: string;
  timestamp?: Date;
}
