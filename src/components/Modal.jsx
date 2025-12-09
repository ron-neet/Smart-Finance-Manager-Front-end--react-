import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full overflow-hidden bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="relative p-4 w-full max-w-3xl max-h-[90vh] animate-slideIn">
                <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100">
                    <div className="flex items-center justify-between p-6 md:p-7 border-b border-gray-100 rounded-t-2xl bg-gradient-to-r from-gray-50 to-gray-100">
                        <h3 className="text-2xl font-bold text-gray-800">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            type="button"
                            className="flex items-center justify-center text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 rounded-xl text-sm w-10 h-10 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-md"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 md:p-7">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;