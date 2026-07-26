import { useEffect, useState } from "react";
import { useTheme } from "../contexts/theme-context";
import { chartPalette } from "../lib/tokens";

/**
 * Recharts renders SVG that cannot inherit CSS custom properties, so chart
 * colours are read off the document. This re-reads them whenever the theme
 * flips, and carries the active theme along for charts that need to branch.
 */
export const useChartPalette = () => {
  const { theme } = useTheme();
  const [palette, setPalette] = useState(() => ({ ...chartPalette(), theme }));

  useEffect(() => {
    setPalette({ ...chartPalette(), theme });
  }, [theme]);

  return palette;
};
