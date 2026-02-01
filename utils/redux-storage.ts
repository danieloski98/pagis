import * as SecureStore from "expo-secure-store";
import { Storage } from "redux-persist";

const reduxStorage: Storage = {
  setItem: async (key, value) => {
    await SecureStore.setItemAsync(key, value);
    return Promise.resolve(true);
  },
  getItem: async (key) => {
    const value = await SecureStore.getItemAsync(key);
    return Promise.resolve(value);
  },
  removeItem: async (key) => {
    await SecureStore.deleteItemAsync(key);
    return Promise.resolve();
  },
};

export default reduxStorage;
