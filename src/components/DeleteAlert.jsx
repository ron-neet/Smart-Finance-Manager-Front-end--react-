import { LoaderCircle } from "lucide-react";
import { useState } from "react";

const DeleteAlert = ({ show, onClose, onDelete, content }) => {

    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await onDelete();
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <p className="text-sm">{content}</p>
            <div className="flex justify-end mt-6">
                <button
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={loading}
                    onClick={handleDelete}
                    type="button"
                >
                    {loading ? (
                        <>
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            Deleting... 
                        </>
                    ) : (
                        "Delete"
                    )}
                </button>

            </div>
        </div>
    )
};

export default DeleteAlert;