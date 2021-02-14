import React from "react";

function CommentListItem(props) {
    return(
        <div>
            <div >{props.comment.comment}</div>
            <div>{props.comment.upVoteSum}</div>
            <div>{props.comment.downVoteSum}</div>
            
        </div>
    )
}

export default CommentListItem