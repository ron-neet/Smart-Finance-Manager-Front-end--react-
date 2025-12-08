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
        <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl relative border-2 border-dashed border-purple-300 hover:border-purple-400 transition-colors">
          <User className="text-purple-500" size={40} />
          <button
            type="button"
            onClick={onChooseFile}
            className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full -bottom-2 -right-2 absolute text-white hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg"
          >
            <Upload size={18} />
          </button>
        </div>
      ) : (
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-purple-200 shadow-lg">
            <img
              src={previewUrl}
              alt="Profile Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            className="w-8 h-8 flex items-center justify-center bg-red-500 rounded-full -top-2 -right-2 absolute text-white hover:bg-red-600 transition-all shadow-lg opacity-0 group-hover:opacity-100"
          >
            <Trash size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;