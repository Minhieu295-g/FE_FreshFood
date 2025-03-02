import React from "react";

const Footer = () => {
    return (
        <div className="w-full h-full dark:bg-gray-900">
            <footer className="w-full h-fit lg:absolute md:bottom-0 bg-cyan-900 text-white">
                <div className="w-full mx-auto sm:px-10 px-4 pb-10">
                    <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 justify-items-start pt-12">
                        {/* Col 1: Get In Touch */}
                        <div className="mt-4">
                            <h1 className="text-4xl font-display mb-8">Get In Touch</h1>
                            <ul className="text-lg text-gray-300 font-semibold flex flex-col gap-3">
                                <li className="flex items-center gap-2">
                                    {/*<ion-icon name="location"></ion-icon>*/}
                                    <p>Sarbet, Addis Ababa, Ethiopia</p>
                                </li>
                                <li className="flex items-center gap-2">
                                    {/*<ion-icon name="call"></ion-icon>*/}
                                    <p>(+251) 913 4***30</p>
                                </li>
                                <li className="flex items-center gap-2 sm:text-lg text-base">
                                    {/*<ion-icon name="mail"></ion-icon>*/}
                                    <p>sammytg66@gmail.com</p>
                                </li>
                            </ul>
                            {/* Socials */}
                            <div className="flex gap-2 items-center text-2xl text-white mt-6">
                                {["logo-facebook", "logo-instagram", "logo-whatsapp", "logo-tiktok"].map((icon, index) => (
                                    <div key={index} className="flex items-center justify-center p-3 border rounded-full">
                                        {/*<ion-icon name={icon}></ion-icon>*/}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Col 2: Quick Links */}
                        <div className="mt-4">
                            <h2 className="text-4xl font-display mb-8">Quick Links</h2>
                            <ul className="mt-4 text-lg font-semibold text-gray-300">
                                {["About Us", "Contact Us", "Our Services", "Privacy Policy", "Terms & Conditions"].map((link, index) => (
                                    <li key={index} className="flex items-center text-xl mt-2">
                                        {/*<ion-icon name="chevron-forward-outline"></ion-icon>*/}
                                        <a href="#" className="ml-2">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Col 3: Photo Gallery */}
                        <div className="mt-4">
                            <h2 className="text-4xl font-display mb-8">Photo Gallery</h2>
                            <div className="w-full grid grid-cols-3 place-items-center gap-4 mt-6">
                                {[...Array(6)].map((_, index) => (
                                    <img
                                        key={index}
                                        className="rounded-sm outline outline-[4px]"
                                        src={`https://images.unsplash.com/photo-1616161560417-66d4db5892ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwyfHxhaSUyMHJlbGF0ZWR8ZW58MHwwfHx8MTczMTUwNzg2NXww&ixlib=rb-4.0.3&q=80&w=1080`}
                                        alt="Gallery Image"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Col 4: Newsletter */}
                        <div className="w-full mt-4 lg:pl-6">
                            <h4 className="text-4xl font-display mb-6">Newsletter</h4>
                            <p className="text-lg text-gray-300 font-semibold mb-7">Sign Up here to get our latest News</p>
                            <div className="w-full flex justify-center items-center bg-white rounded-lg p-2">
                                <input
                                    type="text"
                                    className="w-full px-4 text-gray-800 placeholder:text-gray-400 focus:outline-none"
                                    placeholder="Your email"
                                />
                                <button className="py-3 px-6 bg-orange-500 transition-all duration-500 shadow-md rounded-xl text-sm text-white font-semibold w-fit hover:bg-orange-700">
                                    SignUp
                                </button>
                            </div>
                        </div>
                    </div>

                    <hr className="bg-gray mt-14" />

                    <div className="w-full flex sm:flex-row gap-2 flex-col items-center justify-between py-4">
                        <div>&copy; 2024 Sammy-TG All Rights Reserved</div>
                        <div className="flex items-center justify-center">
                            {["Home", "Cookies", "Help", "FAQs"].map((item, index) => (
                                <a key={index} href="#" className="sm:px-4 px-2 border-r border-gray-500">
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
