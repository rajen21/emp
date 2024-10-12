import React, { useState } from 'react';

interface ProfilePhotoProps {
  imageUrl?: string;
  onChange?: (file: File) => void;
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ imageUrl, onChange }) => {
  const [preview, setPreview] = useState<string | null>(imageUrl || null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      if (onChange) {
        onChange(file);
      }
    }
  };

  return (
    <div className="flex flex-col items-center mx-5 my-5 sticky top-8">
      <div className="relative w-24 h-24">
        <img
          src={preview || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="w-full h-full object-cover rounded-full border-2 border-gray-300"
        />
        <label
          htmlFor="file-upload"
          className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};

export default ProfilePhoto;
