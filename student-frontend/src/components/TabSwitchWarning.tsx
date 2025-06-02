
import { AlertDialog, AlertDialogContent, AlertDialogDescription, 
         AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, 
         AlertDialogAction } from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";

interface TabSwitchWarningProps {
  isVisible: boolean;
  tabSwitchCount: number;
  onClose: () => void;
  onExceedLimit?: () => void;
  maxAllowedSwitches?: number;
}

export function TabSwitchWarning({
  isVisible,
  tabSwitchCount,
  onClose,
  onExceedLimit,
  maxAllowedSwitches = 2,
}: TabSwitchWarningProps) {
  const [showWarning, setShowWarning] = useState(false);
  
  useEffect(() => {
    if (isVisible) {
      setShowWarning(true);
      
      if (tabSwitchCount >= maxAllowedSwitches && onExceedLimit) {
        onExceedLimit();
      }
    }
  }, [isVisible, tabSwitchCount, maxAllowedSwitches, onExceedLimit]);
  
  return (
    <AlertDialog 
      open={showWarning} 
      onOpenChange={(isOpen) => {
        setShowWarning(isOpen);
        if (!isOpen) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">Tab Switch Detected!</AlertDialogTitle>
          <AlertDialogDescription>
            <p>We've detected that you switched away from this exam tab.</p>
            <div className="mt-3 p-3 bg-red-50 rounded-md">
              <p className="font-medium text-red-700">Warning #{tabSwitchCount}</p>
              <p className="text-sm text-red-600 mt-1">
                Switching tabs during an exam is not allowed and may be considered cheating.
                {tabSwitchCount === maxAllowedSwitches - 1 && (
                  <span className="block mt-2 font-bold">
                    This is your final warning. Another violation may result in automatic exam termination.
                  </span>
                )}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>
            I understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
