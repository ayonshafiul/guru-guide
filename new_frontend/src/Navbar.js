import './Navbar.css';
import navlinks from "./NavLinksData";
import {NavLink} from 'react-router-dom';
const Navbar = () => {
    return ( 
        <nav className="navbar">
            <h1 className="title">Guruguide</h1>
            <div className="nav-list">
                {navlinks.map((item, index) => {
                    return <NavLink className="nav-list-item" to={item.path} key={index} style={{textDecoration: 'none'}} activeClassName="nav-list-item-active">{item.title}</NavLink>
                })}
            </div>
        </nav>
     );
}
 
export default Navbar;