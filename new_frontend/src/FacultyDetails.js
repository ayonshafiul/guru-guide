import './FacultyDetails.css';
import {motion} from 'framer-motion';
import grid from './grid.svg';
import pageAnimationVariant from './AnimationData';
import FacultyListItem from './FacultyListItem';
import {useQuery} from 'react-query';
import {useParams} from 'react-router-dom';
import {getAFaculty} from './Queries'


const FacultyDetails = () => {
    const {id} = useParams(); 
    const {isLoading, isSuccess, isFetching, data, error, isError} = useQuery(['/api/faculty', id], getAFaculty);
    return (
        <motion.div 
            className="facultylist"
            variants={pageAnimationVariant}
            initial="initial"
            animate="animate"
        >
            {
                isError && <div>Error....</div>
            }
            {isSuccess && 
            <div className="faculty-details-wrapper">
                <div className="faculty-details-name">{data.data.facultyName}</div>
                <div className="faculty-details-initials">{data.data.facultyInitials}</div>
                <div className="faculty-details-department">{data.data.departmentID}</div>
                <div className="faculty-details-overall">
                    &#9733; {((data.data.grading + data.data.teaching + data.data.humanity)/3).toFixed(1)}
                    <div className="faculty-details-overlay faculty-details-overall-background-overlay" style={{width: ((data.data.grading + data.data.teaching + data.data.humanity)/3).toFixed(1) * 0.7 + 30 + '%'}}>
                    </div> 
                </div>
                <div className="faculty-details-grading">
                    Grading: {data.data.grading} 
                    <div className="faculty-details-overlay" style={{width: data.data.humanity * 0.7 + 30 + '%'}}>
                    </div>
                </div>
                <div className="faculty-details-teaching">
                    Teaching: {data.data.teaching} 
                    <div className="faculty-details-overlay" style={{width: data.data.humanity * 0.7 + 30 + '%'}}>
                    </div>    
                </div>
                <div className="faculty-details-humanity">
                    Friendliness: {data.data.humanity} 
                    <div className="faculty-details-overlay" style={{width: data.data.humanity * 0.7 + 30 + '%'}}>
                    </div>
                </div>
            </div> }
        </motion.div>
    );
}
 
export default FacultyDetails;