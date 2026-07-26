import { createContext, useContext } from "react";

/* Kept out of the .jsx provider so that file only exports a component and
   React Fast Refresh can hot-update it. */
export const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
