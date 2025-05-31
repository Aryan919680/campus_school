
import { useState, useEffect } from "react";

interface ConnectionStatusResult {
  isOnline: boolean;
  reconnectionTime: number | null;
  disconnectionTime: number | null;
  reconnectionCountdown: number;
}

export function useConnectionStatus(gracePeriod: number = 30): ConnectionStatusResult {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [disconnectionTime, setDisconnectionTime] = useState<number | null>(null);
  const [reconnectionTime, setReconnectionTime] = useState<number | null>(null);
  const [reconnectionCountdown, setReconnectionCountdown] = useState(gracePeriod);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setReconnectionTime(Date.now());
    };

    const handleOffline = () => {
      setIsOnline(false);
      setDisconnectionTime(Date.now());
      setReconnectionCountdown(gracePeriod);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [gracePeriod]);

  // Countdown timer for reconnection grace period
  useEffect(() => {
    let interval: number | undefined;
    
    if (!isOnline && reconnectionCountdown > 0) {
      interval = window.setInterval(() => {
        setReconnectionCountdown(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOnline, reconnectionCountdown]);

  return {
    isOnline,
    reconnectionTime,
    disconnectionTime,
    reconnectionCountdown
  };
}
