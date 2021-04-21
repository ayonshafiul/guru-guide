import {motion} from 'framer-motion';
import pageAnimationVariant from './AnimationData';

const Contribute = () => {
    return ( 
        <motion.div 
            className="contribute"
            variants={pageAnimationVariant}
            initial="initial"
            animate="animate"
        >
            contribute
        </motion.div>
     );
}
 
export default Contribute;