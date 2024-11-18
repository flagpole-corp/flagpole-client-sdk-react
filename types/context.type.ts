export interface FeatureFlagContextValue {
  flags: Record<string, boolean>;
  isLoading: boolean;
  error: Error | null;
  isFeatureEnabled: (flagName: string) => boolean;
}
