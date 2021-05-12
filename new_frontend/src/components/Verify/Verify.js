import {motion} from 'framer-motion';
import pageAnimationVariant from '../../AnimationData';

const Verify = () => {
    return ( 
        <motion.div 
            className="verify"
            variants={pageAnimationVariant}
            initial="initial"
            animate="animate"
        >
            verify
        </motion.div>
     );
}
 
export default Verify;