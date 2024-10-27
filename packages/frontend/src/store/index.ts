import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import specialtyReducer from './specialtySlice';
import resultsReducer from './resultsSlice.ts';

const store = configureStore({
    reducer: {
        auth: authReducer,
        specialty: specialtyReducer,
        results: resultsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
