import { useEffect, useRef } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/**
 * Prefer the first field over chrome like the close button so typing
 * starts immediately and Space doesn't activate Close.
 */
const firstInteractive = (container) => {
  if (!container) return null;
  const focusables = Array.from(container.querySelectorAll(FOCUSABLE)).filter(
    (node) => node.offsetParent !== null
  );
  return (
    focusables.find((node) => {
      const tag = node.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
    }) ??
    focusables[0] ??
    container
  );
};

/**
 * Everything a dialog or drawer owes the user: locked background scroll,
 * trapped focus, Esc to close, and focus returned where it came from.
 *
 * onClose is kept in a ref so parent re-renders (e.g. typing in a form)
 * do not re-run this effect and steal focus back to the first button.
 */
export const usePortalBehaviour = ({ open, onClose }) => {
  const containerRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;

    const { body } = document;
    const previouslyFocused = document.activeElement;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    const container = containerRef.current;
    firstInteractive(container)?.focus?.();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== "Tab" || !container) return;

      const focusables = Array.from(container.querySelectorAll(FOCUSABLE)).filter(
        (node) => node.offsetParent !== null
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  return containerRef;
};
