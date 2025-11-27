'use client';

import { motion } from 'framer-motion';
import { Calendar, Users, ArrowRight, FolderCode, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/data/types';
import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ProjectCardProps {
  project: Project;
  viewMode: 'grid' | 'list';
}

// Category-based gradient backgrounds for projects without thumbnails
const categoryGradients: Record<string, string> = {
  'AI/ML': 'from-violet-500/20 via-purple-500/10 to-fuchsia-500/20',
  'Full-Stack': 'from-blue-500/20 via-cyan-500/10 to-teal-500/20',
  'Data Engineering': 'from-emerald-500/20 via-green-500/10 to-lime-500/20',
  'Mobile': 'from-orange-500/20 via-amber-500/10 to-yellow-500/20',
  'DevOps': 'from-slate-500/20 via-gray-500/10 to-zinc-500/20',
  'Open Source': 'from-rose-500/20 via-pink-500/10 to-red-500/20',
  'Academic': 'from-indigo-500/20 via-blue-500/10 to-sky-500/20',
};

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

  const thumbnailUrl = project.images?.thumbnail;
  const gradientClass = categoryGradients[project.category] || categoryGradients['Full-Stack'];

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card
          className="group hover:shadow-md hover:border-accent-color/50 transition-all cursor-pointer overflow-hidden"
          onClick={handleClick}
        >
          <div className="flex items-center p-4">
            {/* Thumbnail */}
            <div className="hidden sm:block w-20 h-20 rounded-lg overflow-hidden mr-4 shrink-0">
              {thumbnailUrl ? (
                <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={thumbnailUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              ) : (
                <div className={cn(
                  "w-full h-full flex items-center justify-center bg-gradient-to-br",
                  gradientClass
                )}>
                  <FolderCode className="h-8 w-8 text-muted-foreground/50" />
                </div>
              )}
            </div>

            {/* Project info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-accent-color transition-colors">{project.title}</h3>
                <Badge variant="outline" className={cn("category-badge shrink-0", getCategoryClass(project.category))}>
                  {project.category}
                </Badge>
                {project.featured && (
                  <Badge variant="default" className="shrink-0 gap-1">
                    <Sparkles className="h-3 w-3" />
                    Featured
                  </Badge>
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
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-accent-color transition-all" />
          </div>
        </Card>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card
        className="group h-full hover:shadow-lg hover:border-accent-color/50 transition-all cursor-pointer overflow-hidden hover:scale-[1.02] hover:-translate-y-1"
        onClick={handleClick}
      >
        {/* Thumbnail Section */}
        <div className="relative h-40 w-full overflow-hidden">
          {thumbnailUrl ? (
            <>
              <Image
                src={thumbnailUrl}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60" />
            </>
          ) : (
            <div className={cn(
              "w-full h-full flex items-center justify-center bg-gradient-to-br relative",
              gradientClass
            )}>
              <FolderCode className="h-12 w-12 text-muted-foreground/30 group-hover:scale-110 transition-transform duration-300" />
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }} />
              </div>
            </div>
          )}
          
          {/* Badges overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <Badge variant="outline" className={cn("category-badge backdrop-blur-sm bg-background/80", getCategoryClass(project.category))}>
              {project.category}
            </Badge>
            {project.featured && (
              <Badge variant="default" className="gap-1 backdrop-blur-sm">
                <Sparkles className="h-3 w-3" />
                Featured
              </Badge>
            )}
          </div>
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-1 group-hover:text-accent-color transition-colors">{project.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="pb-3">
          <CardDescription className="line-clamp-2 mb-4 text-sm">
            {project.summary}
          </CardDescription>
          
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {project.metrics.slice(0, 2).map((metric) => (
              <div key={metric.label} className="bg-muted/50 rounded-md p-2 group-hover:bg-muted/70 transition-colors">
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

        <CardFooter className="text-xs text-muted-foreground pt-0">
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
