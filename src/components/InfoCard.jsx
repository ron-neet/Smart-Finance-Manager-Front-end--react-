const InfoCard = ({ label, value, icon, color }) => {
    return (
        <div className="flex gap-6 items-center justify-center bg-white shadow-gray-100 border-gray-200/50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className={`w-18 h-18 flex items-center justify-center text-[32px] text-white ${color} rounded-2xl drop-shadow-xl mr-4 transition-transform duration-300 hover:scale-105 shadow-lg`}>
                <div className={`text-4xl ${color}`}>{icon}</div>
            </div>
            <div>
                <h6 className="text-sm text-gray-500 mb-1 font-bold">{label}</h6>
                <span className="text-[26px] font-bold text-gray-800"> &#8377;{value} </span>
            </div>
        </div>
    );
};

export default InfoCard;