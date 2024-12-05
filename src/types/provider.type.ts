export interface FeatureFlagProviderProps {
  projectId: string;
  authToken: string;
  environment?: string;
  children: React.ReactNode;
  organizationId: string;
}
