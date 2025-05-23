import React from "react";

const ContactMe: React.FC = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Contact Me</h2>
    <div className="space-y-4">
      <div className="bg-white/50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Get In Touch</h3>
        <p className="mb-4">Feel free to reach out</p>
        <div className="space-y-2">
          <p><span className="font-medium">Email:</span> vedantshinde164@gmail.comm</p>
          <p><span className="font-medium">LinkedIn:</span>linkedin.com/in/vedant0102/</p>
        </div>
      </div>
    </div>
  </div>
);

export default ContactMe;