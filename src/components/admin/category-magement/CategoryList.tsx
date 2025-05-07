"use client"

import { useState } from "react"
import { Edit, Trash2, Plus } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import type { Category, ParentCategory } from "../../../types/category"
import { CategoryForm } from "./CategoryForm"
import { DeleteConfirmation } from "./DeleteConfirmation"

interface CategoryListProps {
    parentCategory: ParentCategory
    onAddCategory: (parentId: number, name: string) => Promise<void>
    onUpdateCategory: (parentId: number, categoryId: number, name: string) => Promise<void>
    onDeleteCategory: (parentId: number, categoryId: number) => Promise<void>
}

export const CategoryList = ({
                                 parentCategory,
                                 onAddCategory,
                                 onUpdateCategory,
                                 onDeleteCategory,
                             }: CategoryListProps) => {
    const [showAddForm, setShowAddForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleAddCategory = async (name: string) => {
        await onAddCategory(parentCategory.id, name)
    }

    const handleUpdateCategory = async (name: string) => {
        if (selectedCategory) {
            await onUpdateCategory(parentCategory.id, selectedCategory.id, name)
        }
    }

    const handleDeleteCategory = async () => {
        if (selectedCategory) {
            setIsDeleting(true)
            await onDeleteCategory(parentCategory.id, selectedCategory.id)
            setIsDeleting(false)
        }
    }

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">Categories</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setShowAddForm(true)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Category
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {parentCategory.categories.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">No categories found. Add your first category.</div>
                ) : (
                    <div className="space-y-2">
                        {parentCategory.categories.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                <span className="font-medium">{category.name}</span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedCategory(category)
                                            setShowEditForm(true)
                                        }}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => {
                                            setSelectedCategory(category)
                                            setShowDeleteConfirm(true)
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            {/* Add Category Form */}
            <CategoryForm
                open={showAddForm}
                onOpenChange={setShowAddForm}
                onSubmit={handleAddCategory}
                title="Add Category"
                description={`Add a new category to ${parentCategory.name}`}
            />

            {/* Edit Category Form */}
            <CategoryForm
                open={showEditForm}
                onOpenChange={setShowEditForm}
                initialData={selectedCategory}
                onSubmit={handleUpdateCategory}
                title="Edit Category"
                description="Update category details"
            />

            {/* Delete Confirmation */}
            <DeleteConfirmation
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
                onConfirm={handleDeleteCategory}
                title="Delete Category"
                description="Are you sure you want to delete this category? This action cannot be undone."
                isDeleting={isDeleting}
            />
        </Card>
    )
}

