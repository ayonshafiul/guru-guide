import React from "react";

function CommentListItem(props) {
    
    return(
        <div className = "cl">
            <div className = "cl-comment" >{props.comment.comment}</div>
            <button className = "cl-vote-up" onClick={() =>{props.like(props.comment.commentID)}}>{props.comment.upVoteSum} <i className="far fa-thumbs-up "></i></button>
            <button className = "cl-vote-down" onClick={() =>{props.dislike(props.comment.commentID)}}>{props.comment.downVoteSum} <i className="far fa-thumbs-down"></i></button>
           


        </div>
    )
}

export default CommentListItem