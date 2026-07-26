import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { usePortalBehaviour } from "../../hooks/usePortalBehaviour";

/** Left-side panel used for the mobile navigation. */
const Drawer = ({ open, onClose, title, children }) => {
  const containerRef = usePortalBehaviour({ open, onClose });

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/25 animate-fade-in"
      />

      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-line bg-surface shadow-portal outline-none animate-slide-from-left"
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="meta-ink">{title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="-mr-2 p-2 text-muted transition-colors ease-editorial hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Drawer;
