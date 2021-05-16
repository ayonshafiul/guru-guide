import "./Navbar.css";
import navlinks from "./NavLinksData";
import { NavLink } from "react-router-dom";
import { useIsFetching } from "react-query";
import grid from "./grid.svg";
import menuclose from "../../assets/img/menuclose.png";

const Navbar = (props) => {
  const numFetch = useIsFetching();
  return (
    <nav className="navbar" style={props.navStyle}>
      <div className="nav-list">
        {navlinks.map((item, index) => {
          return (
            <NavLink
              className="nav-list-item"
              to={item.path}
              key={index}
              style={{ textDecoration: "none" }}
              activeClassName="nav-list-item-active"
              onClick={() => {
                props.setNavStyle({ visibility: "hidden" });
              }}
            >
              {item.title}
            </NavLink>
          );
        })}

        {numFetch > 0 ? (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            <img src={grid} style={{ height: "50px" }} />
          </div>
        ) : null}
        <div
          className="menu-btn"
          onClick={() => {
            props.setNavStyle({ visibility: "hidden" });
          }}
        >
          Close
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
