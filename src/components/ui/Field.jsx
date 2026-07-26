import { useId } from "react";
import { cn } from "../../lib/cn";

const baseControl =
  "w-full rounded-none border-0 border-b border-line bg-transparent px-0 py-2.5 text-[0.8125rem] text-ink " +
  "placeholder:text-muted/70 focus:border-ink focus:outline-none focus:ring-0 transition-colors ease-editorial";

/** Label above, hairline underline below. Labels are always rendered. */
const Field = ({
  label,
  hint,
  error,
  as = "input",
  className,
  id: providedId,
  children,
  ...props
}) => {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const Control = as;

  return (
    <div className={cn("w-full", className)}>
      <label htmlFor={id} className="meta mb-1.5 block">
        {label}
      </label>

      <Control
        {...props}
        id={id}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy}
        className={cn(baseControl, error && "border-danger focus:border-danger")}
      >
        {children}
      </Control>

      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
};

export default Field;
