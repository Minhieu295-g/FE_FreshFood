import axios from "axios";
import { ParentCategory} from "../types/parentCategory";

export const fetchParentCategory = async (): Promise<ParentCategory[]> => {
    const response = await axios.get(`http://localhost:80/parent-category/list`);
    if (response.data.status === 200) {
        return response.data.data.items;
    }
    throw new Error(response.data.message || "Lỗi không xác định từ API");
}