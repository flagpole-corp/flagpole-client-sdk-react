export const ENVIRONMENTS = ["development", "staging", "production"] as const;
export type Environment = (typeof ENVIRONMENTS)[number];

export type EnvironmentConfig = Environment[] | undefined;
