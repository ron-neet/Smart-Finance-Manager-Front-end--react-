import { Layers2, Pencil, TrendingUp, TrendingDown } from "lucide-react";

const CategoryList = ({ categories, onEditCategory }) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-xl">
                        <Layers2 className="text-purple-600" size={28} />
                    </div>
                    <div>
                        <h5 className="text-2xl font-bold text-gray-800">Category List</h5>
                        <p className="text-gray-600 text-base mt-1">Manage your income and expense categories</p>
                    </div>
                </div>
                <div className="text-base font-medium text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                    {categories.length} {categories.length === 1 ? 'category' : 'categories'}
                </div>
            </div>

            {categories.length === 0 ? (
                <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-md">
                        <Layers2 className="text-gray-400" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No categories yet</h3>
                    <p className="text-gray-500 text-lg">Add your first category to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="group relative flex items-center gap-4 p-5 rounded-2xl hover:bg-gray-50 transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:shadow-md shadow-sm"
                        >
                            <div className="w-14 h-14 flex items-center justify-center text-xl text-gray-800 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm">
                                {category.icon ? (
                                    <span className="text-2xl">
                                        <img
                                            src={category.icon}
                                            alt={category.name}
                                            className="h-8 w-8"
                                        />
                                    </span>
                                ) : (
                                    <Layers2 className="text-purple-600" size={28} />
                                )}
                            </div>

                            <div className="flex-1 flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-lg text-gray-800 font-bold">
                                        {category.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        {category.type === 'income' ? (
                                            <span className="inline-flex items-center gap-2 text-sm bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1.5 rounded-full font-bold shadow-sm">
                                                <TrendingUp size={14} />
                                                Income
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 text-sm bg-gradient-to-r from-rose-100 to-red-100 text-rose-800 px-3 py-1.5 rounded-full font-bold shadow-sm">
                                                <TrendingDown size={14} />
                                                Expense
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        className="text-gray-400 hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer p-2 rounded-lg hover:bg-purple-50"
                                        onClick={() => onEditCategory(category)}
                                    >
                                        <Pencil size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryList;