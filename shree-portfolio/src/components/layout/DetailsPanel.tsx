'use client';

import { X, ExternalLink, Github, FileText, Play, MessageCircle, Calendar } from 'lucide-react';
import { useUIStore } from '@/store/ui-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, experiences, education, personalInfo } from '@/data/portfolio';
import { Project, Experience, Education } from '@/data/types';

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
      setChatContext({
        enabled: true,
        itemId: selectedItemId,
        itemType: selectedItemType,
      });
    }
  };

  // Only show panel for projects for now
  if (selectedItemType !== 'project' || !selectedItem) {
    return null;
  }

  const project = selectedItem as Project;

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
                    <Button variant="outline" className="justify-start" asChild>
                      <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Live Demo
                      </a>
                    </Button>
                  )}
                  {project.links.github && (
                    <Button variant="outline" className="justify-start" asChild>
                      <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        View Source Code
                      </a>
                    </Button>
                  )}
                  {project.links.caseStudy && (
                    <Button variant="outline" className="justify-start" asChild>
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
              <Button className="w-full" onClick={handleAskAbout}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Ask about this project
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href={personalInfo.links.calendar} target="_blank" rel="noopener noreferrer">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book a call to discuss
                </a>
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
