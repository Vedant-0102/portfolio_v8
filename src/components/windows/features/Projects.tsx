import React, { useState } from 'react';
import { FolderOpen, Code, FileText, Hash, Globe, Github } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  screenshots?: string[];
  features?: string[];
  links?: {
    demo?: string;
    github?: string;
  };
  about?: string;
}

const ProjectFolder = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tech' | 'demo'>('overview');
  
  const projects: Project[] = [
    {
      id: 'proj1',
      name: 'Portfolio Website',
      description: 'A personal portfolio website built with React and TailwindCSS. Features responsive design, dark mode, and smooth animations.',
      tech: ['React', 'TailwindCSS', 'Vite'],
      about: 'This personal portfolio showcases my skills and projects in web development. Built with modern technologies, it features a responsive design that works great on all devices, animated transitions, and a user-friendly interface.',
      screenshots: [],
      features: [
        'Responsive design for all devices',
        'Dark/light theme switching',
        'Interactive project showcase',
        'Contact form with validation'
      ],
      links: {
        demo: 'https://portfolio.example.com',
        github: 'https://github.com/username/portfolio'
      }
    },
    {
      id: 'proj2',
      name: 'E-commerce Platform',
      description: 'Online shopping platform with React, Node.js and MongoDB. Features user authentication, product catalog, and payment processing.',
      tech: ['React', 'Node.js', 'Express', 'MongoDB'],
      about: 'A full-featured e-commerce solution that provides a seamless shopping experience. This platform includes user authentication, product management, shopping cart functionality, secure payment processing, and order tracking.',
      features: [
        'User authentication and profiles',
        'Product search and filtering',
        'Shopping cart functionality',
        'Payment processing',
        'Order tracking'
      ],
      links: {
        demo: 'https://shop.example.com',
        github: 'https://github.com/username/ecommerce'
      }
    },
    {
      id: 'proj3',
      name: 'Mobile App',
      description: 'Cross-platform mobile app using React Native. Features location tracking, social sharing, and offline support.',
      tech: ['React Native', 'Expo', 'Firebase'],
      about: 'This cross-platform mobile application provides location-based services with social features. Built with React Native and Expo, it works seamlessly on both iOS and Android devices with native-like performance.',
      features: [
        'Cross-platform (iOS & Android)',
        'User authentication',
        'Location tracking',
        'Push notifications',
        'Offline data sync'
      ],
      links: {
        github: 'https://github.com/username/mobile-app'
      }
    },
    {
      id: 'proj4',
      name: 'Data Visualization Dashboard',
      description: 'Interactive dashboard with real-time data visualization using D3.js and React.',
      tech: ['D3.js', 'React', 'Node.js'],
      about: 'This interactive dashboard provides powerful data visualization capabilities for complex datasets. Using D3.js with React, it renders dynamic charts and graphs that update in real-time as data changes.',
      features: [
        'Real-time data updates',
        'Interactive charts and graphs',
        'Data filtering and search',
        'Export to CSV/PDF'
      ],
      links: {
        demo: 'https://dashboard.example.com',
        github: 'https://github.com/username/dashboard'
      }
    }
  ];

  return (
    <div className="p-4 h-full">
      <h2 className="text-2xl font-semibold mb-4">Projects</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100%-2rem)]">
        {/* Project List */}
        <div className="bg-white/50 rounded-lg overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <FolderOpen size={18} />
              <span className="font-medium">Projects</span>
            </div>
          </div>
          <div className="p-2">
            {projects.map(project => (
              <div 
                key={project.id} 
                className={`flex items-center p-3 hover:bg-gray-200/50 rounded-md cursor-pointer ${selectedProject?.id === project.id ? 'bg-gray-200/70' : ''}`}
                onClick={() => setSelectedProject(project)}
              >
                <FolderOpen size={18} className="mr-3 text-yellow-600" />
                <div>
                  <div className="font-medium">{project.name}</div>
                  <div className="text-xs text-gray-600 line-clamp-1">{project.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Project Details View */}
        <div className="col-span-2 bg-white/50 rounded-lg overflow-hidden flex flex-col">
          {selectedProject ? (
            <div className="h-full flex flex-col">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 font-medium text-sm ${activeTab === 'overview' ? 'border-b-2 border-blue-500' : ''}`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('tech')}
                    className={`px-4 py-2 font-medium text-sm ${activeTab === 'tech' ? 'border-b-2 border-blue-500' : ''}`}
                  >
                    Tech & Features
                  </button>
                  <button
                    onClick={() => setActiveTab('demo')}
                    className={`px-4 py-2 font-medium text-sm ${activeTab === 'demo' ? 'border-b-2 border-blue-500' : ''}`}
                  >
                    Demo
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-auto flex-1">
                {activeTab === 'overview' && (
                  <>
                    <h2 className="text-2xl font-bold mb-3">{selectedProject.name}</h2>
                    <p className="text-gray-600 mb-4">{selectedProject.description}</p>
                    
                    {selectedProject.about && (
                      <div className="bg-white/60 p-4 rounded-lg mb-4">
                        <h3 className="font-medium mb-2">About This Project</h3>
                        <p className="text-sm">{selectedProject.about}</p>
                      </div>
                    )}
                  </>
                )}
                
                {activeTab === 'tech' && (
                  <>
                    <h2 className="text-2xl font-bold mb-4">{selectedProject.name}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white/60 p-4 rounded-lg">
                        <h3 className="font-medium flex items-center gap-2 mb-3">
                          <Code size={18} />
                          Technologies
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.tech.map((tech, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {selectedProject.features && (
                        <div className="bg-white/60 p-4 rounded-lg">
                          <h3 className="font-medium flex items-center gap-2 mb-3">
                            <Hash size={18} />
                            Key Features
                          </h3>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            {selectedProject.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </>
                )}
                
                {activeTab === 'demo' && (
                  <>
                    <h2 className="text-2xl font-bold mb-4">{selectedProject.name}</h2>
                    
                    <div className="bg-white/60 p-6 rounded-lg text-center">
                      <h3 className="font-medium mb-4">Project Links</h3>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        {selectedProject.links?.demo && (
                          <a 
                            href={selectedProject.links.demo} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <Globe size={18} />
                            Live Demo
                          </a>
                        )}
                        {selectedProject.links?.github && (
                          <a 
                            href={selectedProject.links.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                          >
                            <Github size={18} />
                            Source Code
                          </a>
                        )}
                      </div>
                      
                      {!selectedProject.links?.demo && !selectedProject.links?.github && (
                        <p className="text-gray-500">No demo or source code links available for this project.</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <FolderOpen size={48} className="mb-4 opacity-40" />
              <p>Select a project to view its details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectFolder;
