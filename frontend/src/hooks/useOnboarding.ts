const KEY = 'roamwise_onboarding';

export function useOnboarding() {
  const isComplete = (): boolean => {
    try {
      return localStorage.getItem(KEY) !== null;
    } catch {
      return false;
    }
  };

  const complete = (preferences: string[]): void => {
    localStorage.setItem(KEY, JSON.stringify(preferences));
  };

  const getPreferences = (): string[] => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  };

  const reset = (): void => localStorage.removeItem(KEY);

  return { isComplete, complete, getPreferences, reset };
}
