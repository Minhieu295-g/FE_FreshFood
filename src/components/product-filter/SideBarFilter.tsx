"use client"

import type React from "react"
import { useState } from "react"
import { Transition } from "@headlessui/react"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"
import type { ParentCategory } from "../../types/parentCategory"
import { ChevronDown, ChevronUp, Search, X } from "lucide-react"

interface SidebarFilterProps {
    categories: ParentCategory[]
    selectedCategories: number[]
    onCategoryChange: (categoryId: number) => void
    priceRange: [number, number]
    onPriceChange: (value: [number, number]) => void
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({
                                                         categories,
                                                         selectedCategories,
                                                         onCategoryChange,
                                                         priceRange,
                                                         onPriceChange,
                                                     }) => {
    const [openDropdown, setOpenDropdown] = useState<number | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>("")

    const toggleDropdown = (id: number) => {
        setOpenDropdown(openDropdown === id ? null : id)
    }

    const filteredCategories = categories
        .map((parentCategory) => ({
            ...parentCategory,
            categories: parentCategory.categories.filter((category) =>
                category.name.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        }))
        .filter((parentCategory) => parentCategory.categories.length > 0)

    const handleClearSearch = () => {
        setSearchTerm("")
    }

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
            </div>

            <div className="p-4">
                {/* Search categories */}
                <div className="relative mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        {searchTerm && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Categories */}
                <div className="space-y-1">
                    <h4 className="font-medium text-gray-700 mb-2">Categories</h4>

                    {filteredCategories.length === 0 ? (
                        <p className="text-sm text-gray-500 py-2">No categories match your search</p>
                    ) : (
                        filteredCategories.map((parentCategory) => (
                            <div key={parentCategory.id} className="mb-2">
                                <button
                                    onClick={() => toggleDropdown(parentCategory.id)}
                                    className="flex justify-between items-center w-full py-2 px-3 text-left text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <span>{parentCategory.name}</span>
                                    {openDropdown === parentCategory.id ? (
                                        <ChevronUp className="h-4 w-4 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 text-gray-500" />
                                    )}
                                </button>

                                <Transition
                                    show={openDropdown === parentCategory.id}
                                    enter="transition duration-100 ease-out"
                                    enterFrom="transform scale-95 opacity-0"
                                    enterTo="transform scale-100 opacity-100"
                                    leave="transition duration-75 ease-out"
                                    leaveFrom="transform scale-100 opacity-100"
                                    leaveTo="transform scale-95 opacity-0"
                                >
                                    <div className="mt-1 ml-2 space-y-1 pl-4 border-l-2 border-gray-100">
                                        {parentCategory.categories.map((category) => (
                                            <label
                                                key={category.id}
                                                className="flex items-center py-1 px-2 rounded-md hover:bg-gray-50 cursor-pointer group"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                                                    checked={selectedCategories.includes(category.id)}
                                                    onChange={() => onCategoryChange(category.id)}
                                                />
                                                <span
                                                    className={`ml-2 text-sm ${
                                                        selectedCategories.includes(category.id) ? "font-medium text-green-700" : "text-gray-700"
                                                    }`}
                                                >
                          {category.name}
                        </span>
                                            </label>
                                        ))}
                                    </div>
                                </Transition>
                            </div>
                        ))
                    )}
                </div>

                {/* Price Range */}
                <div className="mt-6">
                    <h4 className="font-medium text-gray-700 mb-4">Price Range</h4>
                    <div className="px-2">
                        <Slider
                            range
                            min={10000}
                            max={100000}
                            step={5000}
                            value={priceRange}
                            onChange={(value) => onPriceChange(value as [number, number])}
                            trackStyle={[{ backgroundColor: "#16a34a", height: 6 }]}
                            handleStyle={[
                                {
                                    borderColor: "#16a34a",
                                    height: 16,
                                    width: 16,
                                    marginTop: -5,
                                    backgroundColor: "#ffffff",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                },
                                {
                                    borderColor: "#16a34a",
                                    height: 16,
                                    width: 16,
                                    marginTop: -5,
                                    backgroundColor: "#ffffff",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                },
                            ]}
                            railStyle={{ backgroundColor: "#e5e7eb", height: 6 }}
                        />

                        <div className="flex justify-between text-sm mt-4">
                            <div className="px-3 py-1 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                                {formatPrice(priceRange[0])}
                            </div>
                            <div className="px-3 py-1 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                                {formatPrice(priceRange[1])}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Popular filters */}
                <div className="mt-6">
                    <h4 className="font-medium text-gray-700 mb-2">Popular Filters</h4>
                    <div className="space-y-2">
                        <label className="flex items-center py-1 cursor-pointer group">
                            <input type="checkbox" className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500" />
                            <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">On Sale</span>
                        </label>
                        <label className="flex items-center py-1 cursor-pointer group">
                            <input type="checkbox" className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500" />
                            <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">In Stock</span>
                        </label>
                        <label className="flex items-center py-1 cursor-pointer group">
                            <input type="checkbox" className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500" />
                            <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">Free Shipping</span>
                        </label>
                    </div>
                </div>

                {/* Reset filters button */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <button
                        onClick={() => {
                            onPriceChange([10000, 100000])
                            // Clear selected categories by calling onCategoryChange for each selected category
                            selectedCategories.forEach((id) => onCategoryChange(id))
                        }}
                        className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Reset All Filters
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SidebarFilter

