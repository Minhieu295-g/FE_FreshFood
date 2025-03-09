import ParentCategory from "../components/parent-category/ParentCategory";
import PopularProduct from "../components/product/PopularProduct";
import Carousel from "../components/carousel/Carousel";
import React from "react";

const Home = () => {
    return (
        <>
            <Carousel/>
            <ParentCategory/>
            <PopularProduct/>
        </>


    )
}
export default Home;