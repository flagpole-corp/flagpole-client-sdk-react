import React, { FC, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { FeatureFlagContext } from "./Context";
import { FeatureFlag, FeatureFlagProviderProps } from "./types";
import { DEFAULT_CONFIG } from "./config";

export const FeatureFlagProvider: FC<FeatureFlagProviderProps> = ({
  projectId,
  authToken,
  organizationId,
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
      Authorization: `Bearer ${authToken}`,
      "x-project-id": projectId,
      "x-organization-id": organizationId,
    },
  });

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
    const wsUrl = DEFAULT_CONFIG.WS_URL;
    console.log("[FlagPole SDK] WS URL before initialization:", wsUrl);

    const socketOptions = {
      auth: { token: authToken },
      query: {
        environment,
        projectId,
      },
      forceNew: true,
      path: "/socket.io",
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 3,
    };

    console.log("[FlagPole SDK] Socket options:", socketOptions);

    const socketInstance = io(wsUrl, socketOptions);

    socketInstance.on("connecting", (transport) => {
      console.log("[FlagPole SDK] Connecting with transport:", transport);
    });

    socketInstance.on("connect", () => {
      console.log("[FlagPole SDK] Connected to WebSocket at:", wsUrl);
      console.log("[FlagPole SDK] Socket details:", {
        connected: socketInstance.connected,
        id: socketInstance.id,
      });
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
