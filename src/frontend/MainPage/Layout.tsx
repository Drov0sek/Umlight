import Header from "./Header.tsx";
import {Outlet} from "react-router";

const Layout = () => {
    return (
        <div>
            <Header/>
            <Outlet/>
        </div>
    );
};

export default Layout;