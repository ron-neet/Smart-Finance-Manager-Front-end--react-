import EmojiPicker from "emoji-picker-react";
import { Image, X } from "lucide-react";
import { useState } from "react"

const EmojiPickerPopup = ({ icon, onSelect }) => {

    const [isOpen, setIsOpen] = useState(false);

    const handleEmojiClick = (emoji) => {
        onSelect(emoji?.imageUrl || "")
        setIsOpen(false);
    }

    return (
        <div className="flex flex-col items-start gap-3 mb-6">
            <label className="text-sm font-bold text-gray-800">Category Icon</label>
            <div
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-4 cursor-pointer group">
                <div className="w-20 h-20 flex items-center justify-center text-3xl bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 rounded-2xl border-2 border-dashed border-purple-300 group-hover:border-purple-400 transition-all duration-300 shadow-md hover:shadow-lg">
                    {icon ? (
                        <img src={icon} alt="Icon" className="w-14 h-14" />
                    ) : (
                        <Image className="text-purple-500" size={32} />
                    )}
                </div>
                <p className="text-gray-700 group-hover:text-purple-700 transition-colors font-medium"> 
                    {icon ? "Change icon" : "Pick an icon"} 
                </p>
            </div>
            {isOpen && (
                <div className="relative mt-4">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full absolute -top-4 -right-4 z-10 cursor-pointer shadow-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-110">
                        <X className="text-gray-600" size={20} />
                    </button>
                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                        <EmojiPicker
                            open={isOpen}
                            onEmojiClick={handleEmojiClick}
                            theme="light"
                            skinTonesDisabled={true}
                            searchDisabled={false}
                            height={400}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default EmojiPickerPopup