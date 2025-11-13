const InfoCard = ({ label, value, icon, color }) => {
    return (
        <div className="flex gap-6 items-center justify-center bg-white shadow-gray-100 border-gray-200/50 p-4 rounded-2xl shadow-md">
            <div className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl mr-4`}>
                <div className={`text-4xl ${color}`}>{icon}</div>
            </div>
            <div>
                <h6 className="text-sm text-gray-500 mb-1">{label}</h6>
                
                <span className="text-[22px]"> &#8377;{value} </span>
                
                
            </div>
        </div>
    );
};

export default InfoCard;