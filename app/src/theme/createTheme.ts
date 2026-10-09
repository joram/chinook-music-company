import { alpha, createTheme as createMuiTheme, Theme } from '@mui/material/styles';
import { ThemeConfig } from './types';

const displayFont = '"Bricolage Grotesque", "IBM Plex Sans", sans-serif';
const bodyFont = '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

declare module '@mui/material/styles' {
  interface Palette {
    sidebar: string;
  }
  interface PaletteOptions {
    sidebar?: string;
  }
}

export const createAppTheme = (config: ThemeConfig): Theme => {
  const { colors } = config;
  const divider = config.mode === 'light' ? '#DADDE4' : alpha('#FFFFFF', 0.12);

  return createMuiTheme({
    palette: {
      mode: config.mode,
      primary: {
        main: colors.primary,
      },
      secondary: {
        main: colors.secondary,
      },
      background: {
        default: colors.background,
        paper: colors.surface,
      },
      text: {
        primary: colors.text.primary,
        secondary: colors.text.secondary,
      },
      divider,
      sidebar: colors.sidebar ?? colors.surface,
      ...(colors.error && {
        error: {
          main: colors.error,
        },
      }),
      ...(colors.warning && {
        warning: {
          main: colors.warning,
        },
      }),
      ...(colors.info && {
        info: {
          main: colors.info,
        },
      }),
      ...(colors.success && {
        success: {
          main: colors.success,
        },
      }),
    },
    shape: {
      borderRadius: 10,
    },
    typography: {
      fontFamily: bodyFont,
      h3: { fontFamily: displayFont, fontWeight: 700, fontSize: '2.25rem', letterSpacing: '-0.02em', lineHeight: 1.15 },
      h4: { fontFamily: displayFont, fontWeight: 700, letterSpacing: '-0.015em' },
      h5: { fontFamily: displayFont, fontWeight: 600, letterSpacing: '-0.01em' },
      h6: { fontFamily: displayFont, fontWeight: 600, fontSize: '1.0625rem' },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          outlined: { borderColor: divider },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: divider,
            fontVariantNumeric: 'tabular-nums',
          },
          sizeSmall: {
            padding: '10px 16px',
          },
          head: {
            fontWeight: 600,
            fontSize: '0.8125rem',
            color: colors.text.secondary,
            backgroundColor: config.mode === 'light' ? '#F6F7F9' : colors.surface,
          },
          footer: {
            fontSize: '0.875rem',
            color: colors.text.primary,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&.MuiTableRow-hover:hover': {
              backgroundColor: alpha(colors.primary, 0.05),
            },
            '&:focus-visible': {
              outline: `2px solid ${colors.primary}`,
              outlineOffset: -2,
            },
            '&:last-child td': { borderBottom: 0 },
          },
        },
      },
      MuiTableSortLabel: {
        styleOverrides: {
          root: {
            '&.Mui-active': { color: colors.text.primary },
            '&.Mui-active .MuiTableSortLabel-icon': { color: colors.secondary },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: config.mode === 'light' ? '#F6F7F9' : 'transparent',
          },
        },
      },
    },
  });
};
