// src/components/ui/ThemeToggle.tsx
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { selectIsDark, toggleTheme } from '../../features/theme/themeSlice';

interface ThemeToggleProps {
    size?: 'sm' | 'md' | 'lg';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 'md' }) => {
    const dispatch = useAppDispatch();
    const isDark = useAppSelector(selectIsDark);

    const handleToggle = () => {
        dispatch(toggleTheme());
    };

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    return (
        <button
            onClick={handleToggle}
            className={`
        ${sizeClasses[size]} 
        flex items-center justify-center
        bg-gray-100 hover:bg-gray-200 
        dark:bg-gray-800 dark:hover:bg-gray-700
        rounded-lg transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
      `}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        >
            {isDark ? (
                <Sun className={`${iconSizes[size]} text-yellow-500`} />
            ) : (
                <Moon className={`${iconSizes[size]} text-gray-600 dark:text-gray-300`} />
            )}
        </button>
    );
};

export default ThemeToggle;
