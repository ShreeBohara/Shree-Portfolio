import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Sidebar state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Details panel state
  isDetailsPanelOpen: boolean;
  selectedItemId: string | null;
  selectedItemType: 'project' | 'experience' | 'education' | null;
  setSelectedItem: (id: string | null, type: 'project' | 'experience' | 'education' | null) => void;
  closeDetailsPanel: () => void;
  
  // Chat context
  chatContext: {
    enabled: boolean;
    itemId: string | null;
    itemType: 'project' | 'experience' | 'education' | null;
  };
  setChatContext: (context: Partial<UIState['chatContext']>) => void;
  clearChatContext: () => void;
  
  // New chat trigger
  newChatTrigger: number;
  triggerNewChat: () => void;
  
  // View preferences
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Theme accent color
  accentColor: 'teal' | 'blue' | 'pink' | 'orange' | 'yellow' | 'green' | 'red' | 'violet';
  setAccentColor: (color: 'teal' | 'blue' | 'pink' | 'orange' | 'yellow' | 'green' | 'red' | 'violet') => void;

  // Initial animation state
  isInitialAnimationComplete: boolean;
  setInitialAnimationComplete: (complete: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Sidebar
      isSidebarOpen: false, // Default closed on load
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      
      // Details panel
      isDetailsPanelOpen: false,
      selectedItemId: null,
      selectedItemType: null,
      setSelectedItem: (id, type) => set({
        selectedItemId: id,
        selectedItemType: type,
        isDetailsPanelOpen: id !== null,
      }),
      closeDetailsPanel: () => set({
        isDetailsPanelOpen: false,
        selectedItemId: null,
        selectedItemType: null,
      }),
      
      // Chat context
      chatContext: {
        enabled: false,
        itemId: null,
        itemType: null,
      },
      setChatContext: (context) => set((state) => ({
        chatContext: { ...state.chatContext, ...context },
      })),
      clearChatContext: () => set({
        chatContext: { enabled: false, itemId: null, itemType: null },
      }),
      
      // New chat trigger
      newChatTrigger: 0,
      triggerNewChat: () => set((state) => ({ 
        newChatTrigger: state.newChatTrigger + 1,
        chatContext: { enabled: false, itemId: null, itemType: null },
      })),
      
      // View preferences
      viewMode: 'grid',
      setViewMode: (mode) => set({ viewMode: mode }),
      
      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      // Theme accent color
      accentColor: 'teal',
      setAccentColor: (color) => set({ accentColor: color }),

      // Initial animation state
      isInitialAnimationComplete: false,
      setInitialAnimationComplete: (complete) => set({ isInitialAnimationComplete: complete }),
    }),
    {
      name: 'portfolio-ui-preferences',
      partialize: (state) => ({
        theme: state.theme,
        viewMode: state.viewMode,
        accentColor: state.accentColor,
      }),
    }
  )
);
