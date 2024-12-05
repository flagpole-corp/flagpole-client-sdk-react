import { FeatureFlag } from "./featureFlag.type";

export interface FeatureFlagContextValue {
  flags: Record<string, FeatureFlag>;
  isLoading: boolean;
  error: Error | null;
  isFeatureEnabled: (flagName: string) => boolean;
}
