import { createContext } from "react";
import { FeatureFlagContextValue } from "./types/context.type";

const FeatureFlagContext = createContext<FeatureFlagContextValue>({
  flags: {},
  isLoading: true,
  error: null,
  isFeatureEnabled: () => false,
});

export default FeatureFlagContext;
