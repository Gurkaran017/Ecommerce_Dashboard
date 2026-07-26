import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";
import { usePortalBehaviour } from "../../hooks/usePortalBehaviour";

const SIZES = {
  sm: "max-w-[26rem]",
  md: "max-w-[34rem]",
  lg: "max-w-[48rem]",
};

const Modal = ({ open, onClose, title, description, size = "md", children }) => {
  const containerRef = usePortalBehaviour({ open, onClose });

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="fixed inset-0 h-full w-full cursor-default bg-ink/25 animate-fade-in"
      />

      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "relative my-auto w-full border border-line bg-surface p-7 shadow-portal outline-none animate-rise-in",
          SIZES[size]
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${title}`}
          className="absolute right-4 top-4 p-2 text-muted transition-colors ease-editorial hover:text-ink"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <h2 className="pr-10 font-display text-2xl">{title}</h2>
        {description && (
          <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
            {description}
          </p>
        )}

        <div className="mt-6">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
