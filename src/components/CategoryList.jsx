import { Layers2, Pencil, TrendingUp, TrendingDown } from "lucide-react";

const CategoryList = ({ categories, onEditCategory }) => {
    return (
        <div className="bg-white rounded-2xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h5 className="text-xl font-bold text-gray-800">Category List</h5>
                    <p className="text-gray-600 text-sm mt-1">Manage your income and expense categories</p>
                </div>
                <div className="text-sm text-gray-500">
                    {categories.length} {categories.length === 1 ? 'category' : 'categories'}
                </div>
            </div>

            {categories.length === 0 ? (
                <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Layers2 className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No categories yet</h3>
                    <p className="text-gray-500">Add your first category to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="group relative flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:border-gray-200 hover:shadow-sm"
                        >
                            <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 rounded-lg bg-gray-100">
                                {category.icon ? (
                                    <span className="text-2xl">
                                        <img
                                            src={category.icon}
                                            alt={category.name}
                                            className="h-8 w-8"
                                        />
                                    </span>
                                ) : (
                                    <Layers2 className="text-purple-600" size={24} />
                                )}
                            </div>

                            <div className="flex-1 flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-base text-gray-800 font-medium">
                                        {category.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        {category.type === 'income' ? (
                                            <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                <TrendingUp size={12} />
                                                Income
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs bg-rose-100 text-rose-800 px-2 py-1 rounded-full">
                                                <TrendingDown size={12} />
                                                Expense
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        className="text-gray-400 hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer p-2 rounded-lg hover:bg-purple-50"
                                        onClick={() => onEditCategory(category)}
                                    >
                                        <Pencil size={18} />
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