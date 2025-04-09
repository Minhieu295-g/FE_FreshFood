import api from "./api";
import {Category, CategoryRequest, ParentCategory} from "../types/category";
import {fetchParentCategory} from "./parentCategoryApi";
import {config} from "date-fns/docs/config";

export const fetchCategories = async (): Promise<Category[]> => {
    const response = await api.get("/category/list");
    if (response.data.status === 200) {
        return response.data.data.items; // ✅ Trả về Category[]
    }
    throw new Error(response.data.message || "Lỗi không xác định từ API");
};


// Mock data for development
const mockParentCategories: ParentCategory[] = [
    {
        id: 1,
        name: "Fruits & Vegetables",
        imageUrl: "/placeholder.svg?height=200&width=200",
        categories: [
            { id: 1, name: "Fresh Fruits" },
            { id: 2, name: "Fresh Vegetables" },
            { id: 3, name: "Herbs & Seasonings" },
        ],
    },
    {
        id: 2,
        name: "Dairy & Eggs",
        imageUrl: "/placeholder.svg?height=200&width=200",
        categories: [
            { id: 4, name: "Milk" },
            { id: 5, name: "Cheese" },
            { id: 6, name: "Eggs" },
            { id: 7, name: "Yogurt" },
        ],
    },
    {
        id: 3,
        name: "Meat & Seafood",
        imageUrl: "/placeholder.svg?height=200&width=200",
        categories: [
            { id: 8, name: "Chicken" },
            { id: 9, name: "Beef" },
            { id: 10, name: "Pork" },
            { id: 11, name: "Fish" },
            { id: 12, name: "Shrimp" },
        ],
    },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Get all parent categories
export const fetchParentCategories = async (): Promise<ParentCategory[]> => {
    await delay(800)
    const data =  fetchParentCategory()
    return data;
}

// Get a single parent category by ID
export const fetchParentCategoryById = async (id: number): Promise<ParentCategory | null> => {
    await delay(500)
    const category = mockParentCategories.find((c) => c.id === id)
    return category ? { ...category } : null
}

// Create a new parent category
export const createParentCategory = async (data: FormData): Promise<ParentCategory> => {
    await delay(1000)
    const name = data.get("name") as string
    const file = data.get("image") as File
    console.log("name", name)
    console.log("file", file)

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    const config = { timeout: 60000 };

    const response = await api.post("/parent-category/", formData, config);

    const newCategory: ParentCategory = {
        id: response.data.id,
        name,
        imageUrl: "/placeholder.svg?height=200&width=200",
        categories: [],
    }
    return newCategory
}

// Update a parent category
export const updateParentCategory = async (id: number, data: FormData): Promise<ParentCategory> => {
    await delay(1000)
    const name = data.get("name") as string
    const file = data.get("image") as File
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    const config = { timeout: 60000 };

    const response = await api.put(`/parent-category/${id}`, formData, config);
    mockParentCategories[1] = {
        ...mockParentCategories[1],
        name,
    }

    return { ...mockParentCategories[1] }
}

// Delete a parent category
export const deleteParentCategory = async (id: number): Promise<void> => {
    await delay(800)
    const response = await api.delete(`/parent-category/${id}`);

}

// Create a new category within a parent category
export const createCategory = async (parentId: number, name: string): Promise<Category> => {
    await delay(800)
    const parentIndex = mockParentCategories.findIndex((c) => c.id === parentId)
    if (parentIndex === -1) throw new Error("Parent category not found")

    const allCategories = mockParentCategories.flatMap((pc) => pc.categories)
    const newId = Math.max(0, ...allCategories.map((c) => c.id)) + 1

    const newCategory: Category = {
        id: newId,
        name,
    }
    const categoryRequest: CategoryRequest = {
        parentCategoryId: parentId,
        name,
    }
    console.log("Category: ",categoryRequest)
    const response = await api.post(`/category/`, categoryRequest, {
        headers: {
            'Content-Type': 'application/json',
        }
    });

    mockParentCategories[parentIndex].categories.push(newCategory)
    return newCategory
}

// Update a category
export const updateCategory = async (parentId: number, categoryId: number, name: string): Promise<Category> => {
    await delay(800)

    const categoryRequest: CategoryRequest = {
        parentCategoryId: parentId,
        name,
    }
    console.log("Category: ",categoryRequest)
    const response = await api.put(`/category/${categoryId}`, categoryRequest, {
        headers: {
            'Content-Type': 'application/json',
        }
    });

    mockParentCategories[1].categories[1].name = name

    return { ...mockParentCategories[1].categories[1] }
}

// Delete a category
export const deleteCategory = async (parentId: number, categoryId: number): Promise<void> => {
    await delay(800)
    console.log("Category: ",categoryId)
    try {
        const response = await api.delete(`/category/${categoryId}`);

    } catch (e){
        console.error('Failed to delete Category:', e);
    }
}

