// In-memory preference storage fallback to eliminate missing AsyncStorage dependency
let inMemoryPreferences: Record<string, any> = {};

export const saveUserPreferences = async (preferences: any) => {
    try {
        inMemoryPreferences = { ...inMemoryPreferences, ...preferences };
    } catch (e) {
        console.error('Failed to save user preferences:', e);
    }
};

export const getUserPreferences = async () => {
    try {
        return inMemoryPreferences;
    } catch (e) {
        console.error('Failed to retrieve user preferences:', e);
        return null;
    }
};

export const clearUserPreferences = async () => {
    try {
        inMemoryPreferences = {};
    } catch (e) {
        console.error('Failed to clear user preferences:', e);
    }
};