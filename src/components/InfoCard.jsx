const InfoCard = ({ label, value, icon, color }) => {
    return (
        <div className="flex gap-6 items-center justify-center bg-white/90 backdrop-blur-xl border-purple-100 p-7 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-400 transform hover:-translate-y-2 hover:scale-[1.02]">
            <div className={`w-20 h-20 flex items-center justify-center text-[32px] text-white ${color} rounded-2xl drop-shadow-xl mr-4 transition-transform duration-400 hover:scale-110 shadow-xl`}>
                <div className={`text-4xl ${color}`}>{icon}</div>
            </div>
            <div>
                <h6 className="text-base text-gray-500 mb-2 font-bold">{label}</h6>
                <span className="text-[28px] font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"> &#8377;{value} </span>
            </div>
        </div>
    );
};

export default InfoCard;