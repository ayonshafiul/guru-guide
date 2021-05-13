import i1 from "../../assets/img/1.png";
import i2 from "../../assets/img/2.png";
import i3 from "../../assets/img/3.png";
import i4 from "../../assets/img/4.png";
import i5 from "../../assets/img/5.png";
import i6 from "../../assets/img/6.png";
import i7 from "../../assets/img/7.png";
import i8 from "../../assets/img/8.png";
import i9 from "../../assets/img/9.png";
import i10 from "../../assets/img/10.png";
import "./Rating.css";

export default function Rating(props) { //type //rating {teaching: 1, grading: 2, humanity: 3}
  const buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const emojiArray = [i1, i1, i2, i3, i4, i5, i6, i7, i8, i9, i10]
  return (
    <div className="ratingBox">
      <div className="rc">
        <div className="rc-title">{props.type}</div>
        <div className="rating-box-info">{props.rating[props.type] ? `:  ${props.rating[props.type]}` : props.rating[props.type]}</div>
        {
         
          buttons.map(
            (buttonNo) => {
              return (
              <div key={props.type+buttonNo} className="rc-emoji" onClick={() => {props.changeRating(props.type, buttonNo)}}>
                <img 
                  className={props.rating[props.type] == buttonNo ? "rc-emoji-active": "rc-emoji-img"}
                  src={emojiArray[buttonNo]}/>
              </div>
              )
            }
          )
        }
      </div>
    </div>
  );
}