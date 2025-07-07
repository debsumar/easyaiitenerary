// src/features/theme/themeSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store/store';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
    mode: ThemeMode;
    isDark: boolean;
    systemPreference: 'light' | 'dark';
    isInitialized: boolean;
}

// Initial state - will be properly set when component mounts
const initialState: ThemeState = {
    mode: 'system',
    isDark: false,
    systemPreference: 'light',
    isInitialized: false
};

// Helper function to calculate isDark
const calculateIsDark = (mode: ThemeMode, systemPreference: 'light' | 'dark'): boolean => {
    switch (mode) {
        case 'dark':
            return true;
        case 'light':
            return false;
        case 'system':
            return systemPreference === 'dark';
        default:
            return false;
    }
};

// Helper function to get system preference
const getSystemPreference = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
};

// Helper function to get saved theme
const getSavedTheme = (): ThemeMode => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
            return saved;
        }
    }
    return 'system';
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        initializeTheme: (state) => {
            console.log('🎨 Initializing theme...');

            // Get current values
            const systemPreference = getSystemPreference();
            const savedMode = getSavedTheme();
            const isDark = calculateIsDark(savedMode, systemPreference);

            console.log('🎨 Theme init values:', { savedMode, systemPreference, isDark });

            // Update state
            state.mode = savedMode;
            state.systemPreference = systemPreference;
            state.isDark = isDark;
            state.isInitialized = true;

            console.log('🎨 Theme initialized:', state);
        },

        setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
            console.log('🎨 Setting theme mode to:', action.payload);

            state.mode = action.payload;
            state.isDark = calculateIsDark(action.payload, state.systemPreference);

            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('theme', action.payload);
                console.log('🎨 Saved to localStorage:', action.payload);
            }

            console.log('🎨 New theme state:', { mode: state.mode, isDark: state.isDark });
        },

        toggleTheme: (state) => {
            console.log('🎨 Toggling theme from:', state.mode, 'isDark:', state.isDark);

            // Simple toggle between light and dark
            const newMode: ThemeMode = state.isDark ? 'light' : 'dark';

            state.mode = newMode;
            state.isDark = !state.isDark; // Correctly toggle the isDark state

            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('theme', newMode);
                console.log('🎨 Toggled and saved to localStorage:', newMode);
            }

            console.log('🎨 After toggle:', { mode: state.mode, isDark: state.isDark });
        },

        setSystemPreference: (state, action: PayloadAction<'light' | 'dark'>) => {
            console.log('🎨 System preference changed to:', action.payload);

            state.systemPreference = action.payload;

            // Recalculate isDark only if in system mode
            if (state.mode === 'system') {
                const newIsDark = action.payload === 'dark';
                console.log('🎨 Updating isDark due to system change:', newIsDark);
                state.isDark = newIsDark;
            }
        },
    },
});

export const { initializeTheme, setThemeMode, toggleTheme, setSystemPreference } = themeSlice.actions;
export default themeSlice.reducer;

// Selectors
export const selectThemeMode = (state: RootState) => state.theme.mode;
export const selectIsDark = (state: RootState) => state.theme.isDark;
export const selectSystemPreference = (state: RootState) => state.theme.systemPreference;
export const selectIsInitialized = (state: RootState) => state.theme.isInitialized;