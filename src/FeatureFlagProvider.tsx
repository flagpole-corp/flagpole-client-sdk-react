import React, { FC, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { FeatureFlagContext } from "./Context";
import { FeatureFlag, FeatureFlagProviderProps } from "./types";
import { DEFAULT_CONFIG } from "./config";

export const FeatureFlagProvider: FC<FeatureFlagProviderProps> = ({
  apiKey,
  environment = "development",
  children,
}): JSX.Element => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [flags, setFlags] = useState<Record<string, FeatureFlag>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const api = axios.create({
    baseURL: DEFAULT_CONFIG.API_URL,
    headers: {
      "x-api-key": apiKey,
    },
  });

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const { data } = await api.get<FeatureFlag[]>("/api/feature-flags/sdk");

        setFlags(
          data.reduce((acc, flag) => {
            if (
              !flag.environments?.length ||
              flag.environments.includes(environment)
            ) {
              acc[flag.name] = flag;
            }
            return acc;
          }, {} as Record<string, FeatureFlag>)
        );
        setError(null);
      } catch (err) {
        console.error("[FlagPole SDK] Error fetching flags:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch flags")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlags();
  }, [environment]);

  // WebSocket connection
  useEffect(() => {
    const wsUrl = DEFAULT_CONFIG.WS_URL;
    console.log("[FlagPole SDK] WS URL before initialization:", wsUrl);

    const socketInstance = io(wsUrl, {
      auth: { apiKey }, // Use API key for socket auth
      query: {
        environment,
      },
      forceNew: true,
      path: "/socket.io",
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 3,
    });

    socketInstance.on("connect", () => {
      console.log("[FlagPole SDK] Connected to WebSocket");
      setError(null);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("[FlagPole SDK] Failed to connect:", err);
      setError(
        err instanceof Error ? err : new Error("WebSocket connection failed")
      );
    });

    socketInstance.on("featureFlagUpdate", (updatedFlag: FeatureFlag) => {
      if (
        !updatedFlag.environments ||
        updatedFlag.environments.includes(environment)
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
  }, [environment]);

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
