import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export type SyncItem = {
  id: string;
  action: 'create' | 'update' | 'delete';
  resource: 'record' | 'medication' | 'lab';
  data: any;
  timestamp: number;
};

const SYNC_QUEUE_KEY = 'mhc_sync_queue';

export const syncQueue = {
  // Add an action to offline queue
  async add(item: Omit<SyncItem, 'id' | 'timestamp'>) {
    const queue = await this.getAll();
    const newItem: SyncItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    queue.push(newItem);
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    return newItem;
  },

  // Get all queued items
  async getAll(): Promise<SyncItem[]> {
    const data = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Sync with server
  async syncAll(token: string) {
    const queue = await this.getAll();
    const results = [];

    for (const item of queue) {
      try {
        const response = await axios.post(
          'http://localhost:4000/api/sync/process',
          item,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        results.push({ id: item.id, status: 'success', response });
        // Remove from queue after successful sync
        await this.remove(item.id);
      } catch (err) {
        results.push({ id: item.id, status: 'failed', error: err });
      }
    }

    return results;
  },

  // Remove item from queue
  async remove(id: string) {
    const queue = await this.getAll();
    const filtered = queue.filter((item) => item.id !== id);
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(filtered));
  },

  // Clear entire queue
  async clear() {
    await AsyncStorage.removeItem(SYNC_QUEUE_KEY);
  },
};
