import {motion} from 'framer-motion';
import pageAnimationVariant from '../../AnimationData';

const Contact = () => {
    return (  
        <motion.div 
            className="contact"
            variants={pageAnimationVariant}
            initial="initial"
            animate="animate"
        >
            contact
        </motion.div>
    );
}
 
export default Contact;