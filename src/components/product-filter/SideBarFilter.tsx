import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import {ParentCategory} from "../../types/parentCategory";


interface SidebarFilterProps {
    categories: ParentCategory[];
    selectedCategories: number[];
    onCategoryChange: (categoryId: number) => void;
    priceRange: [number, number];
    onPriceChange: (value: [number, number]) => void;}

const SidebarFilter: React.FC<SidebarFilterProps> = ({
                                                         categories,
                                                         selectedCategories,
                                                         onCategoryChange,
                                                         priceRange,
                                                         onPriceChange,
                                                     }) => {
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);

    const toggleDropdown = (id: number) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    return (
        <div className="w-full p-4 bg-white rounded-2xl shadow-lg">
            {/* Categories */}
            <h3 className="text-xl font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
                {categories.map((parentCategory) => (
                    <div key={parentCategory.id} className="border-b pb-2">
                        <div
                            onClick={() => toggleDropdown(parentCategory.id)}
                            className="flex justify-between items-center cursor-pointer font-medium text-gray-800 hover:text-blue-600"
                        >
                            {parentCategory.name}
                            <span className="text-lg">
                {openDropdown === parentCategory.id ? '▲' : '▼'}
              </span>
                        </div>

                        <Transition
                            show={openDropdown === parentCategory.id}
                            enter="transition duration-200 ease-out"
                            enterFrom="opacity-0 -translate-y-2"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition duration-150 ease-in"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 -translate-y-2"
                        >
                            <div className="mt-2 ml-4 space-y-1">
                                {parentCategory.categories.map((category) => (
                                    <label key={category.id} className="flex items-center space-x-2 text-gray-700">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            checked={selectedCategories.includes(category.id)}
                                            onChange={() => onCategoryChange(category.id)}
                                        />
                                        <span>{category.name}</span>
                                    </label>
                                ))}
                            </div>
                        </Transition>
                    </div>
                ))}
            </div>

            {/* Price Slider */}
            <h3 className="text-xl font-semibold mt-6 mb-4">Price</h3>
            <div className="px-2">
                <Slider
                    range
                    min={10000}
                    max={100000}
                    step={10000}
                    value={priceRange}
                    onChange={(value) => onPriceChange(value as [number, number])} // Ép kiểu
                    trackStyle={[{ backgroundColor: '#3B82F6', height: 8 }]}
                    handleStyle={[
                        { borderColor: '#3B82F6', height: 20, width: 20, marginTop: -6 },
                        { borderColor: '#3B82F6', height: 20, width: 20, marginTop: -6 },
                    ]}
                    railStyle={{ backgroundColor: '#E5E7EB', height: 8 }}
                />

                <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>{priceRange[0].toLocaleString()}đ</span>
                    <span>{priceRange[1].toLocaleString()}đ</span>
                </div>
            </div>
        </div>
    );
};

export default SidebarFilter;
