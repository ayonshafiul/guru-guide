import "./Navbar.css";
import navlinks from "./NavLinksData";
import { NavLink } from "react-router-dom";
import { useIsFetching } from "react-query";
import grid from "./grid.svg";
import { motion } from "framer-motion";
import { slideAnimation } from "../../AnimationData";
const Navbar = (props) => {
  const numFetch = useIsFetching();
  return (
    <motion.div variants={slideAnimation} animate={props.navStyle ? "show" : "hide"}>
      <nav className="navbar">
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
                  props.setNavStyle(false);
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
            className="menu-close-btn"
            onClick={() => {
              console.log("Setting to true");
              props.setNavStyle(false);
            }}
          >
            Close
          </div>
        </div>
      </nav>
    </motion.div>
  );
};

export default Navbar;
