'use client';

import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Calendar, Award, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Education } from '@/data/types';

interface EducationCardProps {
  education: Education;
}

export function EducationCard({ education }: EducationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group hover:shadow-lg hover:border-accent-color/50 transition-all h-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Institution Logo */}
            <div className="shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-border/50 flex items-center justify-center overflow-hidden bg-white p-1 shadow-sm">
                {education.logo ? (
                  <img
                    src={education.logo}
                    alt={`${education.institution} logo`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground/50" />
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-xl">{education.institution}</CardTitle>
              </div>
              <CardDescription className="text-base font-medium text-foreground/80">
                {education.degree} in {education.field}
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {education.location}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {education.startYear} - {education.endYear}
            </div>
            {education.gpa && (
              <div className="flex items-center gap-1">
                <Award className="h-3 w-3" />
                GPA: {education.gpa}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Relevant Coursework */}
          {education.relevantCoursework && education.relevantCoursework.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-semibold">Relevant Coursework</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {education.relevantCoursework.map((course) => (
                  <Badge key={course} variant="secondary" className="text-xs">
                    {course}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {education.achievements && education.achievements.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-semibold">Achievements</h4>
              </div>
              <ul className="space-y-1">
                {education.achievements.map((achievement, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Projects */}
          {education.projects && education.projects.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Notable Projects</h4>
              <div className="space-y-3">
                {education.projects.map((project, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg p-3">
                    <p className="text-sm font-medium mb-1">{project.name}</p>
                    <p className="text-xs text-muted-foreground">{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
