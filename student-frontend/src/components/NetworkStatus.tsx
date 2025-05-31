
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, 
  AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from "@/components/ui/alert-dialog";

interface NetworkStatusProps {
  onConnectionChange: (isOnline: boolean) => void;
}

export function NetworkStatus({ onConnectionChange }: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);
  const [reconnectionTimer, setReconnectionTimer] = useState(30);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineAlert(false);
      onConnectionChange(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineAlert(true);
      setReconnectionTimer(30);
      onConnectionChange(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [onConnectionChange]);

  // Countdown timer when offline
  useEffect(() => {
    let interval: number | undefined;
    
    if (!isOnline && reconnectionTimer > 0) {
      interval = window.setInterval(() => {
        setReconnectionTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOnline, reconnectionTimer]);

  return (
    <>
      <div className={`fixed top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {isOnline ? 'Online' : 'Offline'}
      </div>

      <AlertDialog open={showOfflineAlert} onOpenChange={setShowOfflineAlert}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Connection Lost</AlertDialogTitle>
            <AlertDialogDescription>
              <p>You are currently offline. Please reconnect to continue your exam.</p>
              <div className="mt-4">
                <p>Reconnect within: <span className="font-semibold text-red-600">{reconnectionTimer}s</span></p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-red-600 h-2.5 rounded-full" 
                    style={{ width: `${(reconnectionTimer/30)*100}%` }}
                  ></div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <p className="text-xs text-gray-500">
              Attempting to reconnect automatically...
            </p>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
