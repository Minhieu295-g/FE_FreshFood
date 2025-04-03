"use client"

import { Eye, Edit } from "lucide-react"
import { Card, CardContent, CardFooter } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Checkbox } from "../../../components/ui/checkbox"
import { Badge } from "../../../components/ui/badge"
import type { Product } from "../../../types/product"
import { formatCurrency } from "../../../ultils/product-utils"

interface ProductGridViewProps {
    products: Product[]
    selectedProducts: number[]
    onSelectProduct: (productId: number, checked: boolean) => void
    onViewProduct: (product: Product) => void
    onEditProduct: (product: Product) => void
}

export const ProductGridView = ({
                                    products,
                                    selectedProducts,
                                    onSelectProduct,
                                    onViewProduct,
                                    onEditProduct,
                                }: ProductGridViewProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                        <div className="aspect-square bg-gray-100">
                            <img
                                src={product.thumbnailUrl || "/placeholder.svg"}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="absolute top-3 left-3">
                            <Checkbox
                                checked={selectedProducts.includes(product.id)}
                                onCheckedChange={(checked) => onSelectProduct(product.id, !!checked)}
                                className="bg-white/90 backdrop-blur-sm"
                            />
                        </div>
                        {product.productVariants[0].discountPercentage > 0 && (
                            <div className="absolute top-3 right-3">
                                <Badge className="bg-red-500 text-white border-red-500">
                                    -{product.productVariants[0].discountPercentage}%
                                </Badge>
                            </div>
                        )}
                    </div>
                    <CardContent className="p-4">
                        <Badge variant="outline" className="mb-2">
                            {product.category.name}
                        </Badge>
                        <h3 className="font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1 h-10">{product.description}</p>
                        <div className="mt-2 flex items-center justify-between">
                            <div>
                                <div className="font-bold text-gray-900">{formatCurrency(product.productVariants[0].price)}</div>
                                <div className="text-xs text-gray-500">{product.productVariants.length} biến thể</div>
                            </div>
                            <Badge variant={product.productVariants[0].status === "AVAILABLE" ? "success" : "secondary"}>
                                {product.productVariants[0].status === "AVAILABLE" ? "Đang bán" : "Ngừng bán"}
                            </Badge>
                        </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                        <Button variant="outline" size="sm" className="w-[48%]" onClick={() => onViewProduct(product)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Chi tiết
                        </Button>
                        <Button variant="outline" size="sm" className="w-[48%]" onClick={() => onEditProduct(product)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Sửa
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

