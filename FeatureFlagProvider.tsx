import React, { FC, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import FeatureFlagContext from "./Context";
import { FeatureFlag, FeatureFlagProviderProps } from "./types";

const api = axios.create({
  baseURL: process.env.API_URL || "http://localhost:5000",
});

export const FeatureFlagProvider: FC<FeatureFlagProviderProps> = ({
  projectId,
  authToken,
  environment = "development",
  children,
}): JSX.Element => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [flags, setFlags] = useState<Record<string, FeatureFlag>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initial flags fetch
  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const { data } = await api.get<FeatureFlag[]>("/api/feature-flags", {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "x-project-id": projectId,
          },
        });

        setFlags(
          data.reduce((acc, flag) => {
            if (!flag.environments || flag.environments.includes(environment)) {
              acc[flag.name] = flag;
            }
            return acc;
          }, {} as Record<string, FeatureFlag>)
        );
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch flags")
        );
        setIsLoading(false);
      }
    };

    fetchFlags();
  }, [projectId, authToken, environment]);

  // WebSocket connection handlers
  useEffect(() => {
    const socketInstance = io(
      process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000",
      {
        auth: { token: authToken },
        query: {
          environment,
          projectId,
        },
      }
    );

    socketInstance.on("connect", () => {
      console.debug("Connected to feature flag service");
      setError(null);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Failed to connect to feature flag service:", err);
      setError(
        err instanceof Error ? err : new Error("WebSocket connection failed")
      );
    });

    socketInstance.on("featureFlagUpdate", (updatedFlag: FeatureFlag) => {
      if (
        updatedFlag.project === projectId &&
        (!updatedFlag.environments ||
          updatedFlag.environments.includes(environment))
      ) {
        setFlags((prevFlags) => ({
          ...prevFlags,
          [updatedFlag.name]: updatedFlag,
        }));
      }
    });

    socketInstance.on("featureFlagDelete", (flagId: string) => {
      setFlags((prevFlags) => {
        const newFlags = { ...prevFlags };
        const flagName = Object.keys(newFlags).find(
          (name) => newFlags[name]._id === flagId
        );
        if (flagName) {
          delete newFlags[flagName];
        }
        return newFlags;
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [projectId, authToken, environment]);

  const isFeatureEnabled = (flagName: string): boolean => {
    return flags[flagName]?.isEnabled ?? false;
  };

  return (
    <FeatureFlagContext.Provider
      value={{ flags, isLoading, error, isFeatureEnabled }}
    >
      {children}
    </FeatureFlagContext.Provider>
  );
};
