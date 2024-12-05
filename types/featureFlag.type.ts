export interface FeatureFlag {
  _id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  project: string;
  organization: string;
  conditions: Record<string, any>;
  environments: string[];
  createdAt: string;
  updatedAt: string;
}
