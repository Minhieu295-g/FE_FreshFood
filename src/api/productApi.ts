import axios from "axios";
import {ProductDefault} from "../types/productDefault";
import {Product} from "../types/product";
import {LoaderFunctionArgs} from "react-router-dom";

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

    const response = await axios.get(`http://localhost:80/product/1`);

    if (response.status === 200) {
        console.log(response.data);
        return response.data.data; // Đảm bảo trả về đúng Product
    }

    throw new Error('Không tìm thấy sản phẩm.');
};
