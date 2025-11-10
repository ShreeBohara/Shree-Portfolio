'use client';

import { Search, LayoutGrid, List, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUIStore } from '@/store/ui-store';
import { SortOption, GroupOption } from '@/data/types';

interface FilterBarProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  groupBy: GroupOption;
  onGroupChange: (group: GroupOption) => void;
}

const categories = [
  { id: 'all', label: 'All', count: 3 },
  { id: 'ai-ml', label: 'AI/ML', count: 2 },
  { id: 'full-stack', label: 'Full-Stack', count: 1 },
];

export function FilterBar({
  selectedCategories,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  groupBy,
  onGroupChange,
}: FilterBarProps) {
  const { viewMode, setViewMode } = useUIStore();

  const toggleCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      onCategoryChange(['all']);
    } else {
      const newCategories = selectedCategories.includes(categoryId)
        ? selectedCategories.filter(c => c !== categoryId)
        : [...selectedCategories.filter(c => c !== 'all'), categoryId];
      
      onCategoryChange(newCategories.length === 0 ? ['all'] : newCategories);
    }
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
      <div className="p-4 space-y-4">
        {/* Search and view toggle */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* View mode toggle */}
          <div className="flex gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 px-3"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategories.includes(category.id) ? "default" : "outline"}
              className="cursor-pointer hover:bg-accent"
              onClick={() => toggleCategory(category.id)}
            >
              {category.label} ({category.count})
            </Badge>
          ))}
        </div>

        {/* Sort and group controls */}
        <div className="flex gap-2 flex-wrap">
          <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="impact">Highest Impact</SelectItem>
            </SelectContent>
          </Select>

          <Select value={groupBy} onValueChange={(value) => onGroupChange(value as GroupOption)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Grouping</SelectItem>
              <SelectItem value="category">By Category</SelectItem>
              <SelectItem value="year">By Year</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex-1" />
          
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Clear filters
          </Button>
        </div>
      </div>
    </div>
  );
}
