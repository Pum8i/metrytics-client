// src/utils/browser.ts

export function getBrowserInfo(userAgent: string): string {
  // const userAgent = navigator.userAgent;
  let browserName = "Unknown";

  if (userAgent.indexOf("Chrome") > -1) {
    browserName = "Chrome";
  } else if (userAgent.indexOf("Firefox") > -1) {
    browserName = "Firefox";
  } else if (userAgent.indexOf("Safari") > -1) {
    browserName = "Safari";
  } else if (
    userAgent.indexOf("MSIE") > -1 ||
    userAgent.indexOf("Trident") > -1
  ) {
    browserName = "Internet Explorer";
  }

  return browserName;
}

export function getOSInfo(userAgent: string): string {
  // const userAgent = navigator.userAgent;
  let osName = "Unknown OS";

  if (userAgent.indexOf("Win") > -1) {
    osName = "Windows";
  } else if (userAgent.indexOf("Mac") > -1) {
    osName = "MacOS";
  } else if (userAgent.indexOf("X11") > -1 || userAgent.indexOf("Linux") > -1) {
    osName = "Linux";
  }

  return osName;
}
