import './FacultyList.css';
import {motion} from 'framer-motion';

import pageAnimationVariant from './AnimationData';
import FacultyListItem from './FacultyListItem';
import useAxios from './useAxios';

const FacultyList = () => {
    
    const {isLoading, response, error} = useAxios('/api/faculty');
    
    return ( 
        <motion.div 
            className="facultylist"
            variants={pageAnimationVariant}
            initial="initial"
            animate="animate"
        >
        <h1 className="header"> Faculty List</h1>
        {response && response.data.map((faculty) => {
            return <FacultyListItem faculty={faculty}/>
        })}
        </motion.div>
     );
}
 
export default FacultyList;