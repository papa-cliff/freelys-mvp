import React from "react";
import { 
    // Redirect, 
    // BrowserRouter, 
    Route, 
    Routes, 
    Navigate,
    Outlet
} from "react-router-dom";

//pages
import LoginPage      from './components/login'
import SourcesPage    from './components/sources'
import SourceEditPage from './components/sourceedit'
import NotFoundPage   from './components/notfound'
import HomePage       from "./components/homepage"
 
import AuthService from './services/auth.serivce'

function ProtectedRoute(){
    AuthService.verify();
    let user = AuthService.getCurrentUser();
    if (!user) {
        return <Navigate to="/login" />
    }
    return <Outlet />
}

function Logout(){
    AuthService.logout()
    return(<p />)
}

function AppRouter() {
   return (
    <Routes>
        <Route path="/login" element={<LoginPage />}/>
        <Route element={<ProtectedRoute/>}>
            <Route path="/" element={<HomePage />}/>
            <Route path="/sources" element={<SourcesPage />} />
            <Route path="/sources/add" element={<SourceEditPage action="new"/>} />
            <Route path="/sources/edit/:id" element={<SourceEditPage action="edit"/>} />
            <Route path="/sources/delete/:id" element={<SourcesPage action="delete"/>} />
            <Route path="/logout" element={<Logout />}/>
        </Route>
        <Route path="/*" element={<NotFoundPage />}/>
    </Routes>
   );
}
 
export default AppRouter