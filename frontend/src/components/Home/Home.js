import "./Home.css";
import { Link } from "react-router-dom";
import cat from "../../assets/img/cat.png";
import cat2 from "../../assets/img/cat2.png";
const Home = () => {
  return (
    <div className="container">
      <img className="cat" src={cat} />
      <h2 className="title-text">
        <span className="react-color">Aww,</span> you found me{" "}
        <span className="react-color">{"<3"}</span>
      </h2>
      <div className="cat2-left">
        <img className="cat2" src={cat2} />
        <h2>
          <span className="react-color">Hi,</span>
          <br />
          I'm Guru.
          <br />
          <br />
        </h2>
      </div>
      <h2>
        I'll be your little buddy in guiding you through your journey in{" "}
        <span className="react-color">BRACU</span> life!
      </h2>
      <br />
      <div className="centered">
        <h2 className="steps">
          <span className="bullet">1</span>Tell me all about your{" "}
          <span className="react-color">faculties</span> and{" "}
          <span className="react-color">courses</span>
        </h2>

        <h2 className="steps">
          <span className="bullet">2</span>Make sure that the info is{" "}
          <span className="react-color">correct!</span>
        </h2>
        <h2 className="steps">
          <span className="bullet">3</span>Give feedback about your{" "}
          <span className="react-color">faculties and courses!</span>
        </h2>
        <h2 className="steps">
          <span className="bullet">4</span>
          Use the feedback to make better{" "}
          <span className="react-color">decisions</span> while planning your
          next semester!
        </h2>
      </div>
      <Link to="/login" style={{ textDecoration: "none" }}>
        <div className="login-btn-homepage">Get Started</div>
      </Link>
    </div>
  );
};

export default Home;
