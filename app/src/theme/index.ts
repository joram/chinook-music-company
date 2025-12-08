export { createAppTheme } from './createTheme';
export { defaultTheme, darkTheme, musicTheme, themes } from './themes';
export type { ThemeConfig, ThemeColors } from './types';

// Import these values for use in getTheme function below
// Note: Even though we re-export them above, TypeScript requires explicit imports
// when using the values within the same file (not just re-exporting)
import { defaultTheme, themes } from './themes';

/**
 * Get a theme by name
 * 
 * This function allows dynamic theme selection by name. It looks up the theme
 * in the themes registry and falls back to defaultTheme if the requested theme
 * is not found.
 * 
 * @param themeName - Name of the theme to retrieve (e.g., 'default', 'dark', 'music')
 * @returns ThemeConfig or defaultTheme if not found
 * 
 * @example
 * const theme = getTheme('dark');
 * const muiTheme = createAppTheme(theme);
 */
export const getTheme = (themeName: string = 'default') => {
  return themes[themeName] || defaultTheme;
};

