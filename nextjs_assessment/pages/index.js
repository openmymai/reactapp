import React, { useState } from "react";
import AssessmentList from "../components/AssessmentList";

const Home = () => {
  const [ query, updateQuery ] = useState("");
  
    return (
      <div>
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => updateQuery(e.target.value.toLocaleLowerCase())}
        />
        <br />
        <AssessmentList search={query} />
      </div>
    );
  
}

export default Home;