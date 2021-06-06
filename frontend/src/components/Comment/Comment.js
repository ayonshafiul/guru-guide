import "./Comment.css";
import up from "../../assets/img/up.png";
import down from "../../assets/img/down.png";

const Comment = (props) => {
  const { commentID, commentText, upVoteSum, downVoteSum } = props.comment;
  return (
    <div className="comment">
      <div
        className="comment-text"
        onClick={(event) => (event.target.innerText = commentText)}
      >
        {downVoteSum > upVoteSum 
          ? "Negative content ahead! *CLICK* to view anyway."
          : commentText}
      </div>
      <div className="comment-buttons">
        <div className="vote">
          <div
            className="icon up"
            onClick={() => props.submitCommentVote(commentID, 1)}
          >
            <img className="icon-img" src={up} />
          </div>
          <div className="vote-count">{upVoteSum}</div>
        </div>
        <div className="vote">
          <div
            className="icon down"
            onClick={() => props.submitCommentVote(commentID, 0)}
          >
            <img className="icon-img" src={down} />
          </div>
          <div className="vote-count">{downVoteSum}</div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
