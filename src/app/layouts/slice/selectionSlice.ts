import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SelectionBoard {
  width: number;
  height: number;
  left: number;
  top: number;
  activeRows: number[];
  activeColumns: number[];
}

const initialState: SelectionBoard = {
  width: 0,
  height: 0,
  left: 0,
  top: 0,
  activeRows: [],
  activeColumns: []
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    addActiveRows(state, { payload }: PayloadAction<number>) {
      state.activeRows.push(payload);
    }
  }
});

export const { addActiveRows } = selectionSlice.actions;

export default selectionSlice.reducer;
