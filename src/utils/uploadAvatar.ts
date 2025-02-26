export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "YOUR_CLOUDINARY_UPLOAD_PRESET");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUDINARY_NAME/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url; // URL of the uploaded avatar image
  } catch (error) {
    console.error("Failed to upload avatar:", error);
    return null;
  }
};
