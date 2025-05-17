import { createSlice } from '@reduxjs/toolkit';

const chatMessagesSlice = createSlice({
    name: 'chatMessages',
    initialState: [],
    reducers: {
        addMessage: (state, action) => {
            state.push(action.payload);
        },
    },
});

export const { addMessage } = chatMessagesSlice.actions;
export default chatMessagesSlice.reducer;
