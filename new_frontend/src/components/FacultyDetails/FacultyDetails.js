import './FacultyDetails.css';
import {motion} from 'framer-motion';
import pageAnimationVariant from '../../AnimationData';
import FacultyListItem from '../FacultyListItem/FacultyListItem';
import {useState} from 'react';
import {useQuery} from 'react-query';
import {useParams} from 'react-router-dom';
import {getAFaculty, getComment} from '../../Queries'


const FacultyDetails = () => {
    const {id} = useParams(); 
    const [page, setPage] = useState('');
    const [courseID, setCourseID] = useState(1);
    const {isLoading, isSuccess, isFetching, data, error, isError} = useQuery(['/api/faculty', id], getAFaculty);
    const {isLoading: commentIsLoading, isSuccess: commentIsSuccess, data: commentData, error: commentError, isError: commentIsError} = useQuery(['/api/comment', id, courseID], getComment,{
        enabled: !!data && page =='comments'
    });
    return (
        <motion.div 
            className="facultylist"
            variants={pageAnimationVariant}
            initial="initial"
            animate="animate"
        >
            {
                isError && <div className="faculty-details-wrapper">Error....</div>
            }
            {(isSuccess && typeof data != "undefined")&& 
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

            {isSuccess && <div className="faculty-details-button-wrapper">
                <div className={page == 'comments' ? "faculty-details-comments faculty-details-active" : "faculty-details-comments"} onClick={() => setPage('comments')}>Comments</div>
                <div className={page == 'rate' ? "faculty-details-rate faculty-details-active" : "faculty-details-rate"} onClick={() => setPage('rate')}>Rate</div>
            </div>}
            {(commentIsSuccess && typeof commentData != "undefined" && page == "comments") && commentData.data.map((comment) => {
                return <div>{comment.commentText}</div>
            })}
        </motion.div>
    );
}
 
export default FacultyDetails;