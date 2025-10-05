import { Routes, Route, BrowserRouter } from "react-router"
import LoginView from "./views/LoginView"
import RegisterView from "./views/RegisterView"
import AuthLayout from "./layouts/AuthLayout"
import AppLayout from "./layouts/AppLayout"
import LinkTreeView from "./views/LinkTreeView"
import ProfileView from "./views/ProfileView"
import HandleView from "./views/HandleView"
import NotFoundView from "./views/NotFoundView"
import HomeView from "./views/HomeView"

export default function Router(){

    return (
        <BrowserRouter>
            <Routes>
                {/* Auth */}
                <Route element={<AuthLayout/>}>
                    <Route path="/auth/login" element={<LoginView/>} />
                    <Route path="/auth/register" element={<RegisterView/>} />
                </Route>

                {/* App */}
                <Route path="/admin" element={<AppLayout/>}>
                    <Route index={true} element={<LinkTreeView/>} />  {/* Esta ruta toma el path del padre */}
                    <Route path="profile" element={<ProfileView/>} /> {/* Anidamos profile y queda /admin/profile*/}
                </Route>

                {/* Compartir enlace */}
                <Route path="/:handle" element={<AuthLayout/>}>
                    <Route index={true} element={<HandleView/>} />
                </Route>

                {/* Home */}
                <Route path="/" element={<HomeView/>} />
                
                <Route path="/404" element={<AuthLayout />}>
                    <Route index={true} element={<NotFoundView/>} />
                </Route>

            </Routes>
        </BrowserRouter>
    )
}