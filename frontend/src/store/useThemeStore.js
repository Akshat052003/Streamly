import {create} from 'zustand'

export const useThemeStore = create((set) => ({
    theme : localStorage.getItem("streamly-theme"),
    setTheme : (theme) => {
        localStorage.setItem("streamly-theme", theme)
        set({theme})
    }
}))