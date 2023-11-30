import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import appointmentsSlice from './appointmentsSlice';
import patientsSlice from './patientsSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, appointmentsSlice, patientsSlice);

const store = configureStore({
  reducer: {
    records: persistedReducer,
  },
});

const persistor = persistStore(store);

export { store, persistor };
