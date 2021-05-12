import {motion} from 'framer-motion';
import pageAnimationVariant from '../../AnimationData';

const Help = () => {
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
}
 
export default Help;