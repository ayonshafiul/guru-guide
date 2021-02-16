import React from "react";
import CommentListItem from "./CommentListItem";

function CommentList(props) {
    return(
        <div>
        {
            props.comments.map((comment)=>{
                return(
                    <CommentListItem comment={comment} key={comment.commentID} like={props.like} dislike={props.dislike}/>
                )
            })

        }
        </div>
    )
    

}

export default CommentList