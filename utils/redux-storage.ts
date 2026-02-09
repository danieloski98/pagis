import AsyncStorage from "@react-native-async-storage/async-storage";
import { Storage } from "redux-persist";

const reduxStorage: Storage = {
  setItem: async (key, value) => {
    await AsyncStorage.setItem(key, value);
    return Promise.resolve(true);
  },
  getItem: async (key) => {
    const value = await AsyncStorage.getItem(key);
    return Promise.resolve(value);
  },
  removeItem: async (key) => {
    await AsyncStorage.removeItem(key);
    return Promise.resolve();
  },
};

export default reduxStorage;
