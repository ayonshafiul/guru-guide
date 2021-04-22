import './FacultyListItem.css';

const FacultyListItem = (props)  => {
    const {facultyName, facultyInitials, teaching, grading, humanity} = props.faculty;
    console.log(props);
    return (
    <div className="faculty-wrapper">
      <div className="name-wrapper">
        <div className="faculty-name">{facultyName}</div>
        <div className="faculty-initials">{facultyInitials}</div>
      </div>
      <div className="rating-wrapper">
          <div className="average-rating">{((teaching + grading + humanity) / 3).toFixed(1)} <span>&#9733;</span></div> 
          <div className="rating-bar-wrapper">
            <div className="rating-bar" style ={{height: (teaching * 1.8) + 2}}></div>
            <div className="rating-bar" style ={{height: (grading * 1.8) + 2}}></div>
            <div className="rating-bar"style ={{height: (humanity * 1.8) + 2}}></div>
          </div>
      </div>
      
    </div>
  );
}

export default FacultyListItem;
