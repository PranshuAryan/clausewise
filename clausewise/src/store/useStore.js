import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      
      jurisdiction: 'US',
      setJurisdiction: (j) => set({ jurisdiction: j }),

      // The currently active document for analysis
      currentDocument: null, // { name, text, type }
      setCurrentDocument: (doc) => set({ currentDocument: doc }),
      
      // Analysis results
      analysisResults: null,
      setAnalysisResults: (results) => set({ analysisResults: results }),

      // Compare mode documents
      compareDocA: null,
      compareDocB: null,
      setCompareDocA: (doc) => set({ compareDocA: doc }),
      setCompareDocB: (doc) => set({ compareDocB: doc }),
      compareResults: null,
      setCompareResults: (results) => set({ compareResults: results }),

      clearAll: () => set({ 
        currentDocument: null, 
        analysisResults: null, 
        compareDocA: null, 
        compareDocB: null, 
        compareResults: null 
      }),
    }),
    {
      name: 'clausewise-storage-v3',
      partialize: (state) => ({ 
        theme: state.theme, 
        jurisdiction: state.jurisdiction 
      }),
    }
  )
);

export default useStore;
