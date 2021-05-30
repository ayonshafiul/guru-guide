import { motion } from "framer-motion";
import pageAnimationVariant from "../../AnimationData";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Redirect, useLocation } from "react-router-dom";

const Help = () => {
  const location = useLocation();
  const { isAuth } = useContext(AuthContext);
  if (!isAuth)
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: { from: location },
        }}
      ></Redirect>
    );
  return (
    <motion.div
      className="help"
      variants={pageAnimationVariant}
      initial="initial"
      animate="animate"
    >
      help
    </motion.div>
  );
};

export default Help;
