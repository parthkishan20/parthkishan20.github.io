import { createContext } from "react"

export type Theme = "dark" | "light" | "system"

export type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

// The context lives here rather than beside the provider component so
// that theme-provider.tsx exports a component and nothing else. A file
// that mixes component and non-component exports loses react-refresh's
// ability to hot-swap it surgically (the react-refresh/only-export-
// components rule), which is what this split resolves - behavior is
// unchanged.
export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState)
