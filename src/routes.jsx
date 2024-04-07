import {
    ADMIN_ROUTE,
    HOME_ROUTE,
    USER_ROUTE,
    LOGIN_ROUTE,
    REGISTRATION_ROUTE
} from "./utils/const.jsx";
import Home from "./pages/Home.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import User from "./pages/User.jsx"
import Registration from "./pages/Register.jsx";

export const publicRoutes = [
    {
        path: HOME_ROUTE,
        Component: Home
    },
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: USER_ROUTE + '/:id',
        Component: User
    },
    {
        path: LOGIN_ROUTE,
        Component: Login
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Registration
    }

]