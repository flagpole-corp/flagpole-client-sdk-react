import { useContext } from "react";
import FeatureFlagContext from "./Context";

/**
 * Hook to access all feature flags and related data from the FeatureFlagContext.
 *
 * @returns {object} An object containing:
 *   - flags: Record<string, boolean> - Object mapping flag names to their enabled status
 *   - isLoading: boolean - Loading state of the feature flags
 *   - error: Error | null - Any error that occurred while fetching flags
 *   - isFeatureEnabled: (flagName: string) => boolean - Function to check if a specific flag is enabled
 *
 * @throws {Error} If used outside of FeatureFlagProvider
 *
 * @example
 * // Basic usage
 * function MyComponent() {
 *   const { flags, isLoading, error } = useFeatureFlags();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       {Object.entries(flags).map(([name, enabled]) => (
 *         <div key={name}>{name}: {enabled ? 'On' : 'Off'}</div>
 *       ))}
 *     </div>
 *   );
 * }
 *
 * @example
 * // Using the isFeatureEnabled function
 * function MyComponent() {
 *   const { isFeatureEnabled } = useFeatureFlags();
 *
 *   return (
 *     <div>
 *       {isFeatureEnabled('my-feature') && <NewFeature />}
 *     </div>
 *   );
 * }
 */

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error(
      "useFeatureFlags must be used within a FeatureFlagProvider"
    );
  }
  return context;
};
