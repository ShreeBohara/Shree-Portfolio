'use client';

import { motion } from 'framer-motion';
import { Briefcase, MapPin, Calendar, ExternalLink, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Experience } from '@/data/types';

interface ExperienceCardProps {
  experience: Experience;
  index: number;
}

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

export function ExperienceCard({ experience, index }: ExperienceCardProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Present';
    const [year, month] = dateStr.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      {/* Timeline dot */}
      <div className="absolute left-0 top-8 w-3 h-3 rounded-full bg-primary border-4 border-background z-10" />

      {/* Timeline line */}
      {index !== 0 && (
        <div className="absolute left-[5px] top-0 w-0.5 h-8 bg-border" />
      )}

      <Card className="ml-8 group hover:shadow-lg hover:border-accent-color/50 transition-all">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="h-4 w-4 text-accent-color" />
                {experience.current && (
                  <Badge variant="default" className="text-xs bg-accent-color hover:bg-accent-color/90 border-0">Current</Badge>
                )}
              </div>
              <CardTitle className="text-xl mb-1">{experience.role}</CardTitle>
              <CardDescription className="text-base font-medium flex items-center gap-2">
                <span>{experience.company}</span>
                {experience.companyInfo?.website && (
                  <a
                    href={experience.companyInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-accent-color hover:text-accent-color/80 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {experience.location}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
            </div>
            <Badge variant="outline" className="text-xs">
              {experience.type}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Summary */}
          <p className="text-sm text-muted-foreground">{renderTextWithLinks(experience.summary)}</p>

          {/* Highlights */}
          {experience.highlights && experience.highlights.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-semibold">Key Achievements</h4>
              </div>
              <ul className="space-y-2">
                {experience.highlights.map((highlight, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <div className="flex-1">
                      <span className="text-foreground">{renderTextWithLinks(highlight.text)}</span>
                      {highlight.metric && (
                        <span className="ml-2 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {highlight.metric}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technologies */}
          {experience.technologies && experience.technologies.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Technologies Used</h4>
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Company Info */}
          {experience.companyInfo && (experience.companyInfo.industry || experience.companyInfo.size) && (
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-2 border-t">
              {experience.companyInfo.industry && (
                <span>{experience.companyInfo.industry}</span>
              )}
              {experience.companyInfo.size && (
                <span>• {experience.companyInfo.size}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
