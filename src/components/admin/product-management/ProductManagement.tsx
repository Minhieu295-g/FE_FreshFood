"use client"

import { useState, useEffect } from "react"
import { Filter, Plus, Trash2, ChevronDown, RefreshCw, Package, Layers, ShoppingBag } from "lucide-react"
import { Card, CardContent } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import type {Product, ProductRequestDTO, ProductVariant, ToastState} from "../../../types/product"
import { ProductFilters } from "./ProductFilters"
import { ProductTableView } from "./ProductTableView"
import { ProductGridView } from "./ProductGridView"
import { ProductPagination } from "./ProductPagination"
import {ProductChanges, ProductDetail} from "./ProductDetail"
import { AddProduct } from "./AddProduct"
import { VariantForm } from "./VariantForm"
import { DeleteConfirmation } from "./DeleteConfirmation"
import { Toast } from "./Toast"
import {deleteProduct, getProducts} from "../../../api/productApi";
import {Category} from "../../../types/category";
import {fetchCategories} from "../../../api/categoryApi";
import {sampleCategories, sampleProducts} from "../../../ultils/product-utils";

const ProductManagement = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [categoryFilter, setCategoryFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [sortBy, setSortBy] = useState<string>("name-asc")
    const [viewMode, setViewMode] = useState<"table" | "grid">("table")
    const [selectedProducts, setSelectedProducts] = useState<number[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [showFilters, setShowFilters] = useState(false)

    // Product detail and edit states
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [isEditMode, setIsEditMode] = useState(false)
    const [showProductDetail, setShowProductDetail] = useState(false)
    const [showAddProduct, setShowAddProduct] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [productsToDelete, setProductsToDelete] = useState<number[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productData = await getProducts();
                const categoriesData = await fetchCategories();
                setCategories(categoriesData);
                setProducts(productData.data.items)
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, []);

    // New product form state
    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        name: "",
        description: "",
        thumbnailUrl: "/placeholder.svg?height=200&width=200",
        category: categories[0],
        productImages: [],
        productVariants: [],
    })

    // Variant management states
    const [showVariantModal, setShowVariantModal] = useState(false)
    const [currentVariant, setCurrentVariant] = useState<Partial<ProductVariant>>({
        name: "",
        price: 0,
        discountPercentage: 0,
        thumbnailUrl: "/placeholder.svg?height=200&width=200",
        unit: "",
        expiredDate: new Date().toISOString().split("T")[0],
        status: "active",
    })
    const [variantEditIndex, setVariantEditIndex] = useState<number | null>(null)

    // Toast notification state
    const [toast, setToast] = useState<ToastState>({
        show: false,
        message: "",
        type: "info",
    })

    // Simulate data loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    // Filter and sort products
    useEffect(() => {
        let result = [...products]

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (product) => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
            )
        }

        // Filter by category
        if (categoryFilter !== "all") {
            result = result.filter((product) => product.category.id === Number.parseInt(categoryFilter))
        }

        // Filter by status (using the first variant's status as product status)
        if (statusFilter !== "all") {
            result = result.filter((product) => product.productVariants.some((variant) => variant.status === statusFilter))
        }

        // Sort products
        result.sort((a, b) => {
            switch (sortBy) {
                case "name-asc":
                    return a.name.localeCompare(b.name)
                case "name-desc":
                    return b.name.localeCompare(a.name)
                case "price-asc":
                    return a.productVariants[0].price - b.productVariants[0].price
                case "price-desc":
                    return b.productVariants[0].price - a.productVariants[0].price
                default:
                    return 0
            }
        })

        setFilteredProducts(result)
    }, [products, searchQuery, categoryFilter, statusFilter, sortBy])

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    // Handle items per page change
    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value)
        setCurrentPage(1)
    }

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)

    // Handle select all products
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedProducts(currentItems.map((product) => product.id))
        } else {
            setSelectedProducts([])
        }
    }

    // Handle select single product
    const handleSelectProduct = (productId: number, checked: boolean) => {
        if (checked) {
            setSelectedProducts([...selectedProducts, productId])
        } else {
            setSelectedProducts(selectedProducts.filter((id) => id !== productId))
        }
    }

    // Handle view product details
    const handleViewProduct = (product: Product) => {
        setSelectedProduct(product)
        setIsEditMode(false)
        setShowProductDetail(true)
    }

    // Handle edit product
    const handleEditProduct = (product: Product) => {
        setSelectedProduct({ ...product })
        setIsEditMode(true)
        setShowProductDetail(true)
    }

    // Handle delete product confirmation
    const handleDeleteConfirm = (productIds: number[]) => {
        setProductsToDelete(productIds)
        setShowDeleteConfirm(true)
    }

    // Handle delete product
    const handleDeleteProduct = async () => {
        setProducts(products.filter((product) => !productsToDelete.includes(product.id)))
        setSelectedProducts(selectedProducts.filter((id) => !productsToDelete.includes(id)))
        setShowDeleteConfirm(false)

        try {
            for (const id of productsToDelete) {
                await deleteProduct(id);
            }
        } catch (e) {
            console.error("Xóa sản phẩm thất bại:", e);
        }

        // Show success toast
        setToast({
            show: true,
            message:
                productsToDelete.length > 1
                    ? `Đã xóa ${productsToDelete.length} sản phẩm thành công`
                    : "Đã xóa sản phẩm thành công",
            type: "success",
        })

        // Hide toast after 3 seconds
        setTimeout(() => {
            setToast({ ...toast, show: false })
        }, 3000)
    }

    // Handle add new product
    const handleAddProduct = () => {
        // Validate required fields
        if (
            !newProduct.name ||
            !newProduct.description ||
            !newProduct.category ||
            newProduct.productVariants?.length === 0
        ) {
            setToast({
                show: true,
                message: "Vui lòng điền đầy đủ thông tin sản phẩm và thêm ít nhất một biến thể",
                type: "error",
            })

            setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 3000)

            return
        }

        // Create new product with ID
        const newProductWithId: Product = {
            ...(newProduct as Product),
            id: Math.max(...products.map((p) => p.id)) + 1,
        }

        // Add new product to list
        setProducts([...products, newProductWithId])

        // Reset form and close modal
        setNewProduct({
            name: "",
            description: "",
            thumbnailUrl: "/placeholder.svg?height=200&width=200",
            category: categories[0],
            productImages: [],
            productVariants: [],
        })
        setShowAddProduct(false)

        // Show success toast
        setToast({
            show: true,
            message: "Đã thêm sản phẩm mới thành công",
            type: "success",
        })

        // Hide toast after 3 seconds
        setTimeout(() => {
            setToast({ ...toast, show: false })
        }, 3000)
    }

    // Handle update product
    const handleUpdateProduct = (changes: ProductChanges) => {
        console.log("Product changes:", changes)

        // Here you would normally make your API call with the changes
        // For now, we'll just update the UI

        // Update product in list
        setProducts(
            products.map((product) => (product.id === changes.modifiedProduct.id ? changes.modifiedProduct : product)),
        )

        // Close modal
        setShowProductDetail(false)
        setIsEditMode(false)

        // Show success toast
        setToast({
            show: true,
            message: "Đã cập nhật sản phẩm thành công",
            type: "success",
        })

        // Hide toast after 3 seconds
        setTimeout(() => {
            setToast({ ...toast, show: false })
        }, 3000)
    }

    // Handle add variant
    const handleAddVariant = () => {
        setCurrentVariant({
            name: "",
            price: 0,
            discountPercentage: 0,
            thumbnailUrl: "/placeholder.svg?height=200&width=200",
            unit: "",
            expiredDate: new Date().toISOString().split("T")[0],
            status: "active",
        })
        setVariantEditIndex(null)
        setShowVariantModal(true)
    }

    // Handle save variant
    const handleSaveVariant = () => {
        // Validate required fields
        if (!currentVariant.name || !currentVariant.price || !currentVariant.unit || !currentVariant.expiredDate) {
            setToast({
                show: true,
                message: "Vui lòng điền đầy đủ thông tin biến thể",
                type: "error",
            })

            setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 3000)

            return
        }

        if (isEditMode && selectedProduct) {
            // If editing an existing variant
            if (variantEditIndex !== null) {
                const updatedVariants = [...selectedProduct.productVariants]
                updatedVariants[variantEditIndex] = {
                    ...(currentVariant as ProductVariant),
                    id: selectedProduct.productVariants[variantEditIndex].id,
                }

                setSelectedProduct({
                    ...selectedProduct,
                    productVariants: updatedVariants,
                })
            } else {
                // Add new variant to existing product
                const newVariant: ProductVariant = {
                    ...(currentVariant as ProductVariant),
                    id: Math.max(0, ...selectedProduct.productVariants.map((v) => v.id)) + 1,
                }

                setSelectedProduct({
                    ...selectedProduct,
                    productVariants: [...selectedProduct.productVariants, newVariant],
                })
            }
        } else {
            // Add new variant to new product
            const newVariant: ProductVariant = {
                ...(currentVariant as ProductVariant),
                id: Math.max(0, ...(newProduct.productVariants?.map((v) => v.id) || [0])) + 1,
            }

            setNewProduct({
                ...newProduct,
                productVariants: [...(newProduct.productVariants || []), newVariant],
            })
        }

        // Reset form and close modal
        setShowVariantModal(false)
    }

    // Handle edit variant
    const handleEditVariant = (variant: ProductVariant, index: number) => {
        setCurrentVariant({ ...variant })
        setVariantEditIndex(index)
        setShowVariantModal(true)
    }

    // Handle delete variant
    const handleDeleteVariant = (index: number) => {
        if (isEditMode && selectedProduct) {
            // Remove variant from existing product
            const updatedVariants = [...selectedProduct.productVariants]
            updatedVariants.splice(index, 1)

            setSelectedProduct({
                ...selectedProduct,
                productVariants: updatedVariants,
            })
        } else {
            // Remove variant from new product
            const updatedVariants = [...(newProduct.productVariants || [])]
            updatedVariants.splice(index, 1)

            setNewProduct({
                ...newProduct,
                productVariants: updatedVariants,
            })
        }
    }

    // Reset filters
    const resetFilters = () => {
        setSearchQuery("")
        setCategoryFilter("all")
        setStatusFilter("all")
        setSortBy("name-asc")
        setShowFilters(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Page title and actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h2>
                    <p className="text-gray-600 mt-1">Quản lý danh sách sản phẩm và biến thể sản phẩm</p>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1.5"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="h-4 w-4" />
                        Bộ lọc
                        <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                    </Button>

                    <Button
                        size="sm"
                        className="flex items-center gap-1.5"
                        onClick={() => {
                            setShowAddProduct(true)
                            setNewProduct({
                                name: "",
                                description: "",
                                thumbnailUrl: "/placeholder.svg?height=200&width=200",
                                category: categories[0],
                                productImages: [],
                                productVariants: [],
                            })
                        }}
                    >
                        <Plus className="h-4 w-4" />
                        Thêm sản phẩm
                    </Button>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <ProductFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    resetFilters={resetFilters}
                    categories={categories}
                />
            )}

            {/* View mode toggle and bulk actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                    <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "table" | "grid")}>
                        <TabsList>
                            <TabsTrigger value="table">
                                <Layers className="h-4 w-4 mr-1" />
                                Dạng bảng
                            </TabsTrigger>
                            <TabsTrigger value="grid">
                                <ShoppingBag className="h-4 w-4 mr-1" />
                                Dạng lưới
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {selectedProducts.length > 0 && (
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Đã chọn {selectedProducts.length} sản phẩm</span>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteConfirm(selectedProducts)}
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Xóa đã chọn
                        </Button>
                    </div>
                )}
            </div>

            {/* Products list */}
            {isLoading ? (
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center justify-center py-12">
                            <RefreshCw className="h-10 w-10 text-green-500 animate-spin mb-4" />
                            <p className="text-gray-600">Đang tải danh sách sản phẩm...</p>
                        </div>
                    </CardContent>
                </Card>
            ) : filteredProducts.length === 0 ? (
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center justify-center py-12">
                            <Package className="h-16 w-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm nào</h3>
                            <p className="text-gray-600 text-center max-w-md mb-6">
                                {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
                                    ? "Không tìm thấy sản phẩm phù hợp với bộ lọc của bạn."
                                    : "Chưa có sản phẩm nào trong hệ thống. Hãy thêm sản phẩm mới."}
                            </p>
                            {(searchQuery || categoryFilter !== "all" || statusFilter !== "all") && (
                                <Button variant="outline" onClick={resetFilters}>
                                    Xóa bộ lọc
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Tabs value={viewMode} className="mb-6">
                    <TabsContent value="table" className="mt-0">
                        <ProductTableView
                            products={currentItems}
                            selectedProducts={selectedProducts}
                            onSelectAll={handleSelectAll}
                            onSelectProduct={handleSelectProduct}
                            onViewProduct={handleViewProduct}
                            onEditProduct={handleEditProduct}
                            onDeleteProduct={handleDeleteConfirm}
                        />
                    </TabsContent>

                    <TabsContent value="grid" className="mt-0">
                        <ProductGridView
                            products={currentItems}
                            selectedProducts={selectedProducts}
                            onSelectProduct={handleSelectProduct}
                            onViewProduct={handleViewProduct}
                            onEditProduct={handleEditProduct}
                        />
                    </TabsContent>
                </Tabs>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
                <ProductPagination
                    totalItems={filteredProducts.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            )}

            {/* Product detail/edit dialog */}
            <ProductDetail
                open={showProductDetail}
                onOpenChange={setShowProductDetail}
                selectedProduct={selectedProduct}
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
                setSelectedProduct={setSelectedProduct}
                categories={categories}
                onUpdate={handleUpdateProduct}
                onAddVariant={handleAddVariant}
                onEditVariant={handleEditVariant}
                onDeleteVariant={handleDeleteVariant}
            />

            {/* Add product dialog */}
            <AddProduct
                open={showAddProduct}
                onOpenChange={setShowAddProduct}
                newProduct={newProduct}
                setNewProduct={setNewProduct}
                categories={categories}
                onSave={handleAddProduct}
                onAddVariant={handleAddVariant}
                onEditVariant={handleEditVariant}
                onDeleteVariant={handleDeleteVariant}
            />

            {/* Variant modal */}
            <VariantForm
                open={showVariantModal}
                onOpenChange={setShowVariantModal}
                currentVariant={currentVariant}
                setCurrentVariant={setCurrentVariant}
                variantEditIndex={variantEditIndex}
                onSave={handleSaveVariant}
            />

            {/* Delete confirmation dialog */}
            <DeleteConfirmation
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
                productsToDelete={productsToDelete}
                products={products}
                onConfirm={handleDeleteProduct}
            />

            {/* Toast notification */}
            <Toast toast={toast} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    )
}

export default ProductManagement

