import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
  isDarkMode: boolean
  primaryColor: string
  toggleDarkMode: () => void
  setPrimaryColor: (color: string) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDarkMode: false,
      primaryColor: '#1976d2',

      toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }))
      },

      setPrimaryColor: (color: string) => {
        set({ primaryColor: color })
      },
    }),
    {
      name: 'theme-storage',
    }
  )
)