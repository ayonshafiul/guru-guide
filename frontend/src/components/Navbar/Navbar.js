import "./Navbar.css";
import navlinks from "./NavLinksData";
import { NavLink } from "react-router-dom";
import { useIsFetching } from "react-query";
import grid from "./grid.svg";
import infinity from "../../assets/img/infinity.svg";
import logo from "../../assets/img/logo.png";
import { motion } from "framer-motion";
import { slideAnimation } from "../../AnimationData";
const Navbar = (props) => {
  const numFetch = useIsFetching();
  return (
    <motion.div
      variants={slideAnimation}
      animate={props.navStyle ? "show" : "hide"}
    >
      <nav className="navbar">
        <div className="nav-list">
          <h1 className="nav-title">GURUGUIDE</h1>
          <div className="nav-spinning">
            <img className="nav-spinning-img" src={logo} />
          </div>
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
        </div>
      </nav>
    </motion.div>
  );
};

export default Navbar;
