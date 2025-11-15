'use client';

import { X, ExternalLink, Github, FileText, Play, MessageCircle, Calendar } from 'lucide-react';
import { useUIStore } from '@/store/ui-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, experiences, education, personalInfo } from '@/data/portfolio';
import { Project, Experience, Education } from '@/data/types';
import { useRouter } from 'next/navigation';

// Helper function to render text with clickable URLs
const renderTextWithLinks = (text: string) => {
  // Match both URLs with protocol (http://, https://) and without (domain.com/path)
  const urlRegex = /((?:https?:\/\/)?(?:www\.)?[\w-]+\.[\w.-]+(?:\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex) && (part.includes('.com') || part.includes('.org') || part.includes('.net') || part.includes('.io'))) {
      const href = part.startsWith('http') ? part : `https://${part}`;
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-color hover:text-accent-color/80 underline underline-offset-2 transition-colors font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

// Mock data - will be replaced with real data later
const mockProject = {
  id: 'project-1',
  title: 'AI Customer Support Platform',
  category: 'AI/ML',
  year: 2024,
  duration: '3 months',
  summary: 'Built an intelligent customer support system that reduced response time by 60% and improved customer satisfaction scores by 35%.',
  problem: 'Customer support team was overwhelmed with repetitive queries, leading to slow response times and inconsistent answers.',
  approach: 'Developed an AI-powered chatbot using GPT-4 and RAG to handle common queries, with seamless handoff to human agents for complex issues.',
  impact: 'Automated 70% of support tickets, saving 200+ hours per month and improving first-response time from 2 hours to 5 minutes.',
  metrics: [
    { label: 'Response Time', value: '60% faster' },
    { label: 'Ticket Automation', value: '70%' },
    { label: 'Cost Savings', value: '$50k/month' },
    { label: 'User Satisfaction', value: '+35 NPS' },
  ],
  myRole: 'Led the technical architecture and implementation as the sole developer on this project.',
  technologies: ['Next.js', 'TypeScript', 'OpenAI API', 'Pinecone', 'Tailwind CSS', 'PostgreSQL'],
  links: {
    live: 'https://example.com',
    github: 'https://github.com',
    caseStudy: 'https://example.com/case-study',
  },
};

export function DetailsPanel() {
  const router = useRouter();
  const { isDetailsPanelOpen, closeDetailsPanel, selectedItemId, selectedItemType, setChatContext } = useUIStore();

  // Get the actual data based on selected item
  const selectedItem = selectedItemId && selectedItemType === 'project'
    ? projects.find(p => p.id === selectedItemId)
    : selectedItemType === 'experience'
    ? experiences.find(e => e.id === selectedItemId)
    : selectedItemType === 'education'
    ? education.find(e => e.id === selectedItemId)
    : null;

  const handleAskAbout = () => {
    if (selectedItemId && selectedItemType) {
      // Set chat context
      setChatContext({
        enabled: true,
        itemId: selectedItemId,
        itemType: selectedItemType,
      });

      // Navigate to chat page
      router.push('/');

      // Close the details panel
      closeDetailsPanel();
    }
  };

  // Don't show panel if no item selected
  if (!selectedItem || !selectedItemType) {
    return null;
  }

  const renderContent = () => {
    if (selectedItemType === 'project') {
      const project = selectedItem as Project;
      return (
        <>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn(
                project.category === 'AI/ML' && 'category-ai',
                project.category === 'Full-Stack' && 'category-fullstack',
                project.category === 'Data Engineering' && 'category-data',
                project.category === 'Mobile' && 'category-mobile',
                project.category === 'DevOps' && 'category-devops',
                project.category === 'Open Source' && 'category-opensource'
              )}>
                {project.category}
              </Badge>
              <span className="text-sm text-muted-foreground">{project.year}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeDetailsPanel}
              aria-label="Close details panel"
              className="hover:text-accent-color hover:bg-accent-color/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Title and summary */}
              <div>
                <h2 className="heading-2 mb-2">{project.title}</h2>
                <p className="text-muted-foreground">{project.summary}</p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-lg font-semibold">{metric.value}</p>
                  </div>
                ))}
              </div>

              {/* Problem & Solution */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Problem</h3>
                  <p className="text-sm text-muted-foreground">{project.problem}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Approach</h3>
                  <p className="text-sm text-muted-foreground">{project.approach}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Impact</h3>
                  <p className="text-sm text-muted-foreground">{project.impact}</p>
                </div>
              </div>

              {/* My Role */}
              <div>
                <h3 className="font-medium mb-1">My Role</h3>
                <p className="text-sm text-muted-foreground">{project.myRole}</p>
              </div>

              {/* Technologies */}
              <div>
                <h3 className="font-medium mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-2">
                {project.links.live && (
                  <Button variant="outline" className="justify-start hover:border-accent-color/50 hover:text-accent-color hover:bg-accent-color/10" asChild>
                    <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Live Demo
                    </a>
                  </Button>
                )}
                {project.links.github && (
                  <Button variant="outline" className="justify-start hover:border-accent-color/50 hover:text-accent-color hover:bg-accent-color/10" asChild>
                    <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      View Source Code
                    </a>
                  </Button>
                )}
                {project.links.caseStudy && (
                  <Button variant="outline" className="justify-start hover:border-accent-color/50 hover:text-accent-color hover:bg-accent-color/10" asChild>
                    <a href={project.links.caseStudy} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      Read Case Study
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="p-4 border-t space-y-2">
            <Button className="w-full bg-accent-color hover:bg-accent-color/90 text-white border-0" onClick={handleAskAbout}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Ask about this project
            </Button>
            <Button variant="outline" className="w-full hover:border-accent-color/50 hover:text-accent-color hover:bg-accent-color/10" asChild>
              <a href={personalInfo.links.calendar} target="_blank" rel="noopener noreferrer">
                <Calendar className="h-4 w-4 mr-2" />
                Book a call to discuss
              </a>
            </Button>
          </div>
        </>
      );
    } else if (selectedItemType === 'experience') {
      const experience = selectedItem as Experience;
      return (
        <>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {experience.type}
              </Badge>
              <span className="text-sm text-muted-foreground">{experience.location}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeDetailsPanel}
              aria-label="Close details panel"
              className="hover:text-accent-color hover:bg-accent-color/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <h2 className="heading-2 mb-1">{experience.role}</h2>
                <p className="text-lg font-medium text-muted-foreground mb-2">{experience.company}</p>
                <p className="text-sm text-muted-foreground">
                  {experience.startDate} - {experience.current ? 'Present' : experience.endDate}
                </p>
              </div>

              {/* Summary */}
              <div>
                <p className="text-muted-foreground">{renderTextWithLinks(experience.summary)}</p>
              </div>

              {/* Highlights */}
              <div>
                <h3 className="font-medium mb-3">Key Achievements</h3>
                <ul className="space-y-3">
                  {experience.highlights.map((highlight, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-accent-color mt-1.5">•</span>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">{renderTextWithLinks(highlight.text)}</p>
                        {highlight.metric && (
                          <p className="text-sm font-semibold mt-1">{highlight.metric}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies */}
              {experience.technologies && experience.technologies.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {experience.links && (
                <div className="flex flex-col gap-2">
                  {experience.links.company && (
                    <Button variant="outline" className="justify-start hover:border-accent-color/50 hover:text-accent-color hover:bg-accent-color/10" asChild>
                      <a href={experience.links.company} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Company Website
                      </a>
                    </Button>
                  )}
                  {experience.links.project && (
                    <Button variant="outline" className="justify-start hover:border-accent-color/50 hover:text-accent-color hover:bg-accent-color/10" asChild>
                      <a href={experience.links.project} target="_blank" rel="noopener noreferrer">
                        <Play className="h-4 w-4 mr-2" />
                        View Live Project
                      </a>
                    </Button>
                  )}
                  {experience.links.caseStudy && (
                    <Button variant="outline" className="justify-start hover:border-accent-color/50 hover:text-accent-color hover:bg-accent-color/10" asChild>
                      <a href={experience.links.caseStudy} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2" />
                        Read Case Study
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer actions */}
          <div className="p-4 border-t space-y-2">
            <Button className="w-full bg-accent-color hover:bg-accent-color/90 text-white border-0" onClick={handleAskAbout}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Ask about this experience
            </Button>
            <Button variant="outline" className="w-full hover:border-accent-color/50 hover:text-accent-color hover:bg-accent-color/10" asChild>
              <a href={personalInfo.links.calendar} target="_blank" rel="noopener noreferrer">
                <Calendar className="h-4 w-4 mr-2" />
                Book a call to discuss
              </a>
            </Button>
          </div>
        </>
      );
    } else if (selectedItemType === 'education') {
      const edu = selectedItem as Education;
      return (
        <>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {edu.startYear} - {edu.endYear}
              </Badge>
              <span className="text-sm text-muted-foreground">{edu.location}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeDetailsPanel}
              aria-label="Close details panel"
              className="hover:text-accent-color hover:bg-accent-color/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <h2 className="heading-2 mb-1">{edu.degree}</h2>
                <p className="text-lg font-medium text-muted-foreground mb-2">{edu.field}</p>
                <p className="text-base text-muted-foreground">{edu.institution}</p>
                {edu.gpa && (
                  <p className="text-sm text-muted-foreground mt-2">GPA: {edu.gpa}</p>
                )}
              </div>

              {/* Achievements */}
              {edu.achievements && edu.achievements.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Achievements & Honors</h3>
                  <ul className="space-y-1">
                    {edu.achievements.map((achievement, index) => (
                      <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-accent-color">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Relevant Coursework */}
              {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Relevant Coursework</h3>
                  <div className="flex flex-wrap gap-2">
                    {edu.relevantCoursework.map((course) => (
                      <Badge key={course} variant="secondary" className="text-xs">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {edu.projects && edu.projects.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Academic Projects</h3>
                  <div className="space-y-3">
                    {edu.projects.map((project, index) => (
                      <div key={index} className="bg-muted/30 rounded-lg p-3">
                        <p className="font-medium text-sm mb-1">{project.name}</p>
                        <p className="text-xs text-muted-foreground">{project.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer actions */}
          <div className="p-4 border-t space-y-2">
            <Button className="w-full bg-accent-color hover:bg-accent-color/90 text-white border-0" onClick={handleAskAbout}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Ask about my education
            </Button>
            <Button variant="outline" className="w-full hover:border-accent-color/50 hover:text-accent-color hover:bg-accent-color/10" asChild>
              <a href={personalInfo.links.calendar} target="_blank" rel="noopener noreferrer">
                <Calendar className="h-4 w-4 mr-2" />
                Book a call to discuss
              </a>
            </Button>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <AnimatePresence>
      {isDetailsPanelOpen && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeDetailsPanel}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className={cn(
              "fixed right-0 top-0 z-40 h-full bg-background border-l",
              "w-full sm:w-[480px] lg:w-[400px]",
              "flex flex-col"
            )}
          >
            {renderContent()}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
