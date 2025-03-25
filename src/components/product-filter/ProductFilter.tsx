"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { fetchParentCategory } from "../../api/parentCategoryApi"
import { fetchProductsBySearch } from "../../api/productApi"
import type { ParentCategory } from "../../types/parentCategory"
import type { ProductDefault } from "../../types/productDefault"
import SidebarFilter from "./SideBarFilter"
import ProductBySearch from "./ProductBySearch"
import { Filter, SlidersHorizontal, X, Loader2 } from "lucide-react"

const ProductFilter = () => {
    const [categories, setCategories] = useState<ParentCategory[]>([])
    const [products, setProducts] = useState<ProductDefault[]>([])
    const [selectedCategories, setSelectedCategories] = useState<number[]>([])
    const [priceRange, setPriceRange] = useState<[number, number]>([10000, 100000])
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [totalPages, setTotalPages] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)
    const [sortOption, setSortOption] = useState<string>("ASC")
    const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0)

    // Fetch categories on mount
    useEffect(() => {
        const getCategories = async () => {
            try {
                const data = await fetchParentCategory()
                setCategories(data)
            } catch (err: any) {
                console.log(err)
            }
        }
        getCategories()
    }, [])

    // Fetch products when filters change
    useEffect(() => {
        const getProducts = async () => {
            setIsLoading(true)
            try {
                const categorySelected = selectedCategories.length > 0 ? selectedCategories.map((id) => `id:${id}`) : []

                const data = await fetchProductsBySearch({
                    sort: sortOption,
                    category: categorySelected,
                    productVariant: [`price>${priceRange[0]}`, `price<${priceRange[1]}`],
                    size: 10,
                    page: currentPage,
                })

                setProducts(data.data.items)
                setTotalPages(data.data.totalPages)
            } catch (err) {
                console.error("Error fetching products", err)
            } finally {
                setIsLoading(false)
            }
        }

        getProducts()
    }, [currentPage, selectedCategories, priceRange, sortOption])

    // Update active filters count
    useEffect(() => {
        let count = 0
        if (selectedCategories.length > 0) count++
        if (priceRange[0] > 10000 || priceRange[1] < 100000) count++
        setActiveFiltersCount(count)
    }, [selectedCategories, priceRange])

    const handleCategoryChange = (categoryId: number) => {
        setSelectedCategories((prevSelected: number[]) =>
            prevSelected.includes(categoryId)
                ? prevSelected.filter((id) => id !== categoryId)
                : [...prevSelected, categoryId],
        )
        // Reset to first page when filters change
        setCurrentPage(0)
    }

    const handlePriceChange = (value: [number, number]) => {
        setPriceRange(value)
        // Reset to first page when filters change
        setCurrentPage(0)
    }

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        // Scroll to top when changing page
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const clearAllFilters = () => {
        setSelectedCategories([])
        setPriceRange([10000, 100000])
    }

    const getCategoryNameById = (id: number): string => {
        for (const parentCategory of categories) {
            for (const category of parentCategory.categories) {
                if (category.id === id) {
                    return category.name
                }
            }
        }
        return ""
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Mobile filter button */}
            <div className="lg:hidden flex items-center justify-between mb-4">
                <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
                >
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                    {activeFiltersCount > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-green-100 text-green-800">
              {activeFiltersCount}
            </span>
                    )}
                </button>

                <div className="flex items-center gap-2">
                    <label htmlFor="mobile-sort" className="text-sm text-gray-500">
                        Sort:
                    </label>
                    <select
                        id="mobile-sort"
                        value={sortOption}
                        onChange={handleSortChange}
                        className="text-sm border-gray-200 rounded-md focus:ring-green-500 focus:border-green-500"
                    >
                        <option value="ASC">Price: Low to High</option>
                        <option value="DESC">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {/* Active filters */}
            {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {selectedCategories.map((id) => (
                        <div
                            key={id}
                            className="inline-flex items-center bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full"
                        >
                            {getCategoryNameById(id)}
                            <button onClick={() => handleCategoryChange(id)} className="ml-1 text-green-500 hover:text-green-700">
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                    {selectedCategories.length > 0 && (
                        <button onClick={clearAllFilters} className="text-sm text-gray-500 hover:text-gray-700 underline">
                            Clear all
                        </button>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sidebar filter - desktop */}
                <div className="hidden lg:block lg:col-span-3">
                    <SidebarFilter
                        categories={categories}
                        selectedCategories={selectedCategories}
                        onCategoryChange={handleCategoryChange}
                        priceRange={priceRange}
                        onPriceChange={handlePriceChange}
                    />
                </div>

                {/* Mobile filter drawer */}
                <div
                    className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
                        showMobileFilters ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                    onClick={() => setShowMobileFilters(false)}
                >
                    <div
                        className={`fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
                            showMobileFilters ? "translate-x-0" : "-translate-x-full"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold">Filters</h2>
                            <button onClick={() => setShowMobileFilters(false)} className="p-2 text-gray-500 hover:text-gray-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto h-full pb-32">
                            <SidebarFilter
                                categories={categories}
                                selectedCategories={selectedCategories}
                                onCategoryChange={handleCategoryChange}
                                priceRange={priceRange}
                                onPriceChange={handlePriceChange}
                            />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product grid */}
                <div className="lg:col-span-9">
                    {/* Desktop sort controls */}
                    <div className="hidden lg:flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Products
                            {isLoading ? (
                                <span className="ml-2 text-sm font-normal text-gray-500">Loading...</span>
                            ) : (
                                <span className="ml-2 text-sm font-normal text-gray-500">
                  Showing {products.length} of {totalPages * 10} products
                </span>
                            )}
                        </h2>
                        <div className="flex items-center gap-2">
                            <label htmlFor="desktop-sort" className="text-sm text-gray-500">
                                Sort by:
                            </label>
                            <select
                                id="desktop-sort"
                                value={sortOption}
                                onChange={handleSortChange}
                                className="border-gray-200 rounded-md focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="ASC">Price: Low to High</option>
                                <option value="DESC">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Loading state */}
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-96">
                            <Loader2 className="h-10 w-10 text-green-500 animate-spin mb-4" />
                            <p className="text-gray-500">Loading products...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg border border-gray-200">
                            <SlidersHorizontal className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-800 mb-2">No products found</h3>
                            <p className="text-gray-500 text-center max-w-md mb-4">
                                Try adjusting your filters or search criteria to find what you're looking for.
                            </p>
                            <button
                                onClick={clearAllFilters}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <ProductBySearch products={products} />

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-8">
                                    <nav className="flex items-center gap-1">
                                        <button
                                            onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                                            disabled={currentPage === 0}
                                            className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>

                                        {[...Array(totalPages)].map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handlePageChange(index)}
                                                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                                                    currentPage === index
                                                        ? "bg-green-600 text-white"
                                                        : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                                                }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                                            disabled={currentPage === totalPages - 1}
                                            className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </nav>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductFilter

