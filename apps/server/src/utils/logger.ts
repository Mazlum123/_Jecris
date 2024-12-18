export const logError = (location: string, error: unknown): void => {
    console.error(`[ERROR] ${location}:`, error);
  };
  