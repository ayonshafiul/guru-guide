import { motion } from "framer-motion";
import pageAnimationVariant from "../../AnimationData";
import "./Verify.css";

const Verify = () => {
  return (
    <motion.div
      className="help"
      variants={pageAnimationVariant}
      initial="initial"
      animate="animate"
    >
      Verify
    </motion.div>
  );
};

export default Verify;
