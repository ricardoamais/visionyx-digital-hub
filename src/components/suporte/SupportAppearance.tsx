import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Appearance = "dark" | "light";
const STORAGE_KEY = "visionyx-support-appearance";
const AppearanceContext = createContext<{ theme: Appearance; toggle: () => void } | null>(null);

export function SupportThemeToggle() {
  const context = useContext(AppearanceContext);
  if (!context) return null;
  const label = context.theme === "dark" ? "Usar tema claro" : "Usar tema escuro";
  return (
    <Button type="button" variant="outline" size="icon" onClick={context.toggle}
      aria-label={label} title={label} className="shrink-0">
      {context.theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}

export function SupportAppearance({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [theme, setTheme] = useState<Appearance>(() => {
    try { return localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark"; }
    catch { return "dark"; }
  });
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* Appearance still works without storage. */ }
  }, [theme]);
  const toggle = () => setTheme(previous => previous === "dark" ? "light" : "dark");
  const isSupport = pathname === "/suporte" || pathname.startsWith("/suporte/") || pathname.startsWith("/central-de-suporte/admin");
  if (!isSupport) return children;
  const isAccess = pathname === "/suporte" || pathname === "/suporte/redefinir-senha";
  return (
    <AppearanceContext.Provider value={{ theme, toggle }}>
      <div className="support-theme min-h-screen bg-background text-foreground" data-support-theme={theme}>
        {isAccess && <div className="absolute top-4 right-4 z-50"><SupportThemeToggle /></div>}
        {children}
      </div>
    </AppearanceContext.Provider>
  );
}