import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>JSC</h4>
                <h5>Guimara Govt. Model High School</h5>
              </div>
              <h3>2020</h3>
            </div>
            <p>
              i got my junior school certificate in 2020 from guimara govt. model high school. i have completed my jsc with gpa 4.86 out of 5.00.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>SSC</h4>
                <h5>Rangamati Govt. High School</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
          i got my secondary school certificate in 2023 from rangamati govt. high school. i have completed my ssc with gpa 4.92 out of 5.00.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Diploma</h4>
                <h5>Chattogram Polytechnic Institute</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              i am currently pursuing my diploma in computer science from chattogram polytechnic institute.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
