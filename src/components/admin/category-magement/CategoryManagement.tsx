"use client"

import { useState, useEffect } from "react"
import { Plus, RefreshCw, FolderTree, Edit, Trash2 } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent } from "../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import type { ParentCategory, ToastState } from "../../../types/category"
import { ParentCategoryCard } from "./ParentCategoryCard"
import { CategoryList } from "./CategoryList"
import { ParentCategoryForm } from "./ParentCategoryForm"
import { DeleteConfirmation } from "./DeleteConfirmation"
import { Toast } from "./Toast"
import {
    fetchParentCategories,
    createParentCategory,
    updateParentCategory,
    deleteParentCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../../../api/categoryApi"

export const CategoryManagement = () => {
    const [parentCategories, setParentCategories] = useState<ParentCategory[]>([])
    const [selectedParentCategory, setSelectedParentCategory] = useState<ParentCategory | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showAddParentForm, setShowAddParentForm] = useState(false)
    const [showEditParentForm, setShowEditParentForm] = useState(false)
    const [showDeleteParentConfirm, setShowDeleteParentConfirm] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [activeTab, setActiveTab] = useState<string>("parent-categories")

    const [toast, setToast] = useState<ToastState>({
        show: false,
        message: "",
        type: "info",
    })

    // Load parent categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchParentCategories()
                setParentCategories(data)
                if (data.length > 0 && !selectedParentCategory) {
                    setSelectedParentCategory(data[0])
                }
            } catch (error) {
                console.error("Error loading categories:", error)
                showToast("Failed to load categories", "error")
            } finally {
                setIsLoading(false)
            }
        }

        loadCategories()
    }, [])

    // Helper function to show toast
    const showToast = (message: string, type: ToastState["type"]) => {
        setToast({
            show: true,
            message,
            type,
        })
        setTimeout(() => setToast({ ...toast, show: false }), 3000)
    }

    // Handle adding a parent category
    const handleAddParentCategory = async (data: FormData) => {
        try {
            const newCategory = await createParentCategory(data)
            setParentCategories([...parentCategories, newCategory])
            showToast("Parent category added successfully", "success")
            window.location.reload()
        } catch (error) {
            console.error("Error adding parent category:", error)
            showToast("Failed to add parent category", "error")
        }
    }

    // Handle editing a parent category
    const handleEditParentCategory = async (data: FormData) => {
        if (!selectedParentCategory) return

        try {
            const updatedCategory = await updateParentCategory(selectedParentCategory.id, data)
            setParentCategories(parentCategories.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat)))
            setSelectedParentCategory(updatedCategory)
            showToast("Parent category updated successfully", "success")
            window.location.reload()
        } catch (error) {
            console.error("Error updating parent category:", error)
            showToast("Failed to update parent category", "error")
        }
    }

    // Handle deleting a parent category
    const handleDeleteParentCategory = async () => {
        if (!selectedParentCategory) return

        setIsDeleting(true)
        try {
            await deleteParentCategory(selectedParentCategory.id)
            setParentCategories(parentCategories.filter((cat) => cat.id !== selectedParentCategory.id))
            setSelectedParentCategory(
                parentCategories.length > 1
                    ? parentCategories.find((cat) => cat.id !== selectedParentCategory.id) || null
                    : null,
            )
            showToast("Parent category deleted successfully", "success")
        } catch (error) {
            console.error("Error deleting parent category:", error)
            showToast("Failed to delete parent category", "error")
        } finally {
            setIsDeleting(false)
        }
    }

    // Handle adding a category
    const handleAddCategory = async (parentId: number, name: string) => {
        try {
            const newCategory = await createCategory(parentId, name)

            // Update the parent categories list
            setParentCategories(
                parentCategories.map((parent) => {
                    if (parent.id === parentId) {
                        return {
                            ...parent,
                            categories: [...parent.categories, newCategory],
                        }
                    }
                    return parent
                }),
            )

            // Update selected parent category if it's the one being modified
            if (selectedParentCategory && selectedParentCategory.id === parentId) {
                setSelectedParentCategory({
                    ...selectedParentCategory,
                    categories: [...selectedParentCategory.categories, newCategory],
                })
            }

            showToast("Category added successfully", "success")
        } catch (error) {
            console.error("Error adding category:", error)
            showToast("Failed to add category", "error")
        }
    }

    // Handle updating a category
    const handleUpdateCategory = async (parentId: number, categoryId: number, name: string) => {
        try {
            const updatedCategory = await updateCategory(parentId, categoryId, name)

            // Update the parent categories list
            setParentCategories(
                parentCategories.map((parent) => {
                    if (parent.id === parentId) {
                        return {
                            ...parent,
                            categories: parent.categories.map((cat) => (cat.id === categoryId ? updatedCategory : cat)),
                        }
                    }
                    return parent
                }),
            )

            // Update selected parent category if it's the one being modified
            if (selectedParentCategory && selectedParentCategory.id === parentId) {
                setSelectedParentCategory({
                    ...selectedParentCategory,
                    categories: selectedParentCategory.categories.map((cat) => (cat.id === categoryId ? updatedCategory : cat)),
                })
            }

            showToast("Category updated successfully", "success")
        } catch (error) {
            console.error("Error updating category:", error)
            showToast("Failed to update category", "error")
        }
    }

    // Handle deleting a category
    const handleDeleteCategory = async (parentId: number, categoryId: number) => {
        try {
            await deleteCategory(parentId, categoryId)

            // Update the parent categories list
            setParentCategories(
                parentCategories.map((parent) => {
                    if (parent.id === parentId) {
                        return {
                            ...parent,
                            categories: parent.categories.filter((cat) => cat.id !== categoryId),
                        }
                    }
                    return parent
                }),
            )

            // Update selected parent category if it's the one being modified
            if (selectedParentCategory && selectedParentCategory.id === parentId) {
                setSelectedParentCategory({
                    ...selectedParentCategory,
                    categories: selectedParentCategory.categories.filter((cat) => cat.id !== categoryId),
                })
            }

            showToast("Category deleted successfully", "success")
        } catch (error) {
            console.error("Error deleting category:", error)
            showToast("Failed to delete category", "error")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Page title and actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
                    <p className="text-gray-600 mt-1">Manage product categories and subcategories</p>
                </div>

                <div className="mt-4 md:mt-0">
                    <Button onClick={() => setShowAddParentForm(true)} className="flex items-center gap-1.5">
                        <Plus className="h-4 w-4" />
                        Add Parent Category
                    </Button>
                </div>
            </div>

            {/* Main content */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                    <TabsTrigger value="parent-categories">Parent Categories</TabsTrigger>
                    {selectedParentCategory && <TabsTrigger value="categories">Categories</TabsTrigger>}
                </TabsList>

                <TabsContent value="parent-categories">
                    {isLoading ? (
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center justify-center py-12">
                                    <RefreshCw className="h-10 w-10 text-primary animate-spin mb-4" />
                                    <p className="text-gray-600">Loading categories...</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : parentCategories.length === 0 ? (
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center justify-center py-12">
                                    <FolderTree className="h-16 w-16 text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No parent categories found</h3>
                                    <p className="text-gray-600 text-center max-w-md mb-6">
                                        You haven't created any parent categories yet. Create your first parent category to get started.
                                    </p>
                                    <Button onClick={() => setShowAddParentForm(true)}>
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Parent Category
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {parentCategories.map((category) => (
                                <ParentCategoryCard
                                    key={category.id}
                                    category={category}
                                    onEdit={(cat) => {
                                        setSelectedParentCategory(cat)
                                        setShowEditParentForm(true)
                                    }}
                                    onDelete={(cat) => {
                                        setSelectedParentCategory(cat)
                                        setShowDeleteParentConfirm(true)
                                    }}
                                    onSelect={(cat) => {
                                        setSelectedParentCategory(cat)
                                        setActiveTab("categories")
                                    }}
                                    isSelected={selectedParentCategory?.id === category.id}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="categories">
                    {selectedParentCategory && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1">
                                <Card className="shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                                                <img
                                                    src={selectedParentCategory.imageUrl || "/placeholder.svg?height=80&width=80"}
                                                    alt={selectedParentCategory.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-lg">{selectedParentCategory.name}</h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {selectedParentCategory.categories.length} categories
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => setShowEditParentForm(true)}
                                            >
                                                <Edit className="h-4 w-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => setShowDeleteParentConfirm(true)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="md:col-span-2">
                                <CategoryList
                                    parentCategory={selectedParentCategory}
                                    onAddCategory={handleAddCategory}
                                    onUpdateCategory={handleUpdateCategory}
                                    onDeleteCategory={handleDeleteCategory}
                                />
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Add Parent Category Form */}
            <ParentCategoryForm
                open={showAddParentForm}
                onOpenChange={setShowAddParentForm}
                onSubmit={handleAddParentCategory}
                title="Add Parent Category"
                description="Create a new parent category for your products"
            />

            {/* Edit Parent Category Form */}
            <ParentCategoryForm
                open={showEditParentForm}
                onOpenChange={setShowEditParentForm}
                initialData={selectedParentCategory}
                onSubmit={handleEditParentCategory}
                title="Edit Parent Category"
                description="Update parent category details"
            />

            {/* Delete Parent Category Confirmation */}
            <DeleteConfirmation
                open={showDeleteParentConfirm}
                onOpenChange={setShowDeleteParentConfirm}
                onConfirm={handleDeleteParentCategory}
                title="Delete Parent Category"
                description={`Are you sure you want to delete "${selectedParentCategory?.name}"? This will also delete all categories within it. This action cannot be undone.`}
                isDeleting={isDeleting}
            />

            {/* Toast notification */}
            <Toast toast={toast} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    )
}

