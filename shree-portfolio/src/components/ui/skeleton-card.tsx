'use client';

import { cn } from '@/lib/utils';
import { Skeleton } from './skeleton';
import { Card, CardContent, CardFooter, CardHeader } from './card';

interface SkeletonCardProps {
  variant?: 'project' | 'experience' | 'education';
  viewMode?: 'grid' | 'list';
}

export function SkeletonCard({ variant = 'project', viewMode = 'grid' }: SkeletonCardProps) {
  if (variant === 'project') {
    if (viewMode === 'list') {
      return (
        <Card className="overflow-hidden">
          <div className="flex items-center p-4">
            {/* Thumbnail skeleton */}
            <Skeleton className="hidden sm:block w-20 h-20 rounded-lg mr-4 shrink-0" />
            
            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center gap-4 mt-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>

            {/* Metrics */}
            <div className="hidden lg:flex items-center gap-6 px-4">
              <div className="text-center space-y-1">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="text-center space-y-1">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>

            <Skeleton className="h-4 w-4" />
          </div>
        </Card>
      );
    }

    // Grid view
    return (
      <Card className="h-full overflow-hidden">
        {/* Thumbnail Section */}
        <Skeleton className="h-40 w-full rounded-none" />

        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        
        <CardContent className="pb-3 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/30 rounded-md p-2 space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-12" />
            </div>
            <div className="bg-muted/30 rounded-md p-2 space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-12" />
            </div>
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-3 w-8" />
          </div>
        </CardFooter>
      </Card>
    );
  }

  if (variant === 'experience') {
    return (
      <div className="relative pl-6 sm:pl-8 md:pl-12 pb-12 last:pb-0">
        {/* Timeline dot */}
        <Skeleton className="absolute left-0 top-6 w-3 h-3 rounded-full" />

        <Card className="overflow-hidden">
          <div className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Company Icon */}
              <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl shrink-0" />

              <div className="flex-1 min-w-0 space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>

                {/* Highlights */}
                <div className="space-y-3">
                  <Skeleton className="h-3 w-24" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-11/12" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                  <Skeleton className="h-5 w-18 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (variant === 'education') {
    return (
      <Card className="overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex gap-4 sm:gap-6">
            {/* Logo */}
            <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl shrink-0" />

            <div className="flex-1 min-w-0 space-y-3">
              {/* Header */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>

              {/* Coursework */}
              <div className="flex flex-wrap gap-1.5">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-28 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return null;
}

// Grid of skeleton cards for loading state
export function SkeletonGrid({ 
  count = 6, 
  variant = 'project',
  viewMode = 'grid' 
}: { 
  count?: number; 
  variant?: 'project' | 'experience' | 'education';
  viewMode?: 'grid' | 'list';
}) {
  return (
    <div className={cn(
      variant === 'project' && viewMode === 'grid' 
        ? "grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
        : variant === 'project' && viewMode === 'list'
        ? "space-y-3"
        : variant === 'experience'
        ? "relative before:absolute before:left-[5px] sm:before:left-[11px] md:before:left-[23px] before:top-6 before:bottom-6 before:w-px before:bg-border"
        : "space-y-4"
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} variant={variant} viewMode={viewMode} />
      ))}
    </div>
  );
}


