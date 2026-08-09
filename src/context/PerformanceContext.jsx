import { createContext, useContext, useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";

// Performance Tiers
export const TIERS = {
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
};

// Settings for each tier
const SETTINGS = {
  [TIERS.HIGH]: {
    dpr: [1, 2], // Allow up to 2x pixel density
    shadows: true, // Enable shadows
    antialias: true,
    powerPreference: "high-performance",
    physicsStep: 1 / 60,
    textureQuality: "high",
    particleCount: 1.0, // 100% particles
  },
  [TIERS.MEDIUM]: {
    dpr: [1, 1.5], // Cap at 1.5x on mobile to balance quality and GPU fillrate
    shadows: false, // Disable shadows for better mobile performance
    antialias: true,
    powerPreference: "default",
    physicsStep: 1 / 60,
    textureQuality: "medium",
    particleCount: 0.6, // 60% particles
  },
  [TIERS.LOW]: {
    dpr: [0.8, 1], // Minimum 0.8x pixel density to avoid extreme pixelation
    shadows: false, // Disable shadows completely
    antialias: false, // Disable AA to maximize FPS
    powerPreference: "low-power",
    physicsStep: 1 / 45, // Slower physics updates if needed
    textureQuality: "low",
    particleCount: 0.3, // 30% particles
  },
};

const PerformanceContext = createContext(null);

const getDeviceSignals = () => {
  if (typeof navigator === "undefined") {
    return {
      isMobile: false,
      isWeChat: false,
      isSaveData: false,
      isSlowConnection: false,
      hardwareConcurrency: undefined,
      deviceMemory: undefined,
    };
  }

  const userAgent = navigator.userAgent || "";
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const effectiveType = connection?.effectiveType || "";

  return {
    isMobile: /iPhone|iPad|iPod|Android/i.test(userAgent),
    isWeChat: /MicroMessenger/i.test(userAgent),
    isSaveData: Boolean(connection?.saveData),
    isSlowConnection: /(^|-)2g$|3g/i.test(effectiveType),
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: navigator.deviceMemory,
  };
};

const detectInitialTier = () => {
  const signals = getDeviceSignals();

  if (
    signals.isWeChat ||
    signals.isSaveData ||
    signals.isSlowConnection ||
    (signals.deviceMemory && signals.deviceMemory <= 4) ||
    (signals.isMobile && signals.hardwareConcurrency && signals.hardwareConcurrency <= 4)
  ) {
    return TIERS.LOW;
  }

  if (signals.isMobile || (signals.hardwareConcurrency && signals.hardwareConcurrency <= 4)) {
    return TIERS.MEDIUM;
  }

  return TIERS.HIGH;
};

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
};

export const PerformanceProvider = ({ children }) => {
  const [tier, setTier] = useState(() => detectInitialTier());
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    const detectTier = () => {
      setTier(detectInitialTier());
      setIsDetecting(false);
    };

    detectTier();
  }, []);

  // Function to manually downgrade tier (called by PerformanceMonitor)
  const downgradeTier = () => {
    setTier((current) => {
      if (current === TIERS.HIGH) return TIERS.MEDIUM;
      if (current === TIERS.MEDIUM) return TIERS.LOW;
      return TIERS.LOW;
    });
  };

  const value = {
    tier,
    settings: SETTINGS[tier],
    isDetecting,
    downgradeTier,
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};
