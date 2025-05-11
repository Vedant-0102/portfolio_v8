import React from "react";

const AboutMe: React.FC = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">About Me</h2>
    <p className="mb-4">
      Hello! I'm a passionate web developer and designer with expertise in creating
      modern, interactive web applications. With years of experience in front-end and back-end
      development, I strive to create beautiful, functional applications.
    </p>
    <div className="grid grid-cols-2 gap-4 mt-6">
      <div className="bg-white/50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Education</h3>
        <p>B.S. Computer Science, University, 2020-2024</p>
      </div>
      <div className="bg-white/50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Location</h3>
        <p>San Francisco, CA</p>
      </div>
    </div>
  </div>
);

export default AboutMe;