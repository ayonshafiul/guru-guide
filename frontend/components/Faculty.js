import React,{useState, useEffect} from "react";
import FacultyDetails from "./FacultyDetails";
import AddComment from "./AddComment";
import CommentList from "./CommentList";

function Faculty(props) {
  const facultyArray = props.faculties.filter((faculty) => {
    return faculty.facultyID == props.id;
  });
   const [comments,setComments] = useState([]);
   const [comment, setComment] =  useState("");
  
  useEffect(()=>{
    let url ="http://localhost:8080/comment/"+props.id;
    fetch(url, {
      method: "GET",
      credentials: "include",
    })
      .then((data) => {
        return data.json();
      })
      .then((results) => {
        console.log(results);
        setComments(results.data);
        
      })
  }, [props.id]) 
 
  function addComment(event) {
    event.preventDefault();
    console.log(typeof comment);
    let url ="http://localhost:8080/comment/"+props.id;
    fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        // 'Content-Type': 'application/json'
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body:{comment:comment}
    })
      .then((data) => {
        return data.json();
      })
      .then((results) => {
        console.log(results);
        
        
      })
  }
  return (
  <div>
 { facultyArray.length > 0 ? (
    <FacultyDetails faculty={facultyArray[0]} />
  ) : (
    <FacultyDetails faculty={{ facultyName: "loading.." }} />
  )}
  <AddComment comment={comment} setComment={setComment} addComment={addComment}/>
  <CommentList comments={comments} />
  </div>
  )
}


export default Faculty;
