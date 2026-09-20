import { useEffect, useState } from "react"
import { ThemeProviderContext, type Theme } from "@/hooks/use-theme"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

// Dark mode doesn't fully match the Apple design system yet, so it's
// disabled at the entry point rather than ripped out: the toggle UI is
// unmounted (rail-nav.tsx / mobile-nav.tsx) and this flag makes every
// session resolve to light regardless of a stale "dark"/"system" value
// already sitting in localStorage from before this change. Flip it back
// to false and re-mount <ModeToggle /> once dark mode is revisited —
// nothing else here needs to change.
const FORCE_LIGHT_MODE = true

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() =>
    FORCE_LIGHT_MODE
      ? "light"
      : (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}
