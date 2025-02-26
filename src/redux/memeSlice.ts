"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Meme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  likes: number;
  comments: number;
  date: string;
  imageUrl: string;
}

interface MemeState {
  memes: Meme[];
  loading: boolean;
  uploading: boolean;
  error: string | null;
}

export const fetchMemes = createAsyncThunk("memes/fetchMemes", async () => {
  const response = await fetch("https://api.imgflip.com/get_memes");
  const data = await response.json();

  return data.data.memes.map((meme: any) => ({
    id: meme.id,
    name: meme.name,
    url: meme.url,
    width: meme.width || 500,
    height: meme.height || 500,
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 500),
    date: new Date(
      Date.now() - Math.floor(Math.random() * 10000000000)
    ).toISOString(),
  }));
});

export const uploadMeme = createAsyncThunk(
  "memes/uploadMeme",
  async (
    { file, caption }: { file: File; caption: string },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUDINARY_NAME/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload meme");
      }

      const data = await response.json();
      return {
        id: data.public_id,
        name: caption,
        url: data.secure_url,
        width: data.width || 500,
        height: data.height || 500,
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 500),
        date: new Date().toISOString(),
      } as Meme;
    } catch (error: any) {
      return rejectWithValue(error.message || "Upload failed");
    }
  }
);

const initialState: MemeState = {
  memes: [],
  loading: false,
  uploading: false,
  error: null,
};

const memeSlice = createSlice({
  name: "memes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemes.fulfilled, (state, action) => {
        state.loading = false;
        state.memes = action.payload;
      })
      .addCase(fetchMemes.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load memes";
      })
      .addCase(uploadMeme.pending, (state) => {
        state.uploading = true;
      })
      .addCase(uploadMeme.fulfilled, (state, action) => {
        state.uploading = false;
        state.memes.unshift(action.payload);
      })
      .addCase(uploadMeme.rejected, (state) => {
        state.uploading = false;
        state.error = "Failed to upload meme";
      });
  },
});

export default memeSlice.reducer;
