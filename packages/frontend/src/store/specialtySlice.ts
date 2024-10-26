import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SpecialtyState {
    selectedSpecialty: string | null;
}

const initialState: SpecialtyState = {
    selectedSpecialty: null,
};

const specialtySlice = createSlice({
    name: 'specialty',
    initialState,
    reducers: {
        setSpecialty(state, action: PayloadAction<string>) {
            state.selectedSpecialty = action.payload;
        },
        clearSpecialty(state) {
            state.selectedSpecialty = null;
        },
    },
});

export const { setSpecialty, clearSpecialty } = specialtySlice.actions;
export default specialtySlice.reducer;
