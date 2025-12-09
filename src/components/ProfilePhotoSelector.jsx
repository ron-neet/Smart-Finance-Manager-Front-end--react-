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
    <div className="flex justify-center mb-8">
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />

      {!image ? (
        <div className="w-32 h-32 flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl relative border-2 border-dashed border-purple-300 hover:border-purple-400 transition-all duration-300 shadow-lg hover:shadow-xl">
          <User className="text-purple-500" size={48} />
          <button
            type="button"
            onClick={onChooseFile}
            className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full -bottom-3 -right-3 absolute text-white hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-110"
          >
            <Upload size={20} />
          </button>
        </div>
      ) : (
        <div className="relative group">
          <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <img
              src={previewUrl}
              alt="Profile Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            className="w-10 h-10 flex items-center justify-center bg-red-500 rounded-full -top-3 -right-3 absolute text-white hover:bg-red-600 transition-all duration-300 shadow-xl hover:shadow-2xl opacity-0 group-hover:opacity-100 transform hover:scale-110"
          >
            <Trash size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;