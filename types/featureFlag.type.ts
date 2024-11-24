export interface FeatureFlag {
  name: string;
  isEnabled: boolean;
  conditions?: Record<string, any>;
  environments?: string[];
}
