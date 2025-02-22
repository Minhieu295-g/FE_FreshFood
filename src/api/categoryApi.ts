import axios from "axios";
import { Category} from "../types/category";

export const fetchCategories = async (): Promise<Category[]> => {
    const response = await axios.get("/categories");
    if (response.data.status === 200) {
        return response.data.data.items; // ✅ Trả về Category[]
    }
    throw new Error(response.data.message || "Lỗi không xác định từ API");
};