'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowUpRight, Building2, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Experience } from '@/data/types';
import { cn } from '@/lib/utils';

interface ExperienceCardProps {
  experience: Experience;
  index: number;
}

// Helper function to render text with clickable URLs
const renderTextWithLinks = (text: string) => {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-6 sm:pl-8 md:pl-12 pb-12 last:pb-0"
    >
      {/* Timeline dot */}
      <div className={cn(
        "absolute left-0 top-6 w-3 h-3 rounded-full border-2 border-background z-10 ring-1 ring-border transition-colors duration-300",
        experience.current ? "bg-accent-color ring-accent-color/50 shadow-[0_0_8px_var(--accent-color)]" : "bg-muted-foreground/30 group-hover:bg-accent-color/50 group-hover:ring-accent-color/30"
      )} />

      <Card className="group relative overflow-hidden border-border/50 bg-card/50 hover:bg-card hover:border-accent-color/30 transition-all duration-300 hover:shadow-[0_4px_20px_-12px_var(--accent-color)]">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Company Icon Placeholder */}
            <div className="shrink-0">
              <div className={cn(
                "w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-border/50 flex items-center justify-center transition-all duration-300 overflow-hidden group-hover:border-accent-color/30 group-hover:shadow-sm",
                experience.logo ? "bg-white p-1" : "bg-secondary/50 text-muted-foreground/50 group-hover:text-accent-color group-hover:bg-accent-color/10"
              )}>
                {experience.logo ? (
                  <img
                    src={experience.logo}
                    alt={`${experience.company} logo`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-accent-color transition-colors duration-300">
                      {experience.role}
                    </h3>
                    {experience.current && (
                      <Badge variant="secondary" className="bg-accent-color/15 text-accent-color border border-accent-color/20 text-[10px] px-2 py-0.5 h-5 font-medium tracking-wide uppercase shadow-[0_0_10px_-4px_var(--accent-color)]">
                        Current
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-base font-medium text-muted-foreground">
                    <span className="text-foreground/80">{experience.company}</span>
                    {experience.companyInfo?.website && (
                      <a
                        href={experience.companyInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-muted-foreground/50 hover:text-accent-color transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1 text-xs sm:text-sm text-muted-foreground/70 font-medium mt-1 sm:mt-0">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-accent-color/70" />
                    <span>{formatDate(experience.startDate)} — {formatDate(experience.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-accent-color/70" />
                    <span>{experience.location}</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {renderTextWithLinks(experience.summary)}
              </p>

              {/* Key Achievements */}
              {experience.highlights && experience.highlights.length > 0 && (
                <div className="space-y-3 pt-1">
                  <h4 className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Key Achievements</h4>
                  <ul className="grid gap-3">
                    {experience.highlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        className="group/item flex gap-3 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary/40 mt-0.5 shrink-0 group-hover/item:text-primary transition-colors" />
                        <div className="space-y-1.5">
                          <span className="block text-foreground/90">
                            {renderTextWithLinks(highlight.text)}
                          </span>
                          {highlight.metric && (
                            <span className="inline-flex items-center text-xs font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
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
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {experience.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="bg-background/50 text-muted-foreground font-normal border-border/60 hover:border-border hover:bg-secondary/40 transition-colors"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
