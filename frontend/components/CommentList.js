import React from "react";
import CommentListItem from "./CommentListItem";

function CommentList(props) {
    return(
        <div>
        {
            props.comments.map((comment)=>{
                return(
                    <CommentListItem comment={comment} key={comment.commentID}/>
                )
            })

        }
        </div>
    )
    

}

export default CommentList