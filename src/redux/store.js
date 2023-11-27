import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import recordReducer from './recordsSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, recordReducer);

const store = configureStore({
  reducer: {
    records: persistedReducer,
  },
});

const persistor = persistStore(store);

export { store, persistor };
