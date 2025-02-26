import { CLOUDINARY_CONFIG } from "@/configs/cloudinary";
import axios from "axios";
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

    const data = await response.json();

    return data.secure_url || null;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};

export const fetchMemes = async () => {
  try {
    const response = await axios.get("https://api.imgflip.com/get_memes");
    if (response.data.success) {
      return response.data.data.memes.map((meme: any) => ({
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
