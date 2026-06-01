import { Link, Outlet } from "react-router-dom"
function CoachLayout() {
 return (
 <div>
 <nav>
 <Link to="/">Inicio</Link> |
 <Link to="/coach/dashboard">Dashboard Coach</Link>
 </nav>
 <main>
 <Outlet />
 </main>
 </div>
 )
}
export default CoachLayout