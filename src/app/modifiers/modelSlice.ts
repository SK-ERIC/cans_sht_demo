import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ModelState {
  content: number[];
}

const initialState: ModelState = {
  content: []
};

const modelSlice = createSlice({
  name: 'model',
  initialState,
  reducers: {
    addContent(state, { payload }: PayloadAction<number>) {
      state.content.push(payload);
    }
  }
});

export const { addContent } = modelSlice.actions;

export default modelSlice.reducer;
