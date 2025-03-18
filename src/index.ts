import { Analytics } from "./analytics";
import type { AnalyticsConfig } from "./types";
import { Visitors } from "./visitors";

// Create instances
const visitors = Visitors.getInstance();

// Initialize function that configures all analytics classes
const initialize = (config: AnalyticsConfig) => {
  Analytics.initialize(config);
};

export { initialize, visitors };
