import { createContext } from "react";
import { FeatureFlagContextValue } from "./types/context.type";

export const FeatureFlagContext = createContext<FeatureFlagContextValue>({
  flags: {},
  isLoading: true,
  error: null,
  isFeatureEnabled: () => false,
});
