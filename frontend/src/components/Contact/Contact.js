import { motion } from "framer-motion";
import pageAnimationVariant from "../../AnimationData";
const Contact = () => {
  return (
    <motion.div
      className="contact"
      variants={pageAnimationVariant}
      initial="initial"
      animate="animate"
    >
      {" "}
      To report bugs or get more info please join the GuruGuide support server{" "}
      <br />
      Discord server invitation{" "}
      <a href="https://discord.gg/FXt6YRFKAy">link:</a>
    </motion.div>
  );
};

export default Contact;
