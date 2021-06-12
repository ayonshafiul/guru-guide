import "./VerifyConsent.css";
import yes from "../../assets/img/yes.png";
import no from "../../assets/img/no.png";

const VerifyConsent = (props) => {
  const {
    yesButtonHandler,
    noButtonHandler,
    question,
    answerStateVariable,
    yesButtonText,
    noButtonText,
    margin,
  } = props;
  return (
    <div
      className={
        margin ? "verify-consent-wrapper margin" : "verify-consent-wrapper"
      }
    >
      <div className="verify-question-wrapper">{question}</div>
      <div className="verify-options-wrapper">
        <div
          className={
            answerStateVariable === "yes"
              ? "options-button options-yes"
              : "options-button"
          }
          onClick={yesButtonHandler}
        >
          <img className="options-img" src={yes} />
          <div className="options-text">
            {yesButtonText ? yesButtonText : "Yes"}
          </div>
        </div>
        <div
          className={
            answerStateVariable === "no"
              ? "options-button options-no"
              : "options-button"
          }
          onClick={noButtonHandler}
        >
          <img className="options-img" src={no} />
          <div className="options-text">
            {noButtonText ? noButtonText : "No"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyConsent;
