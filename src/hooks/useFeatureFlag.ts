import { useContext } from "react";
import { FeatureFlagContext } from "../Context";

/**
 * Hook to check if a specific feature flag is enabled.
 *
 * @param {string} flagName - The name of the feature flag to check
 * @returns {boolean} True if the feature flag is enabled, false otherwise.
 * Returns false if the flag doesn't exist.
 *
 * @throws {Error} If used outside of FeatureFlagProvider
 *
 * @example
 * // Basic usage
 * function MyComponent() {
 *   const isNewFeatureEnabled = useFeatureFlag('new-feature');
 *
 *   return (
 *     <div>
 *       {isNewFeatureEnabled && <NewFeature />}
 *     </div>
 *   );
 * }
 *
 * @example
 * // With conditional rendering and TypeScript
 * interface Props {
 *   title: string;
 * }
 *
 * function MyComponent({ title }: Props) {
 *   const isEnabled = useFeatureFlag('my-feature');
 *
 *   if (!isEnabled) {
 *     return null;
 *   }
 *
 *   return <div>{title}</div>;
 * }
 */

export const useFeatureFlag = (flagName: string): boolean => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error("useFeatureFlag must be used within a FeatureFlagProvider");
  }
  return context.isFeatureEnabled(flagName);
};
