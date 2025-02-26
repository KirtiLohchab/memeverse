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
  imageUrl?: string;
}

interface MemeState {
  memes: Meme[];
  loading: boolean;
  uploading: boolean;
  error: string | null;
}

interface FetchMemesResponse {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  likes: number;
  comments: number;
  date: string;
}

export const fetchMemes = createAsyncThunk<FetchMemesResponse[]>(
  "memes/fetchMemes",
  async () => {
    const response = await fetch("https://api.imgflip.com/get_memes");
    const data = await response.json();

    return data.data.memes.map((meme: Record<string, unknown>) => ({
      id: String(meme.id),
      name: String(meme.name),
      url: String(meme.url),
      width: Number(meme.width) || 500,
      height: Number(meme.height) || 500,
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 500),
      date: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
      ).toISOString(),
    }));
  }
);

export const uploadMeme = createAsyncThunk<
  Meme,
  { file: File; caption: string }
>("memes/uploadMeme", async ({ file, caption }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
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

    const data = (await response.json()) as Record<string, unknown>;
    return {
      id: String(data.public_id),
      name: caption,
      url: String(data.secure_url),
      width: Number(data.width) || 500,
      height: Number(data.height) || 500,
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 500),
      date: new Date().toISOString(),
    };
  } catch (error) {
    return rejectWithValue((error as Error).message || "Upload failed");
  }
});

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
