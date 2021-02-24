import React, { useState, useEffect } from "react";
import FacultyDetails from "./FacultyDetails";
import AddComment from "./AddComment";
import CommentList from "./CommentList";
import Rating from  "./Rating";
import {useToasts} from "react-toast-notifications";

function Faculty(props) {
  const facultyArray = props.faculties.filter((faculty) => {
    return faculty.facultyID == props.id;
  });
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [dataUpdate, setDataUpdate] = useState(false);
  const [rating, setRating] = useState({});
  const { addToast } = useToasts();


  useEffect(() => {
    let url = "http://localhost:8080/comment/" + props.id;
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
      });
  }, [props.id,dataUpdate]);

  function addComment(event) {
    event.preventDefault();
    console.log(typeof comment);
    let txt = String(comment);
    let url = "http://localhost:8080/comment/" + props.id;

    fetch("http://localhost:8080/comment/" + props.id, {
      method: "POST",
      credentials: "include",
      body: "comment=" + comment,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        if(data.success==true ){
          setComment("");
          setDataUpdate(!dataUpdate);
          addToast("Comment posted!", {appearance: 'success'});
        }
        console.log(data);
      });
  }

  function like(commentID){
    const url ="http://localhost:8080/comment/rate/"+commentID+"/1"
    fetch(url, {
      method: "POST",
      credentials: "include",
      
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        if(data.success==true ){
          setDataUpdate(!dataUpdate);
        }
        console.log(data);
      });
  }

  function dislike(commentID){
    const url ="http://localhost:8080/comment/rate/"+commentID+"/0"
    fetch(url, {
      method: "POST",
      credentials: "include",
      
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        if(data.success==true ){
          setDataUpdate(!dataUpdate);
        }
        console.log(data);
      });
  }

  function changeRating(type, buttonNo) {
    setRating(
      {
        ...rating,
        [type]: buttonNo
      }
    )
  }
  function submitRating() {
    if(rating["teaching"] && rating["humanity"] && rating["grading"]) {
      fetch("http://localhost:8080/rate/" + props.id, {
      method: "POST",
      credentials: "include",
      body: "teaching=" + rating["teaching"] + "&grading=" + rating["grading"] + "&humanity=" + rating["humanity"],
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        if(data.success==true ){
          addToast("Thank you for your valuable feedback!", {appearance: 'success'});
        }
      });
    }
  }

  return (
    <div>
      {facultyArray.length > 0 ? (
        <FacultyDetails faculty={facultyArray[0]} />
      ) : (
        <FacultyDetails faculty={{ facultyName: "loading.." }} />
      )}
      <Rating type="teaching" rating={rating} changeRating={changeRating}/>
      <Rating type="grading" rating={rating} changeRating={changeRating}/>
      <Rating type="humanity" rating={rating}changeRating={changeRating}/>
      { rating["teaching"] && rating["humanity"] && rating["grading"] ? 
        <div className="submit-rating" onClick={submitRating}>Rate</div> :
        <div className="submit-rating-disabled" onClick={submitRating}>Rate</div> 
      }
      <AddComment
        comment={comment}
        setComment={setComment}
        addComment={addComment}
      />

      <CommentList comments={comments} like={like} dislike={dislike} />
    </div>
  );
}

export default Faculty;
