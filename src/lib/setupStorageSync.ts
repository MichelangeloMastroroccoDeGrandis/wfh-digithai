import { type StateStorage } from 'zustand/middleware';
import { debounce } from 'lodash';
import { useWFHStore, WFHStore } from '../store/wfhRequestsStore';

type WFHEventData = {
  type: 'storage';
  value: {
    state?: Partial<WFHStore>;
  };
};

type WFHMessageEvent = MessageEvent<WFHEventData>;

const channel =
  typeof window !== 'undefined' ? new BroadcastChannel('wfh_sync') : null;

export const syncedStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name);
    } catch (error) {
      console.error('Error getting from localStorage:', error);
      return null;
    }
  },

  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value);
      // Broadcast the change to other tabs
      const parsedValue = JSON.parse(value) as unknown;
      channel?.postMessage({
        type: 'storage',
        name,
        value: parsedValue,
      });
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  },

  removeItem: (name: string) => {
    try {
      localStorage.removeItem(name);
      channel?.postMessage({
        type: 'storage',
        name,
        value: null,
      });
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
};

if (typeof window !== 'undefined') {
  const updateState = debounce((newState: Partial<WFHStore>) => {
    useWFHStore.setState(newState);
  }, 200);

  channel?.addEventListener('message', (event: WFHMessageEvent) => {
    if (event.data.type === 'storage' && event.data.value?.state) {
      const state = event.data.value.state;
      updateState(state);
    }
  });
}

export const cleanupSync = () => {
  channel?.close();
};
