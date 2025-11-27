'use client';

import { motion } from 'framer-motion';
import { MapPin, Sparkles, ArrowRight, Calendar, Mail, Linkedin, Github, ExternalLink, Download, Code2, Briefcase, GraduationCap, Heart, Quote } from 'lucide-react';
import { personalInfo, projects, experiences, education } from '@/data/portfolio';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function AboutContent() {
  const currentRole = experiences.find(e => e.current);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] bg-accent-color/10" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] bg-accent-color/5" />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div
            className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-full overflow-hidden ring-4 ring-accent-color/20 shadow-2xl">
                <Image
                  src="/profile-image.jpg"
                  alt={personalInfo.name}
                  width={208}
                  height={208}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>

            </motion.div>

            {/* Hero Text */}
            <div className="flex-1 text-center md:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
              >
                {personalInfo.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl sm:text-2xl text-accent-color font-medium mb-3"
              >
                <Link href="/browse?section=experience" className="hover:opacity-80 transition-opacity cursor-pointer">
                  {personalInfo.title}
                  {currentRole && (
                    <span className="text-muted-foreground"> @ {currentRole.company}</span>
                  )}
                </Link>
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-muted-foreground mb-6"
              >
                {personalInfo.tagline}
              </motion.p>

              {/* Quick stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-center md:justify-start gap-4 sm:gap-6 flex-wrap mb-6"
              >
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-accent-color" />
                  <span>{personalInfo.location}</span>
                </div>
                <Link href="/browse?section=education" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent-color transition-colors cursor-pointer">
                  <GraduationCap className="h-4 w-4 text-accent-color" />
                  <span>USC CS '26</span>
                </Link>
                <Link href="/browse?section=projects" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent-color transition-colors cursor-pointer">
                  <Code2 className="h-4 w-4 text-accent-color" />
                  <span>5+ Projects</span>
                </Link>

              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center justify-center md:justify-start gap-3 flex-wrap"
              >
                <Button asChild className="bg-accent-color hover:bg-accent-color/90 text-white">
                  <a href={personalInfo.links.calendar} target="_blank" rel="noopener noreferrer">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book a Call
                  </a>
                </Button>
                <Button variant="outline" asChild className="hover:border-accent-color/50 hover:text-accent-color">
                  <a href={personalInfo.links.resume.pdf} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    Resume
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section >

      {/* Bio Section */}
      < motion.section
        className="py-16 px-6"
        {...fadeInUp}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Heart className="h-7 w-7 text-accent-color" />
            About Me
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-lg">
              {personalInfo.bio}
            </p>
          </div>
        </div>
      </motion.section >

      {/* Skills Section - Visual Grid */}
      < motion.section
        className="py-16 px-6 bg-muted/30"
        {...fadeInUp}
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Sparkles className="h-7 w-7 text-accent-color" />
            Skills & Technologies
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {personalInfo.skills.map((skillCategory, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-5 h-full hover:border-accent-color/50 transition-colors group">
                  <h3 className="text-sm font-semibold text-accent-color mb-3 uppercase tracking-wider">
                    {skillCategory.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.items.map((skill, skillIndex) => (
                      <Badge
                        key={skillIndex}
                        variant="secondary"
                        className="text-xs group-hover:bg-accent-color/10 transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section >

      {/* Experience Timeline */}
      < motion.section
        className="py-16 px-6"
        {...fadeInUp}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Briefcase className="h-7 w-7 text-accent-color" />
            Experience
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-accent-color via-accent-color/50 to-transparent" />

            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative pl-8"
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-0 top-2 w-4 h-4 rounded-full border-2 border-background ${exp.current ? 'bg-accent-color ring-4 ring-accent-color/20' : 'bg-muted-foreground/50'}`} />

                  <Card className="p-6 hover:border-accent-color/30 transition-all group">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Logo */}
                      {exp.logo && (
                        <div className="w-12 h-12 rounded-lg border bg-white p-1.5 shrink-0">
                          <Image
                            src={exp.logo}
                            alt={exp.company}
                            width={48}
                            height={48}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="text-lg font-semibold group-hover:text-accent-color transition-colors">
                              {exp.role}
                            </h3>
                            <p className="text-accent-color font-medium">{exp.company}</p>
                          </div>
                          {exp.current && (
                            <Badge className="bg-accent-color/15 text-accent-color border border-accent-color/20 shrink-0">
                              Current
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {formatDate(exp.startDate)} - {formatDate(exp.endDate)} · {exp.location}
                        </p>

                        <ul className="space-y-2">
                          {exp.highlights.slice(0, 3).map((highlight, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-accent-color mt-1">•</span>
                              <span>
                                {highlight.text}
                                {highlight.metric && (
                                  <span className="text-accent-color font-medium ml-1">({highlight.metric})</span>
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section >

      {/* Education Section */}
      < motion.section
        className="py-16 px-6 bg-muted/30"
        {...fadeInUp}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <GraduationCap className="h-7 w-7 text-accent-color" />
            Education
          </h2>

          <div className="grid gap-6">
            {education.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:border-accent-color/30 transition-all group">
                  <div className="flex gap-4">
                    {edu.logo && (
                      <div className="w-14 h-14 rounded-xl border bg-white p-1.5 shrink-0">
                        <Image
                          src={edu.logo}
                          alt={edu.institution}
                          width={56}
                          height={56}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold group-hover:text-accent-color transition-colors">
                        {edu.institution}
                      </h3>
                      <p className="text-accent-color font-medium">
                        {edu.degree} in {edu.field}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {edu.startYear} - {edu.endYear} · {edu.location}
                        {edu.gpa && <span className="ml-2">· GPA: {edu.gpa}</span>}
                      </p>

                      {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {edu.relevantCoursework.slice(0, 5).map((course, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {course}
                            </Badge>
                          ))}
                          {edu.relevantCoursework.length > 5 && (
                            <Badge variant="secondary" className="text-xs">
                              +{edu.relevantCoursework.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section >

      {/* Featured Projects */}
      < motion.section
        className="py-16 px-6"
        {...fadeInUp}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Code2 className="h-7 w-7 text-accent-color" />
              Featured Projects
            </h2>
            <Button variant="ghost" asChild className="hover:text-accent-color">
              <Link href="/browse?section=projects">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {projects.filter(p => p.featured).slice(0, 4).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/browse?section=projects`}>
                  <Card className="p-5 h-full hover:border-accent-color/50 hover:shadow-lg transition-all group cursor-pointer">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold group-hover:text-accent-color transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {project.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {project.summary}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section >

      {/* Contact Section */}
      < motion.section
        className="py-16 px-6 bg-muted/30"
        {...fadeInUp}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            I'm always open to discussing new opportunities, interesting projects, or just having a chat about technology.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button asChild size="lg" className="bg-accent-color hover:bg-accent-color/90 text-white">
              <a href={personalInfo.links.calendar} target="_blank" rel="noopener noreferrer">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule a Call
              </a>
            </Button>
            <Button variant="outline" asChild size="lg" className="hover:border-accent-color/50 hover:text-accent-color">
              <a href={`mailto:${personalInfo.links.email}`}>
                <Mail className="h-5 w-5 mr-2" />
                Email Me
              </a>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <a
              href={personalInfo.links.github}
              target="_blank"
              rel="noopener noreferrer me"
              className="p-3 rounded-full bg-muted hover:bg-accent-color/10 hover:text-accent-color transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={personalInfo.links.linkedin}
              target="_blank"
              rel="noopener noreferrer me"
              className="p-3 rounded-full bg-muted hover:bg-accent-color/10 hover:text-accent-color transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </motion.section >

      {/* Footer */}
      < Footer />
    </div >
  );
}

