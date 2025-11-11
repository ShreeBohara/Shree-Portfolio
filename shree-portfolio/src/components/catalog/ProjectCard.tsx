'use client';

import { motion } from 'framer-motion';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/data/types';
import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  viewMode: 'grid' | 'list';
}

export function ProjectCard({
  project,
  viewMode
}: ProjectCardProps) {
  const { setSelectedItem } = useUIStore();

  const handleClick = () => {
    setSelectedItem(project.id, 'project');
  };

  const getCategoryClass = (category: string) => {
    const categoryMap = {
      'AI/ML': 'category-ai',
      'Full-Stack': 'category-fullstack',
      'Data Engineering': 'category-data',
      'Mobile': 'category-mobile',
      'DevOps': 'category-devops',
      'Open Source': 'category-opensource',
    };
    return categoryMap[category as keyof typeof categoryMap] || '';
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className="group hover:shadow-md transition-all cursor-pointer"
          onClick={handleClick}
        >
          <div className="flex items-center p-4">
            {/* Project info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-lg truncate">{project.title}</h3>
                <Badge variant="outline" className={cn("category-badge shrink-0", getCategoryClass(project.category))}>
                  {project.category}
                </Badge>
                {project.featured && (
                  <Badge variant="default" className="shrink-0">Featured</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{project.summary}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {project.year}
                </span>
                <span>{project.duration}</span>
                {project.teamSize && (
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Team of {project.teamSize}
                  </span>
                )}
              </div>
            </div>

            {/* Metrics preview */}
            <div className="hidden lg:flex items-center gap-6 px-4">
              {project.metrics.slice(0, 2).map((metric) => (
                <div key={metric.label} className="text-center">
                  <p className="text-sm font-semibold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                </div>
              ))}
            </div>

            {/* Arrow */}
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
        </Card>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="group h-full hover:shadow-lg transition-all cursor-pointer"
        onClick={handleClick}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="line-clamp-1">{project.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className={cn("category-badge", getCategoryClass(project.category))}>
                  {project.category}
                </Badge>
                {project.featured && (
                  <Badge variant="default">Featured</Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <CardDescription className="line-clamp-3 mb-4">
            {project.summary}
          </CardDescription>
          
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {project.metrics.slice(0, 2).map((metric) => (
              <div key={metric.label} className="bg-muted/50 rounded-md p-2">
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <p className="text-sm font-semibold">{metric.value}</p>
              </div>
            ))}
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{project.technologies.length - 4}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="text-xs text-muted-foreground">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {project.year}
              </span>
              <span>{project.duration}</span>
            </div>
            {project.teamSize && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {project.teamSize}
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
