import React from "react";

const Skills: React.FC = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Skills & Expertise</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white/50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Frontend</h3>
        <ul className="list-disc pl-5 text-sm">
          <li>React / Next.js</li>
          <li>TypeScript</li>
          <li>Tailwind CSS</li>
          <li>HTML5 / CSS3</li>
        </ul>
      </div>
      <div className="bg-white/50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Backend</h3>
        <ul className="list-disc pl-5 text-sm">
          <li>Learning backend</li>
          <li>Node.js</li>
          <li>Express</li>
          <li>Python</li>
          <li>SQL </li>
        </ul>
      </div>
      {/* <div className="bg-white/50 p-4 rounded-lg"> */}
        {/* <h3 className="font-medium mb-2">Tools</h3>
        <ul className="list-disc pl-5 text-sm">
          <li>Git / Github</li>
          <li>Adobe Photoshop</li>                    
        </ul> */}
      {/* </div> */}
    </div>
  </div>
);

export default Skills;