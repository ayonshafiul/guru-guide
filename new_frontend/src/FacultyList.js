import './FacultyList.css';
import {motion} from 'framer-motion';
import grid from './grid.svg';
import pageAnimationVariant from './AnimationData';
import FacultyListItem from './FacultyListItem';
import {useQuery} from 'react-query';
import {getFaculty} from './Queries'

const FacultyList = () => {
    
    const {isSuccess, isLoading, isError, error, data, isFetching } = useQuery('/api/faculty', getFaculty);
    

    return ( 
        <motion.div 
            className="facultylist"
            variants={pageAnimationVariant}
            initial="initial"
            animate="animate"
        >
        <h1 className="header"> Faculty List</h1>
        {
            isError ? <div>Error Fetching data...</div>: null
        }
        {isSuccess && data.data.map((faculty) => {
            return <FacultyListItem faculty={faculty} key={faculty.facultyID}/>
        })}
        </motion.div>
     );
}
 
export default FacultyList;