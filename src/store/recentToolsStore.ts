import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ToolData } from '../data/toolsData';

type RecentToolsState = {
  recentTools: string[];
  addRecentTool: (toolId: string) => void;
  clearRecentTools: () => void;
};

export const useRecentToolsStore = create<RecentToolsState>()(
  persist(
    (set) => ({
      recentTools: [],
      addRecentTool: (toolId) =>
        set((state) => {
          // Remove the tool if it already exists
          const filteredTools = state.recentTools.filter((id) => id !== toolId);
          // Add the tool to the beginning and keep only the 5 most recent
          return { recentTools: [toolId, ...filteredTools].slice(0, 5) };
        }),
      clearRecentTools: () => set({ recentTools: [] }),
    }),
    {
      name: 'recent-tools-storage',
    }
  )
);