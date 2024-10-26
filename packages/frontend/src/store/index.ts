import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import specialtyReducer from './specialtySlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        specialty: specialtyReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
