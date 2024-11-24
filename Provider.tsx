import React, { FC, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import FeatureFlagContext from "./Context";
import { FeatureFlag } from "./types";

const SERVER_URI = process.env.SERVER_URI;

export const FeatureFlagProvider: FC<FeatureFlagProviderProps> = ({
  authToken,
  environment = "development",
  children,
}): JSX.Element => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const socketInstance = io(SERVER_URI, {
      auth: authToken ? { token: authToken } : undefined,
      query: { environment },
    });

    socketInstance.on("connect", () => {
      console.debug("Connected to feature flag service");
      setError(null);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Failed to connect to feature flag service:", err);
      setError(err);
    });

    socketInstance.on("featureFlags", (receivedFlags: FeatureFlag[]) => {
      setFlags(
        receivedFlags.reduce((acc, flag) => {
          // Only include flags for the current environment
          if (!flag.environments || flag.environments.includes(environment)) {
            acc[flag.name] = flag.isEnabled;
          }
          return acc;
        }, {} as Record<string, boolean>)
      );
      setIsLoading(false);
    });

    socketInstance.on("featureFlagUpdate", (updatedFlag: FeatureFlag) => {
      // Only update if the flag applies to the current environment
      if (
        !updatedFlag.environments ||
        updatedFlag.environments.includes(environment)
      ) {
        setFlags((prevFlags) => ({
          ...prevFlags,
          [updatedFlag.name]: updatedFlag.isEnabled,
        }));
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [SERVER_URI, authToken, environment]);

  const isFeatureEnabled = (flagName: string): boolean => {
    return flags[flagName] ?? false;
  };

  return (
    <FeatureFlagContext.Provider
      value={{ flags, isLoading, error, isFeatureEnabled }}
    >
      {children}
    </FeatureFlagContext.Provider>
  );
};
