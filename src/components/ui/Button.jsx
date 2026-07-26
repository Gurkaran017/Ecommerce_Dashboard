import { cn } from "../../lib/cn";
import Spinner from "./Spinner";

const VARIANTS = {
  solid: "bg-ink text-bg hover:bg-ink/85 disabled:bg-ink/30 disabled:text-bg/70",
  outline:
    "border border-ink text-ink hover:bg-ink hover:text-bg disabled:border-line disabled:text-muted disabled:hover:bg-transparent disabled:hover:text-muted",
  quiet:
    "border border-line text-ink hover:border-ink disabled:text-muted disabled:hover:border-line",
  /* Destructive is always text-weight or hairline — never a filled red block. */
  danger:
    "border border-danger text-danger hover:bg-danger hover:text-bg disabled:opacity-50",
  ghost: "text-muted hover:text-ink",
};

const SIZES = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-5 text-[0.8125rem]",
  lg: "h-12 px-6 text-sm",
};

const Button = ({
  as: Component = "button",
  variant = "solid",
  size = "md",
  full = false,
  loading = false,
  disabled = false,
  className,
  children,
  ...props
}) => (
  <Component
    {...props}
    {...(Component === "button" ? { disabled: disabled || loading } : {})}
    aria-busy={loading || undefined}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-none font-medium tracking-[0.02em]",
      "transition-colors ease-editorial disabled:cursor-not-allowed",
      VARIANTS[variant],
      SIZES[size],
      full && "w-full",
      className
    )}
  >
    {loading && <Spinner />}
    {children}
  </Component>
);

export default Button;
