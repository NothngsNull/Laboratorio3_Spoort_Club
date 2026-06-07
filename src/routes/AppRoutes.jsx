import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import UserDashboard from "../pages/user/UserDashboard"
import CoachDashboard from "../pages/coach/CoachDashboard"
import AdminDashboard from "../pages/admin/AdminDashboard"
import UserLayout from "../layouts/UserLayout"
import CoachLayout from "../layouts/CoachLayout"
import AdminLayout from "../layouts/AdminLayout"
function AppRoutes() {
 return (
 <BrowserRouter>
 <Routes>
 <Route path="/" element={<Home />} />
 <Route path="/login" element={<Login />} />
 <Route path="/user" element={<UserLayout />}>
 <Route path="dashboard" element={<UserDashboard />} />
 </Route>
 <Route path="/coach" element={<CoachLayout />}>
 <Route path="dashboard" element={<CoachDashboard />} />
 </Route>
 <Route path="/admin" element={<AdminLayout />}>
 <Route path="dashboard" element={<AdminDashboard />} />
 </Route>
 </Routes>
 </BrowserRouter>
 )
}
export default AppRoutes