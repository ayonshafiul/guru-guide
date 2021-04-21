import {motion} from 'framer-motion';
import pageAnimationVariant from './AnimationData';

const Home = () => {
    return ( 
        <motion.div 
            className="home"
            variants={pageAnimationVariant}
            initial="initial"
            animate="animate"
        >
            Home
        </motion.div>
     );
}
 
export default Home;