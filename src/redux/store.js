import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';

import appointmentsSlice from './appointmentsSlice';
import patientsSlice from './patientsSlice';
import doctorsSlice from './doctorsSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  appointmentsSlice,
  doctorsSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: {
    records: persistedReducer,
  },
});

const persistor = persistStore(store);

export { store, persistor };
