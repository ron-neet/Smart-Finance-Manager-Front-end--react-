import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full overflow-hidden bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-slate-900/40 backdrop-blur-sm animate-fadeIn">
            <div className="relative p-6 w-full max-w-3xl max-h-[90vh] animate-slideIn">
                <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-100">
                    <div className="flex items-center justify-between p-6 md:p-8 border-b border-purple-100 rounded-t-3xl bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50">
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            type="button"
                            className="flex items-center justify-center text-gray-600 hover:text-gray-800 bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 rounded-2xl text-sm w-11 h-11 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6 md:p-8 max-h-[calc(90vh-120px)] overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;