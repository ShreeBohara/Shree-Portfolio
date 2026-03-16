'use client';

import { useMemo, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ProjectCard } from './ProjectCard';
import { projects as allProjects } from '@/data/portfolio';
import { SkeletonGrid } from '@/components/ui/skeleton-card';
import { FolderOpen } from 'lucide-react';

export function ProjectGrid() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const displayProjects = useMemo(
    () => [...allProjects].sort((a, b) => b.year - a.year || a.sortOrder - b.sortOrder),
    []
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <SkeletonGrid count={6} variant="project" viewMode="grid" />
        ) : displayProjects.length === 0 ? (
          <motion.div
            className="flex items-center justify-center h-64"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                <FolderOpen className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p className="text-muted-foreground max-w-sm">
                Projects will appear here once they are added.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {displayProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  viewMode="grid"
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
