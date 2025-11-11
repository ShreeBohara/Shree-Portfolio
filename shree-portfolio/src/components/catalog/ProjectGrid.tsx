'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ProjectCard } from './ProjectCard';
import { FilterBar } from './FilterBar';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store/ui-store';
import { Project, SortOption, GroupOption } from '@/data/types';
import { projects as allProjects } from '@/data/portfolio';

export function ProjectGrid() {
  const { viewMode } = useUIStore();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [groupBy, setGroupBy] = useState<GroupOption>('none');

  // Filter projects
  const filteredProjects = useMemo(() => {
    let filtered = allProjects;

    // Category filter
    if (!selectedCategories.includes('all')) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category.toLowerCase().replace(/[/\s]/g, '-')));
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.summary.toLowerCase().includes(query) ||
        p.technologies.some(t => t.toLowerCase().includes(query)) ||
        p.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [selectedCategories, searchQuery]);

  // Sort projects
  const sortedProjects = useMemo(() => {
    const sorted = [...filteredProjects];
    
    switch (sortBy) {
      case 'recent':
        sorted.sort((a, b) => b.year - a.year || a.sortOrder - b.sortOrder);
        break;
      case 'name':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'impact':
        sorted.sort((a, b) => b.metrics.length - a.metrics.length || a.sortOrder - b.sortOrder);
        break;
    }

    return sorted;
  }, [filteredProjects, sortBy]);

  // Group projects
  const groupedProjects = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Projects': sortedProjects };
    }

    const groups: Record<string, Project[]> = {};

    sortedProjects.forEach(project => {
      let groupKey: string;
      if (groupBy === 'category') {
        groupKey = project.category;
      } else { // year
        groupKey = project.year.toString();
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(project);
    });

    // Sort group keys
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      if (groupBy === 'year') {
        return parseInt(b) - parseInt(a); // Recent years first
      }
      return a.localeCompare(b); // Alphabetical for categories
    });

    const sortedGroups: Record<string, Project[]> = {};
    sortedKeys.forEach(key => {
      sortedGroups[key] = groups[key];
    });

    return sortedGroups;
  }, [sortedProjects, groupBy]);

  return (
    <div className="h-full flex flex-col">
      {/* Filter bar */}
      <FilterBar
        selectedCategories={selectedCategories}
        onCategoryChange={setSelectedCategories}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        groupBy={groupBy}
        onGroupChange={setGroupBy}
      />

      {/* Projects */}
      <div className="flex-1 overflow-y-auto p-4">
        {Object.keys(groupedProjects).length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">No projects match your filters</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategories(['all']);
                  setSearchQuery('');
                }}
              >
                Clear filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedProjects).map(([groupName, projects]) => (
              <div key={groupName}>
                {groupBy !== 'none' && (
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    {groupName}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({projects.length})
                    </span>
                  </h2>
                )}
                
                <div className={viewMode === 'grid' 
                  ? "grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                  : "space-y-3"
                }>
                  <AnimatePresence mode="popLayout">
                    {projects.map(project => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        viewMode={viewMode}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
