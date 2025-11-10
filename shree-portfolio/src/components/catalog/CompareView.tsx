'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, ExternalLink, Github, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { projects } from '@/data/portfolio';
import { Project } from '@/data/types';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui-store';

interface CompareViewProps {
  projectIds: string[];
  onClose: () => void;
}

export function CompareView({ projectIds, onClose }: CompareViewProps) {
  const { setChatContext } = useUIStore();
  const [project1, project2] = projectIds.map(id => projects.find(p => p.id === id)).filter(Boolean) as Project[];

  if (!project1 || !project2) {
    return null;
  }

  const handleAskToCompare = () => {
    // This will trigger a comparison query in the chat
    setChatContext({
      enabled: true,
      itemId: `${project1.id},${project2.id}`,
      itemType: 'project'
    });
    onClose();
  };

  const ComparisonSection = ({ 
    title, 
    content1, 
    content2 
  }: { 
    title: string; 
    content1: React.ReactNode; 
    content2: React.ReactNode;
  }) => (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-muted/30 rounded-lg">{content1}</div>
        <div className="p-3 bg-muted/30 rounded-lg">{content2}</div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="fixed inset-4 md:inset-8 lg:inset-16 bg-background border rounded-lg shadow-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Compare Projects</h2>
            <div className="flex items-center gap-2">
              <Button onClick={handleAskToCompare} variant="default">
                Ask AI to Compare
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto h-[calc(100%-5rem)]">
            <div className="p-6">
              {/* Project titles */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{project1.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{project1.category}</Badge>
                      <span className="text-sm text-muted-foreground">{project1.year}</span>
                    </div>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{project2.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{project2.category}</Badge>
                      <span className="text-sm text-muted-foreground">{project2.year}</span>
                    </div>
                  </CardHeader>
                </Card>
              </div>

              {/* Summaries */}
              <ComparisonSection
                title="Summary"
                content1={<p className="text-sm">{project1.summary}</p>}
                content2={<p className="text-sm">{project2.summary}</p>}
              />

              {/* Key Details */}
              <ComparisonSection
                title="Key Details"
                content1={
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{project1.duration}</span>
                    </div>
                    {project1.teamSize && (
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        <span>Team of {project1.teamSize}</span>
                      </div>
                    )}
                    <div>
                      <strong>My Role:</strong> {project1.myRole}
                    </div>
                  </div>
                }
                content2={
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{project2.duration}</span>
                    </div>
                    {project2.teamSize && (
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        <span>Team of {project2.teamSize}</span>
                      </div>
                    )}
                    <div>
                      <strong>My Role:</strong> {project2.myRole}
                    </div>
                  </div>
                }
              />

              {/* Metrics */}
              <ComparisonSection
                title="Key Metrics"
                content1={
                  <div className="space-y-2">
                    {project1.metrics.map((metric) => (
                      <div key={metric.label} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{metric.label}</span>
                        <span className="font-medium">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                }
                content2={
                  <div className="space-y-2">
                    {project2.metrics.map((metric) => (
                      <div key={metric.label} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{metric.label}</span>
                        <span className="font-medium">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                }
              />

              {/* Technologies */}
              <ComparisonSection
                title="Technologies Used"
                content1={
                  <div className="flex flex-wrap gap-1">
                    {project1.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                }
                content2={
                  <div className="flex flex-wrap gap-1">
                    {project2.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                }
              />

              {/* Links */}
              <ComparisonSection
                title="Project Links"
                content1={
                  <div className="space-y-2">
                    {project1.links.live && (
                      <a
                        href={project1.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Live Demo
                      </a>
                    )}
                    {project1.links.github && (
                      <a
                        href={project1.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:underline"
                      >
                        <Github className="h-3 w-3" />
                        Source Code
                      </a>
                    )}
                    {project1.links.caseStudy && (
                      <a
                        href={project1.links.caseStudy}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:underline"
                      >
                        <FileText className="h-3 w-3" />
                        Case Study
                      </a>
                    )}
                  </div>
                }
                content2={
                  <div className="space-y-2">
                    {project2.links.live && (
                      <a
                        href={project2.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Live Demo
                      </a>
                    )}
                    {project2.links.github && (
                      <a
                        href={project2.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:underline"
                      >
                        <Github className="h-3 w-3" />
                        Source Code
                      </a>
                    )}
                    {project2.links.caseStudy && (
                      <a
                        href={project2.links.caseStudy}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:underline"
                      >
                        <FileText className="h-3 w-3" />
                        Case Study
                      </a>
                    )}
                  </div>
                }
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
