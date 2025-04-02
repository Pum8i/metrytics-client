export interface IEvent {
  appName: string;
  eventName: string;
}
export interface IEventExtras {
  eventDescription?: string;
  ip?: string;
  timestamp?: Date;
  extraHeaders?: object;
}
