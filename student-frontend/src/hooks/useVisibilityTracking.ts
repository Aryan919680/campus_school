
import { useState, useEffect } from "react";

export function useVisibilityTracking() {
  const [isHidden, setIsHidden] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setIsHidden(true);
        setTabSwitchCount(prev => prev + 1);
      } else {
        setIsHidden(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Additional measures to detect tab/window switching
    window.addEventListener("blur", () => setIsHidden(true));
    window.addEventListener("focus", () => setIsHidden(false));
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", () => setIsHidden(true));
      window.removeEventListener("focus", () => setIsHidden(false));
    };
  }, []);

  return { isHidden, tabSwitchCount };
}
