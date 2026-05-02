import { useEffect, useState } from "react";
import { Toaster as Sonner } from "sonner";

// Reads our :root[data-theme="..."] attribute. Falls back to dark.
function useThemeAttr() {
  const [theme, setTheme] = useState(() => {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.dataset.theme || "dark";
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.dataset.theme || "dark");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return theme;
}

const Toaster = ({ ...props }) => {
  const theme = useThemeAttr();

  return (
    <Sonner
      theme={theme}
      richColors
      closeButton
      position="bottom-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-surface-card border border-ink-200 text-ink-900 shadow-2",
          description: "text-ink-700",
          actionButton:
            "bg-primary-800 text-ink-on-dark hover:bg-primary-700",
          cancelButton: "bg-surface-sunk text-ink-700",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
