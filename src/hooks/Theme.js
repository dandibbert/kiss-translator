import { useEffect, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { useDarkMode } from "./ColorMode";
import { THEME_DARK, THEME_LIGHT } from "../config";
import { useSetting } from "./Setting";

/**
 * mui 主题配置
 * @param {*} param0
 * @returns
 */
export default function Theme({ children, options, styles }) {
  const { darkMode } = useDarkMode();
  const [systemMode, setSystemMode] = useState(THEME_LIGHT);
  const { setting } = useSetting();
  const fontFamily = setting?.fontFamily?.trim();

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setSystemMode(mediaQuery.matches ? THEME_DARK : THEME_LIGHT);
    };
    handleChange(); // Set initial value
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const theme = useMemo(() => {
    let htmlFontSize = 16;
    try {
      const s = window.getComputedStyle(document.body.parentNode).fontSize;
      const fontSize = parseInt(s.replace("px", ""));
      if (fontSize > 0 && fontSize < 1000) {
        htmlFontSize = fontSize;
      }
    } catch (err) {
      //
    }

    const isDarkMode =
      darkMode === "dark" || (darkMode === "auto" && systemMode === THEME_DARK);

    const basePalette = {
      mode: isDarkMode ? THEME_DARK : THEME_LIGHT,
    };

    const baseTypography = {
      htmlFontSize,
      ...(fontFamily ? { fontFamily } : {}),
    };

    const mergedOptions = {
      ...options,
      palette: {
        ...(options?.palette ?? {}),
        ...basePalette,
      },
      typography: {
        ...(options?.typography ?? {}),
        ...baseTypography,
      },
    };

    return createTheme(mergedOptions);
  }, [darkMode, fontFamily, options, systemMode]);

  const fontFamilyStyles = useMemo(() => {
    if (!fontFamily) {
      return null;
    }

    return {
      body: { fontFamily },
      "#root": { fontFamily },
      button: { fontFamily },
      input: { fontFamily },
      textarea: { fontFamily },
      select: { fontFamily },
    };
  }, [fontFamily]);

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      {fontFamilyStyles && <GlobalStyles styles={fontFamilyStyles} />}
      {styles && <GlobalStyles styles={styles} />}
      {children}
    </ThemeProvider>
  );
}
