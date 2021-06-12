import "./VerifyPicker.css";

const VerifyPicker = (props) => {
  const {
    header,
    allowNoVote,
    idKeyName,
    titleKeyName,
    optionsData,
    verifySelectedID,
    setVerifySelectedID,
    submitHandler,
    margin,
    submitButtonText,
  } = props;
  return (
    <div
      className={
        margin ? "verify-picker-wrapper margin" : "verify-picker-wrapper"
      }
    >
      <div className="global-info-text">{header}</div>
      {typeof optionsData !== "undefined" &&
        optionsData.data.map((option) => {
          return (
            <div
              className={
                verifySelectedID == option[idKeyName]
                  ? "verify-picker-option-selected"
                  : "verify-picker-option"
              }
              key={option[idKeyName]}
              onClick={() => {
                setVerifySelectedID(option[idKeyName]);
                console.log(option[idKeyName], verifySelectedID);
              }}
            >
              {option[titleKeyName]}
            </div>
          );
        })}
      {allowNoVote && (
        <div
          className={
            verifySelectedID === -1
              ? "verify-picker-option-selected"
              : "verify-picker-option"
          }
          onClick={() => setVerifySelectedID(-1)}
        >
          None of them are correct
        </div>
      )}
      <div className="global-btn-full" onClick={submitHandler}>
        {submitButtonText ? submitButtonText : "Submit"}
      </div>
    </div>
  );
};

export default VerifyPicker;
