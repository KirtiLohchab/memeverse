import React, { useState } from "react";

interface AvatarUploadProps {
  onUpload: (file: File) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      onUpload(selectedFile);
    }
  };

  return (
    <div>
      <label className="block text-lg font-medium text-gray-700">
        Upload Avatar:
      </label>
      <input
        type="file"
        onChange={handleFileChange}
        className="mt-2 block w-full text-sm text-gray-500 file:py-2 file:px-4 file:mr-4 file:rounded-lg file:border file:border-gray-300 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-200"
      />
      {file && (
        <p className="mt-2 text-sm text-gray-600">Selected file: {file.name}</p>
      )}
    </div>
  );
};

export default AvatarUpload;
