"use client"

import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { Card, CardContent } from "../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Button } from "../../../components/ui/button"
import { Checkbox } from "../../../components/ui/checkbox"
import { Badge } from "../../../components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import type { Product } from "../../../types/product"
import { formatCurrency } from "../../../ultils/product-utils"

interface ProductTableViewProps {
    products: Product[]
    selectedProducts: number[]
    onSelectAll: (checked: boolean) => void
    onSelectProduct: (productId: number, checked: boolean) => void
    onViewProduct: (product: Product) => void
    onEditProduct: (product: Product) => void
    onDeleteProduct: (productIds: number[]) => void
}

export const ProductTableView = ({
                                     products,
                                     selectedProducts,
                                     onSelectAll,
                                     onSelectProduct,
                                     onViewProduct,
                                     onEditProduct,
                                     onDeleteProduct,
                                 }: ProductTableViewProps) => {
    return (
        <Card>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={products.length > 0 && selectedProducts.length === products.length}
                                        onCheckedChange={onSelectAll}
                                    />
                                </TableHead>
                                <TableHead className="w-[80px]">Ảnh</TableHead>
                                <TableHead>Tên sản phẩm</TableHead>
                                <TableHead>Danh mục</TableHead>
                                <TableHead>Biến thể</TableHead>
                                <TableHead className="text-right">Giá bán</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedProducts.includes(product.id)}
                                            onCheckedChange={(checked) => onSelectProduct(product.id, !!checked)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                                            <img
                                                src={product.thumbnailUrl || "/placeholder.svg"}
                                                alt={product.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{product.name}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-[200px]">{product.description}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{product.category.name}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {product.productVariants.slice(0, 2).map((variant) => (
                                                <div key={variant.id} className="text-sm">
                                                    {variant.name}
                                                </div>
                                            ))}
                                            {product.productVariants.length > 2 && (
                                                <div className="text-xs text-gray-500">+{product.productVariants.length - 2} biến thể khác</div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="font-medium">{formatCurrency(product.productVariants[0].price)}</div>
                                        {product.productVariants[0].discountPercentage > 0 && (
                                            <div className="text-xs text-green-600">
                                                Giảm {product.productVariants[0].discountPercentage}%
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={product.productVariants[0].status === "AVAILABLE" ? "success" : "secondary"}>
                                            {product.productVariants[0].status === "AVAILABLE" ? "Đang bán" : "Ngừng bán"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onViewProduct(product)}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Xem chi tiết
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onEditProduct(product)}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Chỉnh sửa
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600" onClick={() => onDeleteProduct([product.id])}>
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Xóa sản phẩm
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

