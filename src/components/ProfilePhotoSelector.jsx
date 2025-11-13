import { Trash, Upload, User } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Revoke object URL on cleanup to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = (e) => {
    e.preventDefault();
    inputRef.current?.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />

      {!image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative">
          <User className="text-purple-500" size={35} />
          <button
            type="button"
            onClick={onChooseFile}
            className="w-8 h-8 flex items-center justify-center bg-purple-600 rounded-full -bottom-1 -right-1 absolute text-white hover:bg-purple-700 transition"
          >
            <Upload size={16} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Profile Preview"
            className="w-20 h-20 object-cover rounded-full border border-gray-300"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="w-6 h-6 flex items-center justify-center bg-red-600 rounded-full -top-1 -right-1 absolute text-white hover:bg-red-700 transition"
          >
            <Trash size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
