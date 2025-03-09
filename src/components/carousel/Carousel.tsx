import React, {useState} from "react";
const images = [
    "https://cdnv2.tgdd.vn/bhx-static/bhx/7910/freecompress-pc-1800x480_202502211415390162.jpg",
    "https://cdnv2.tgdd.vn/bhx-static/bhx/7910/hero-banner_202503011144028261.jpg",
    "https://cdnv2.tgdd.vn/bhx-static/bhx/7910/freecompress-pc-1800x480_202502111325349586.jpg",
];

const Carousel = () => {

    const [currentIndex, setCurrentIndex] = useState(0);

    const scrollCarousel = (direction: number) => {
        const totalSlides = images.length;
        setCurrentIndex((prevIndex) => (prevIndex + direction + totalSlides) % totalSlides);
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center mt-10">
            <div className="relative w-full max-w-6xl mx-auto">
                {/* Carousel wrapper */}
                <div className="overflow-hidden relative rounded-lg">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {images.map((src, index) => (
                            <div key={index} className="min-w-full">
                                <img src={src} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation buttons */}
                <button
                    className="absolute top-1/2 left-0 transform -translate-y-1/2 p-3 bg-gray-700 bg-opacity-50 rounded-full text-white hover:bg-opacity-75 focus:outline-none"
                    onClick={() => scrollCarousel(-1)}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    className="absolute top-1/2 right-0 transform -translate-y-1/2 p-3 bg-gray-700 bg-opacity-50 rounded-full text-white hover:bg-opacity-75 focus:outline-none"
                    onClick={() => scrollCarousel(1)}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
export default Carousel;