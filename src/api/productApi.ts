import axios from "axios";
import {ProductDefault} from "../types/productDefault";
import {Product, ProductRequestDTO, ProductVariantRequestDTO} from "../types/product";
import {LoaderFunctionArgs} from "react-router-dom";
import {ApiResponse, PaginatedResponse, SearchParams} from "../types/api";
import api from "./api";

export const fetchProductDefault = async (): Promise<ProductDefault[]> => {
    const response = await axios.get(`http://localhost:80/product/list-default`);
    if (response.status === 200) {
        return response.data.data.items;
    }
    throw new Error(response.data.message || "Lỗi không xác định từ API");
}
export const FetchProductById = async ({ params }: LoaderFunctionArgs): Promise<Product> => {
    const { id } = params;

    if (!id) throw new Error('ID sản phẩm không hợp lệ.');

    const response = await axios.get(`http://localhost:80/product/${id}`);

    if (response.status === 200) {
        console.log(response.data);
        return response.data.data; // Đảm bảo trả về đúng Product
    }

    throw new Error('Không tìm thấy sản phẩm.');
};

export const getProducts = async (): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    const response = await axios.get(`http://localhost:80/product/list`);

    if (response.status === 200) {
        console.log(response.data);
        return response.data;
    }

    throw new Error('Không tìm thấy sản phẩm.');
}

export const deleteProduct = async (id: number) => {
    const response = await api.delete(`/product/${id}`);
    if (response.status === 200) {
        console.log(response.data);
        return response.data;
    }
    throw new Error('Không tìm thấy sản phẩm.');
}

export const fetchProductsBySearch = async (
    params: SearchParams
): Promise<ApiResponse<PaginatedResponse<ProductDefault>>> => {

    // Chuyển đổi params thành URLSearchParams để xử lý mảng
    const queryParams = new URLSearchParams();

    // Xử lý mảng product[]
    params.product?.forEach((product) => queryParams.append('product', product));

    // Xử lý mảng category[]
    params.category?.forEach((category) => queryParams.append('category', category));

    // Xử lý mảng productVariant[]
    params.productVariant?.forEach((variant) => queryParams.append('productVariant', variant));

    // Xử lý các tham số đơn lẻ
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.size) queryParams.append('size', params.size.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    console.log("params: " + params.product + params.productVariant + params.category);
    try {
        const response = await axios.get<ApiResponse<PaginatedResponse<ProductDefault>>>(
            `http://localhost:80/product/list-with-search-product?${queryParams.toString()}`
        );

        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const addProductWithVariants = async (
    product: ProductRequestDTO,
    thumbnail: File,
    images: File[],
    productVariants: ProductVariantRequestDTO[],
    variantThumbnails: File[]
) => {
    try {
        if (productVariants.length !== variantThumbnails.length) {
            throw new Error("Số lượng biến thể và ảnh không khớp!");
        }
        console.log("product variant:", productVariants)
        const formData = new FormData();
        formData.append("thumbnail", thumbnail);
        images.forEach((image) => formData.append("images", image));
        formData.append("product", new Blob([JSON.stringify(product)], { type: "application/json" }));
        variantThumbnails.forEach((variant) => formData.append("variants", variant));

        formData.append("product_variants", new Blob([JSON.stringify(productVariants)], { type: "application/json" }));

        const config = { timeout: 60000 };
        const response = await api.post("/product/product-with-variant/", formData, config);
        return response.data;
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
};