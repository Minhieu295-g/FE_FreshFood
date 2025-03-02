import {useEffect, useState} from "react";
import {fetchParentCategory} from "../../api/parentCategoryApi";
import {ParentCategory} from "../../types/parentCategory";
import {ProductDefault} from "../../types/productDefault";
import {fetchProductsBySearch} from "../../api/productApi";
import SidebarFilter from "./SideBarFilter";
import ProductBySearch from "./ProductBySearch";

const ProductFilter = () => {
    const [categories, setCategories] = useState<ParentCategory[]>([]);
    const [products, setProducts] = useState<ProductDefault[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([10000, 100000]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    useEffect(() => {
        const getCategories = async () => {
            try {
                const data = await fetchParentCategory();
                setCategories(data);
            } catch (err: any) {
                console.log(err);
            }
        };
        getCategories();
    }, []);
    useEffect(() => {
        const getProducts = async () => {
            try {
                const categorySelected = selectedCategories.length > 0
                    ? selectedCategories.map((id) => `id:${id}`)
                    : [];
                console.log(categorySelected);
                const data = await fetchProductsBySearch({
                    sort: 'ASC',
                    category: categorySelected,
                    productVariant: [`price>${priceRange[0]}`, `price<${priceRange[1]}`],
                    size: 10,
                });
                console.log()
                setProducts(data.data.items); // products array
                setTotalPages(data.data.totalPages);
            } catch (err) {
                console.error('Error fetching products', err);
            }
        };

        getProducts();
    }, [currentPage,selectedCategories, priceRange]);
    console.log(selectedCategories);
    console.log("price range: " + priceRange);
    console.log(products)
    const handleCategoryChange = (categoryId: number) => {
        setSelectedCategories((prevSelected: number[]) =>
            prevSelected.includes(categoryId)
                ? prevSelected.filter((id) => id !== categoryId)
                : [...prevSelected, categoryId]
        );
    };

    const handlePriceChange = (value: [number, number]) => {
        setPriceRange(value);
    };

    return (
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3">
                    <SidebarFilter
                        categories={categories}
                        selectedCategories={selectedCategories}
                        onCategoryChange={handleCategoryChange}
                        priceRange={priceRange}
                        onPriceChange={handlePriceChange}
                    />
                </div>

                <div className="col-span-9">
                    <ProductBySearch products={products} />
                </div>
            </div>
        </div>
    );
}
export default ProductFilter;