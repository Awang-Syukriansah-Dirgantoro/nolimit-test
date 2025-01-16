const { create } = require("zustand");

export const useFilter = create((set) => ({
  filter: {
    from:"",
    to:""
  },
  setFilter: (newFilter) => set((state) => ({ filter: newFilter })),
}))