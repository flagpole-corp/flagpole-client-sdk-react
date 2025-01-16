import { Environment } from "./environment.type";

export interface FeatureFlag {
  _id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  project: string;
  organization: string;
  conditions: Record<string, any>;
  environments: Environment[];
  createdAt: string;
  updatedAt: string;
}
