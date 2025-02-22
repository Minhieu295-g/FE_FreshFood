import React, {useState, useEffect} from "react";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './parentCategory.css'
import Slider, { Settings } from 'react-slick';
import {fetchParentCategory} from "../../api/parentCategoryApi";
import {ParentCategory} from "../../types/parentCategory";

const ParentCategoryComponent = () => {
    const [categories, setCategories] = useState<ParentCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const getCategories = async () => {
            try {
                const data = await fetchParentCategory();
                setCategories(data);
            } catch (err: any) {
                setError(err.message || 'Có lỗi xảy ra');
            } finally {
                setLoading(false);
            }
        };
        getCategories();
    }, []);

    const settings = {
        dots: true, // Hiển thị các chấm trượt
        infinite: true, // Cho phép trượt vô hạn
        speed: 500,
        slidesToShow: 5, // Số lượng item hiển thị
        slidesToScroll: 1, // Số lượng item di chuyển khi lướt
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold my-4">Featured Categories</h2>
            <Slider {...settings}>
                {categories.map((category, index) => (
                    <div key={index} className="p-3">
                        <div className="h-40 w-50 bg-white rounded-lg shadow-md flex flex-col justify-center items-center text-center">
                            <img
                                src={category.imageUrl}
                                alt={category.name}
                                className="h-24 w-24 object-contain mb-2"
                            />
                            <h5 className="text-lg font-medium">{category.name}</h5>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );

}
export default ParentCategoryComponent;