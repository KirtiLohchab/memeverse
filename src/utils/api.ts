import { CLOUDINARY_CONFIG } from "@/configs/cloudinary";
import axios from "axios";

interface Meme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  likes: number;
  comments: number;
  date: string;
}

/**
 * Uploads a file to Cloudinary and returns the secure URL.
 * @param file The file to upload.
 * @returns The secure URL of the uploaded file or null if the upload fails.
 */
export const uploadToCloudinary = async (
  file: File
): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);

  try {
    const response = await fetch(CLOUDINARY_CONFIG.apiBase, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Cloudinary upload failed");
    }

    const data: { secure_url?: string } = await response.json();
    return data.secure_url || null;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};

/**
 * Fetches a list of memes from the Imgflip API.
 * @returns An array of Meme objects or an empty array if the fetch fails.
 */
export const fetchMemes = async (): Promise<Meme[]> => {
  try {
    const response = await axios.get("https://api.imgflip.com/get_memes");

    if (response.data.success) {
      return response.data.data.memes.map((meme: Meme) => ({
        ...meme,
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 500),
        date: new Date(
          Date.now() - Math.floor(Math.random() * 10000000000)
        ).toISOString(),
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching memes:", error);
    return [];
  }
};
