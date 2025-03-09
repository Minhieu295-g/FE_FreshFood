import React, { ReactNode } from 'react';
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

type LayoutProps = {
    children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <Header />
            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;
