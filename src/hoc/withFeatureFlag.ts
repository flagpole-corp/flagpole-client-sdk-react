import { useFeatureFlag } from "../hooks/useFeatureFlag";
import React from "react";

/**
 * Higher-order component that conditionally renders a component based on a feature flag status.
 *
 * @template P - The props type of the wrapped component (must be an object)
 * @param {React.ComponentType<P>} WrappedComponent - The component to be conditionally rendered
 * @param {string} flagName - The name of the feature flag to check
 * @param {React.ComponentType<P>} [FallbackComponent] - Optional component to render when the feature flag is disabled
 * @returns {React.FC<P>} A new component that wraps the original component with feature flag logic
 *
 * @example
 * // Basic usage
 * const MyFeature = withFeatureFlag(MyComponent, 'my-feature');
 *
 * @example
 * // With fallback component
 * const MyFeature = withFeatureFlag(MyComponent, 'my-feature', FallbackComponent);
 *
 * @example
 * // With TypeScript props
 * interface MyProps {
 *   title: string;
 *   count: number;
 * }
 *
 * const MyComponent: React.FC<MyProps> = ({ title, count }) => (
 *   <div>{title}: {count}</div>
 * );
 *
 * const FeatureFlagged = withFeatureFlag(MyComponent, 'my-feature');
 *
 * // Usage
 * <FeatureFlagged title="Hello" count={42} />
 */

export function withFeatureFlag<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  flagName: string,
  FallbackComponent?: React.ComponentType<P>
): React.FC<P> {
  return function FeatureFlaggedComponent(props: P) {
    const isEnabled = useFeatureFlag(flagName);

    if (!isEnabled) {
      return FallbackComponent
        ? React.createElement(FallbackComponent, props)
        : null;
    }

    return React.createElement(WrappedComponent, props);
  };
}
