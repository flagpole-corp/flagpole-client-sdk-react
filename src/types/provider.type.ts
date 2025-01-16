import { EnvironmentConfig } from "./environment.type";

export interface FeatureFlagProviderProps {
  apiKey: string;
  environments?: EnvironmentConfig;
  children: React.ReactNode;
}
