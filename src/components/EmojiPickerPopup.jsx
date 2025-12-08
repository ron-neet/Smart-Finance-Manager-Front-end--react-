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
            <label className="text-sm font-medium text-gray-700">Category Icon</label>
            <div
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-4 cursor-pointer group">
                <div className="w-16 h-16 flex items-center justify-center text-2xl bg-gradient-to-br from-purple-50 to-indigo-50 text-purple-600 rounded-xl border-2 border-dashed border-purple-200 group-hover:border-purple-300 transition-colors">
                    {icon ? (
                        <img src={icon} alt="Icon" className="w-12 h-12" />
                    ) : (
                        <Image className="text-purple-400" />
                    )}
                </div>
                <p className="text-gray-600 group-hover:text-purple-600 transition-colors"> 
                    {icon ? "Change icon" : "Pick an icon"} 
                </p>
            </div>
            {isOpen && (
                <div className="relative mt-2">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full absolute -top-3 -right-3 z-10 cursor-pointer shadow-lg hover:bg-gray-50 transition-colors">
                        <X className="text-gray-500" size={16} />
                    </button>
                    <div className="rounded-xl overflow-hidden shadow-2xl">
                        <EmojiPicker
                            open={isOpen}
                            onEmojiClick={handleEmojiClick}
                            theme="light"
                            skinTonesDisabled={true}
                            searchDisabled={false}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default EmojiPickerPopup