import React from 'react';
const i1 = require("../src/img/1.png");
const i2 = require("../src/img/2.png");
const i3 = require("../src/img/3.png");
const i4 = require("../src/img/4.png");
const i5 = require("../src/img/5.png");
const i6 = require("../src/img/6.png");
const i7 = require("../src/img/7.png");
const i8 = require("../src/img/8.png");
const i9 = require("../src/img/9.png");
const i10 = require("../src/img/10.png");

export default function Rating(props) { //type //rating {teaching: 1, grading: 2, humanity: 3}
  const buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  return (
    <div className="ratingBox">
      <div className="rc">
        <div className="rc-title">{props.type}</div>
        <div className="rating-box-info">{props.rating[props.type] ? `:   ${props.rating[props.type]}` : props.rating[props.type]}</div>
        {
         
          buttons.map(
            (buttonNo) => {
              return (
              <div key={props.type+buttonNo} className="rc-emoji" onClick={() => {props.changeRating(props.type, buttonNo)}}>
                <img 
                  className={props.rating[props.type] == buttonNo ? "rc-emoji-active": "rc-emoji-img"}
                  src={String(require(`../src/img/${buttonNo}.png`))}/>
              </div>
              )
            }
          )
        }
      </div>
    </div>
  );
}

