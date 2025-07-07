// src/app/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { travelApi } from "../../services/api/travel/travelApi";
import themeReducer from "../../features/theme/themeSlice";
import { emailApi } from "../../services/api/email/emailApi"; // Import the new email API

export const store = configureStore({
    reducer: {
        [travelApi.reducerPath]: travelApi.reducer, // Add travel API reducer
        [emailApi.reducerPath]: emailApi.reducer, // Add email API reducer
        theme: themeReducer, // Add theme reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            travelApi.middleware, // Add travel API middleware
            emailApi.middleware // Add email API middleware
        ),
});

// Optional: For refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

// Inferred types for app-wide usage
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
