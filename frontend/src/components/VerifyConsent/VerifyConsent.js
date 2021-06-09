import "./VerifyConsent.css";
import yes from "../../assets/img/yes.png";
import no from "../../assets/img/no.png";

const VerifyConsent = (props) => {
  const {yesButtonFunction, noButtonFunction, question, yesButtonText, noButtonText} = props;
  return ( 
    <div className="verify-consent-wrapper">
      <div className="verify-question-wrapper">
        {question}
      </div>
      <div className="verify-options-wrapper">
        <div className="options-button">
          <img className="options-img" src={yes}/>
          <div className="options-text" onClick={yesButtonFunction}>{yesButtonText}</div>
        </div>
        <div className="options-button">
          <img className="options-img" src={no}/>
          <div className="options-text" onClick={noButtonFunction}>{noButtonText}</div>
        </div>
      </div>
    </div>
   );
}
 
export default VerifyConsent;