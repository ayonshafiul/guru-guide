import './Navbar.css';
import navlinks from "./NavLinksData";
import {NavLink} from 'react-router-dom';
import {useIsFetching} from 'react-query';
import grid from './grid.svg';
const Navbar = () => {
    const numFetch = useIsFetching();
    return ( 
        <nav className="navbar">
            <h1 className="title">Guruguide</h1>
            <div className="nav-list">
                {navlinks.map((item, index) => {
                    return <NavLink className="nav-list-item" to={item.path} key={index} style={{textDecoration: 'none'}} activeClassName="nav-list-item-active">{item.title}</NavLink>
                })}

                {
                   numFetch > 0 ? <div style={{
                        width: "100%",
                        textAlign: "center",
                        marginTop: "20px"
                    }}><img src={grid} style={{height:"50px"}}/></div> : null
                }
            </div>
        </nav>
     );
}
 
export default Navbar;