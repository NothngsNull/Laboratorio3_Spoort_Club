import { Link, Outlet } from "react-router-dom"
function AdminLayout() {
 return (
 <div>
 <nav>
 <Link to="/">Inicio</Link> |
 <Link to="/admin/dashboard">Dashboard Admin</Link>
 </nav>
 <main>
 <Outlet />
 </main>
 </div>
 )
}
export default AdminLayout
