import React from "react";

function AddComment(props) {
  return (
    <form className="ac">
      <input
        type="text"
        className="ac-comment"
        value={props.comment}
        placeholder="Say something!"
        onChange={(event) => {
          props.setComment(event.target.value);
        }}
      />
      <button className="ac-submit" onClick={props.addComment}>
        Submit
      </button>
    </form>
  );
}

export default AddComment;
