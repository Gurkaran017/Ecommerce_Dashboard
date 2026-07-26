import { cn } from "../../lib/cn";

/* Uses currentColor, so it is visible on whatever it sits on. The old spinners
   were border-white on a white page — an invisible loading state. */
const Spinner = ({ className }) => (
  <span
    aria-hidden="true"
    className={cn(
      "inline-block h-3.5 w-3.5 shrink-0 animate-spin rounded-full",
      "border border-current border-t-transparent",
      className
    )}
  />
);

export default Spinner;
