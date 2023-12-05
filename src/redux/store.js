import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';

import appointmentsSlice from './appointmentsSlice';
import doctorsSlice from './doctorsSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['doctors']
};

const rootReducer = combineReducers({
  records: appointmentsSlice,
  doctors: doctorsSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  })
});

const persistor = persistStore(store);

export { store, persistor };
