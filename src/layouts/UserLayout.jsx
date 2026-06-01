import { Link, Outlet } from "react-router-dom"
function UserLayout() {
 return (
 <div>
 <nav>
 <Link to="/">Inicio</Link> |
 <Link to="/user/dashboard">Dashboard Usuario</Link>
 </nav>
 <main>
 <Outlet />
 </main>
 </div>
 )
}
export default UserLayout
