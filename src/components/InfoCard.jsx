const InfoCard = ({ label, value, icon, color }) => {
    return (
        <div className="flex gap-6 items-center justify-center bg-white shadow-gray-100 border-gray-200/50 p-5 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className={`w-16 h-16 flex items-center justify-center text-[28px] text-white ${color} rounded-2xl drop-shadow-xl mr-4 transition-transform duration-300 hover:scale-105`}>
                <div className={`text-4xl ${color}`}>{icon}</div>
            </div>
            <div>
                <h6 className="text-sm text-gray-500 mb-1 font-medium">{label}</h6>
                <span className="text-[24px] font-bold text-gray-800"> &#8377;{value} </span>
            </div>
        </div>
    );
};

export default InfoCard;