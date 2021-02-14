import React from "react";


function AddComment(props) {

    return (
        <form> 
            <input type =  "text" value ={props.comment} onChange={(event) => {props.setComment(event.target.value)}} /> 
            <button onClick={props.addComment}> Submit </button>
        </form>
      
    )
}


export default AddComment