interface FeatureFlagProviderProps {
  serverUrl: string;
  authToken?: string;
  environment?: string;
  children: React.ReactNode;
}
