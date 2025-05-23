import React from "react";

const AboutMe: React.FC = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">About Me</h2>
    <p className="mb-4">
      i code 
    </p>
    <div className="grid grid-cols-2 gap-4 mt-6">
      <div className="bg-white/50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Education</h3>
        <p>KJSCE 2023-2027</p>
        <p>Singhania School 2011-2021</p>
      </div>
      <div className="bg-white/50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Location</h3>
        <p>India</p>
      </div>
    </div>
  </div>
);

export default AboutMe;