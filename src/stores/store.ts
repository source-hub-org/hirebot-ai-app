import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import candidateDetailReducer from "./candidateDetailSlice";
import languageReducer from "./languageSlice";
import instrumentReducer from "./instrumentSlice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, candidateDetailReducer);

export const store = configureStore({
  reducer: {
    candidateDetail: persistedReducer,
    language: languageReducer,
    instrument: instrumentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
