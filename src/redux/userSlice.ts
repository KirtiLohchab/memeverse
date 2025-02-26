import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  likedMemes: string[];
}

const initialState: User = {
  id: "",
  name: "",
  avatar: "/default-avatar.png",
  bio: "",
  likedMemes: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      return { ...state, ...action.payload };
    },
    toggleLikeMeme: (state, action: PayloadAction<string>) => {
      const memeId = action.payload;
      if (state.likedMemes.includes(memeId)) {
        state.likedMemes = state.likedMemes.filter((id) => id !== memeId);
      } else {
        state.likedMemes.push(memeId);
      }
      localStorage.setItem("likedMemes", JSON.stringify(state.likedMemes));
    },
  },
});

export const { updateProfile, toggleLikeMeme } = userSlice.actions;
export default userSlice.reducer;
