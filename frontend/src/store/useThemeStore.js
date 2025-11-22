import { create } from 'zustand'

const useThemeStore = create((set) => ({
  theme: localStorage.getItem("RippleStream-theme")|| "coffee",
  setTheme:(theme)=>{
    localStorage.setItem("RippleStream-theme",theme);
    set({theme})
  }

}))
;
export default useThemeStore;