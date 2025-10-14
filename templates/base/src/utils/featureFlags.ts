import { z } from 'zod';

// Define the shape of our feature flags
const featuresSchema = z.object({
  // Core feature flags
  experimentalUI: z.boolean().default(false),
  newAuthFlow: z.boolean().default(false),
  enableAnalytics: z.boolean().default(true),
  betaFeatures: z.boolean().default(false),

  // Feature-specific flags
  advancedSearch: z.boolean().default(false),
  darkMode: z.boolean().default(true),
});

// Extract type from zod schema
export type Features = z.infer<typeof featuresSchema>;

// Default values
const defaultFeatures: Features = {
  experimentalUI: false,
  newAuthFlow: false,
  enableAnalytics: true,
  betaFeatures: false,
  advancedSearch: false,
  darkMode: true,
};

// Load feature flags from environment or JSON config
function loadFeatures(): Features {
  let flags = { ...defaultFeatures };

  // Load from environment variables if available
  if (typeof process !== 'undefined' && process.env) {
    Object.keys(defaultFeatures).forEach((key) => {
      const envKey = `NEXT_PUBLIC_FEATURE_${key.toUpperCase()}`;
      if (process.env[envKey]) {
        // @ts-expect-error - dynamic key access
        flags[key] = process.env[envKey] === 'true';
      }
    });
  }

  // Load from localStorage in client only
  if (typeof window !== 'undefined') {
    try {
      const storedFlags = localStorage.getItem('featureFlags');
      if (storedFlags) {
        flags = {
          ...flags,
          ...JSON.parse(storedFlags),
        };
      }
    } catch (error) {
      console.error('Failed to parse feature flags from localStorage:', error);
    }
  }

  // Validate against schema to ensure type safety
  return featuresSchema.parse(flags);
}

// Memoized features
let features: Features | null = null;

// Get all features
export function getFeatures(): Features {
  if (!features) {
    features = loadFeatures();
  }
  return features;
}

// Check if a specific feature is enabled
export function isFeatureEnabled(featureName: keyof Features): boolean {
  return getFeatures()[featureName];
}

// For client-side only: allow overriding features (useful for testing)
export function setFeatureOverride(featureName: keyof Features, enabled: boolean): void {
  if (typeof window === 'undefined') {
    return;
  }

  const currentFeatures = getFeatures();
  const updatedFeatures = { ...currentFeatures, [featureName]: enabled };

  // Update memory cache
  features = updatedFeatures;

  // Store in localStorage
  localStorage.setItem('featureFlags', JSON.stringify(updatedFeatures));
}

// Reset all overrides
export function resetFeatureOverrides(): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem('featureFlags');
  features = null; // Force reload from defaults
}
