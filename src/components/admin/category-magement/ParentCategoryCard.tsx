"use client"

import { Edit, Trash2, ChevronRight } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import type { ParentCategory } from "../../../types/category"

interface ParentCategoryCardProps {
    category: ParentCategory
    onEdit: (category: ParentCategory) => void
    onDelete: (category: ParentCategory) => void
    onSelect: (category: ParentCategory) => void
    isSelected: boolean
}

export const ParentCategoryCard = ({ category, onEdit, onDelete, onSelect, isSelected }: ParentCategoryCardProps) => {
    return (
        <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-primary ring-offset-2" : ""
            }`}
            onClick={() => onSelect(category)}
        >
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                            src={category.imageUrl || "/placeholder.svg?height=64&width=64"}
                            alt={category.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-lg truncate">{category.name}</h3>
                        <div className="flex items-center mt-1">
                            <Badge variant="outline" className="mr-2">
                                {category.categories.length} categories
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation()
                                onEdit(category)
                            }}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete(category)
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

