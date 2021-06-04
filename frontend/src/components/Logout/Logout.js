import { motion } from "framer-motion";
import pageAnimationVariant from "../../AnimationData";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Redirect } from "react-router-dom";
import { getLogOut } from "../../Queries";

const Logout = () => {
  const { setIsAuth } = useContext(AuthContext);
  const [redirect, setRedirect] = useState(false);
  useEffect(async () => {
    const data = await getLogOut();
    if (data.success) {
      setIsAuth(false);
      setRedirect(true);
    }
  }, []);

  return (
    <motion.div
      className="Logout"
      variants={pageAnimationVariant}
      initial="initial"
      animate="animate"
    >
      Loggging you out..
      {redirect ? <Redirect to="/faculty"></Redirect> : null}
    </motion.div>
  );
};

export default Logout;
