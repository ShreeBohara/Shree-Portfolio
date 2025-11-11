import { Project, Experience, Education, PersonalInfo } from '@/data/types';

export interface ContentChunk {
  id: string;
  content: string;
  metadata: {
    type: 'project' | 'experience' | 'education' | 'skill' | 'bio' | 'faq' | 'story' | 'philosophy' | 'interests' | 'workstyle';
    itemId: string;
    title: string;
    year?: number;
    category?: string;
    tags?: string[];
  };
}

/**
 * Chunks a project into multiple semantic chunks
 */
export function chunkProject(project: Project): ContentChunk[] {
  const chunks: ContentChunk[] = [];
  const baseId = `project-${project.id}`;

  // Chunk 1: Title and Summary
  chunks.push({
    id: `${baseId}-summary`,
    content: `Project: ${project.title}\n\nSummary: ${project.summary}`,
    metadata: {
      type: 'project',
      itemId: project.id,
      title: project.title,
      year: project.year,
      category: project.category,
      tags: project.tags,
    },
  });

  // Chunk 2: Problem, Approach, Impact
  chunks.push({
    id: `${baseId}-details`,
    content: `Project: ${project.title}\n\nProblem: ${project.problem}\n\nApproach: ${project.approach}\n\nImpact: ${project.impact}`,
    metadata: {
      type: 'project',
      itemId: project.id,
      title: project.title,
      year: project.year,
      category: project.category,
      tags: project.tags,
    },
  });

  // Chunk 3: Metrics
  if (project.metrics.length > 0) {
    const metricsText = project.metrics
      .map((m) => `${m.label}: ${m.value}`)
      .join('\n');
    chunks.push({
      id: `${baseId}-metrics`,
      content: `Project: ${project.title}\n\nKey Metrics:\n${metricsText}`,
      metadata: {
        type: 'project',
        itemId: project.id,
        title: project.title,
        year: project.year,
        category: project.category,
        tags: project.tags,
      },
    });
  }

  // Chunk 4: Technologies and Role
  chunks.push({
    id: `${baseId}-tech`,
    content: `Project: ${project.title}\n\nTechnologies: ${project.technologies.join(', ')}\n\nMy Role: ${project.myRole}`,
    metadata: {
      type: 'project',
      itemId: project.id,
      title: project.title,
      year: project.year,
      category: project.category,
      tags: project.tags,
    },
  });

  return chunks;
}

/**
 * Chunks an experience into multiple semantic chunks
 */
export function chunkExperience(experience: Experience): ContentChunk[] {
  const chunks: ContentChunk[] = [];
  const baseId = `experience-${experience.id}`;

  // Chunk 1: Role Summary
  chunks.push({
    id: `${baseId}-summary`,
    content: `Role: ${experience.role} at ${experience.company}\n\n${experience.summary}`,
    metadata: {
      type: 'experience',
      itemId: experience.id,
      title: `${experience.role} at ${experience.company}`,
      year: parseInt(experience.startDate.split('-')[0]),
      tags: experience.technologies,
    },
  });

  // Chunk 2-N: Individual Highlights
  experience.highlights.forEach((highlight, index) => {
    const highlightText = highlight.metric
      ? `${highlight.text} (${highlight.metric})`
      : highlight.text;
    
    chunks.push({
      id: `${baseId}-highlight-${index}`,
      content: `Role: ${experience.role} at ${experience.company}\n\nAchievement: ${highlightText}`,
      metadata: {
        type: 'experience',
        itemId: experience.id,
        title: `${experience.role} at ${experience.company}`,
        year: parseInt(experience.startDate.split('-')[0]),
        tags: experience.technologies,
      },
    });
  });

  // Chunk: Technologies
  if (experience.technologies.length > 0) {
    chunks.push({
      id: `${baseId}-technologies`,
      content: `Role: ${experience.role} at ${experience.company}\n\nTechnologies Used: ${experience.technologies.join(', ')}`,
      metadata: {
        type: 'experience',
        itemId: experience.id,
        title: `${experience.role} at ${experience.company}`,
        year: parseInt(experience.startDate.split('-')[0]),
        tags: experience.technologies,
      },
    });
  }

  return chunks;
}

/**
 * Chunks education into semantic chunks
 */
export function chunkEducation(education: Education): ContentChunk[] {
  const chunks: ContentChunk[] = [];
  const baseId = `education-${education.id}`;

  // Chunk 1: Degree and Institution
  const degreeText = `${education.degree} in ${education.field} from ${education.institution}`;
  chunks.push({
    id: `${baseId}-degree`,
    content: `Education: ${degreeText}\n\nLocation: ${education.location}\n\nYears: ${education.startYear} - ${education.endYear}${education.gpa ? `\n\nGPA: ${education.gpa}` : ''}`,
    metadata: {
      type: 'education',
      itemId: education.id,
      title: degreeText,
      year: education.endYear,
    },
  });

  // Chunk 2: Coursework
  if (education.relevantCoursework.length > 0) {
    chunks.push({
      id: `${baseId}-coursework`,
      content: `Education: ${degreeText}\n\nRelevant Coursework: ${education.relevantCoursework.join(', ')}`,
      metadata: {
        type: 'education',
        itemId: education.id,
        title: degreeText,
        year: education.endYear,
      },
    });
  }

  // Chunk 3: Achievements
  if (education.achievements && education.achievements.length > 0) {
    chunks.push({
      id: `${baseId}-achievements`,
      content: `Education: ${degreeText}\n\nAchievements:\n${education.achievements.map(a => `• ${a}`).join('\n')}`,
      metadata: {
        type: 'education',
        itemId: education.id,
        title: degreeText,
        year: education.endYear,
      },
    });
  }

  // Chunk 4: Projects
  if (education.projects && education.projects.length > 0) {
    education.projects.forEach((project, index) => {
      chunks.push({
        id: `${baseId}-project-${index}`,
        content: `Education: ${degreeText}\n\nAcademic Project: ${project.name}\n\n${project.description}`,
        metadata: {
          type: 'education',
          itemId: education.id,
          title: degreeText,
          year: education.endYear,
        },
      });
    });
  }

  return chunks;
}

/**
 * Chunks personal info (bio, skills, career story, FAQs, philosophy, interests, work style)
 */
export function chunkPersonalInfo(personalInfo: PersonalInfo): ContentChunk[] {
  const chunks: ContentChunk[] = [];

  // === BASIC INFO ===

  // Bio chunk
  chunks.push({
    id: 'personal-bio',
    content: `About Shree: ${personalInfo.bio}\n\nTitle: ${personalInfo.title}\n\nTagline: ${personalInfo.tagline}\n\nLocation: ${personalInfo.location}\n\nAvailability: ${personalInfo.availability.message || personalInfo.availability.status}`,
    metadata: {
      type: 'bio',
      itemId: 'personal-info',
      title: 'About Shree Bohara',
    },
  });

  // Skills by category
  personalInfo.skills.forEach((skillCategory, index) => {
    chunks.push({
      id: `skills-${skillCategory.category.toLowerCase().replace(/\s+/g, '-')}`,
      content: `Technical Skills - ${skillCategory.category}:\n\n${skillCategory.items.join(', ')}`,
      metadata: {
        type: 'skill',
        itemId: 'skills',
        title: skillCategory.category,
        tags: skillCategory.items,
      },
    });
  });

  // All skills combined (for general queries)
  const allSkills = personalInfo.skills.flatMap(cat => cat.items);
  chunks.push({
    id: 'skills-all',
    content: `Technical Skills:\n\n${personalInfo.skills.map(cat => `${cat.category}: ${cat.items.join(', ')}`).join('\n\n')}`,
    metadata: {
      type: 'skill',
      itemId: 'skills',
      title: 'All Technical Skills',
      tags: allSkills,
    },
  });

  // === CAREER STORY ===

  if (personalInfo.careerStory) {
    // Background
    chunks.push({
      id: 'story-background',
      content: `Shree's Background:\n\n${personalInfo.careerStory.background}`,
      metadata: {
        type: 'story',
        itemId: 'career-story',
        title: "Shree's Background",
        tags: ['background', 'origin', 'pune', 'india'],
      },
    });

    // Inspiration
    chunks.push({
      id: 'story-inspiration',
      content: `How Shree Got Into Computer Science:\n\n${personalInfo.careerStory.inspiration}`,
      metadata: {
        type: 'story',
        itemId: 'career-story',
        title: 'Inspiration for CS',
        tags: ['inspiration', 'motivation', 'origin story'],
      },
    });

    // Key moments (each as separate chunk for better retrieval)
    personalInfo.careerStory.keyMoments.forEach((moment, index) => {
      const momentTitles = [
        'First Project - Calculator',
        'First Hackathon - NIT-B Runner-Up',
        'QuinStreet Pond - Fastest MVP'
      ];
      chunks.push({
        id: `story-moment-${index}`,
        content: `Shree's Key Career Moment:\n\n${moment}`,
        metadata: {
          type: 'story',
          itemId: 'career-story',
          title: momentTitles[index] || `Key Moment ${index + 1}`,
          tags: ['milestone', 'achievement', 'journey'],
        },
      });
    });

    // Why USC
    chunks.push({
      id: 'story-usc',
      content: `Why Shree Chose USC:\n\n${personalInfo.careerStory.whyUSC}`,
      metadata: {
        type: 'story',
        itemId: 'career-story',
        title: 'Why USC',
        tags: ['education', 'usc', 'graduate school', 'alumni network'],
      },
    });

    // What drives you
    chunks.push({
      id: 'story-drive',
      content: `What Drives Shree in Tech:\n\n${personalInfo.careerStory.whatDrivesYou}`,
      metadata: {
        type: 'story',
        itemId: 'career-story',
        title: 'What Drives Shree',
        tags: ['motivation', 'passion', 'accessibility', 'impact'],
      },
    });
  }

  // === TECHNICAL PHILOSOPHY ===

  if (personalInfo.technicalPhilosophy) {
    // Approach
    chunks.push({
      id: 'philosophy-approach',
      content: `Shree's Approach to Building Software:\n\n${personalInfo.technicalPhilosophy.approach}`,
      metadata: {
        type: 'philosophy',
        itemId: 'technical-philosophy',
        title: 'Software Development Approach',
        tags: ['methodology', 'process', 'system design', 'architecture'],
      },
    });

    // What excites you
    chunks.push({
      id: 'philosophy-excitement',
      content: `What Excites Shree Most About Development:\n\n${personalInfo.technicalPhilosophy.whatExcitesYou}`,
      metadata: {
        type: 'philosophy',
        itemId: 'technical-philosophy',
        title: 'What Excites Shree in Development',
        tags: ['passion', 'system design', 'architecture'],
      },
    });

    // Favorite tools
    const toolsText = personalInfo.technicalPhilosophy.favoriteTools
      .map(tool => `• ${tool.name}: ${tool.reason}`)
      .join('\n');
    chunks.push({
      id: 'philosophy-tools',
      content: `Shree's Favorite Technologies and Tools:\n\n${toolsText}`,
      metadata: {
        type: 'philosophy',
        itemId: 'technical-philosophy',
        title: 'Favorite Tools & Technologies',
        tags: personalInfo.technicalPhilosophy.favoriteTools.map(t => t.name.toLowerCase()),
      },
    });

    // Good project
    chunks.push({
      id: 'philosophy-good-project',
      content: `What Makes a Good Project According to Shree:\n\n${personalInfo.technicalPhilosophy.goodProject}`,
      metadata: {
        type: 'philosophy',
        itemId: 'technical-philosophy',
        title: 'What Makes a Good Project',
        tags: ['quality', 'impact', 'methodology'],
      },
    });

    // AI thoughts
    chunks.push({
      id: 'philosophy-ai',
      content: `Shree's Thoughts on AI/ML in Software Development:\n\n${personalInfo.technicalPhilosophy.aiThoughts}`,
      metadata: {
        type: 'philosophy',
        itemId: 'technical-philosophy',
        title: 'Views on AI in Development',
        tags: ['ai', 'ml', 'automation', 'guardrails'],
      },
    });
  }

  // === INTERESTS & HOBBIES ===

  if (personalInfo.interests) {
    // Hobbies
    if (personalInfo.interests.hobbies.length > 0) {
      chunks.push({
        id: 'interests-hobbies',
        content: `Shree's Hobbies and Interests Outside of Coding:\n\n${personalInfo.interests.hobbies.map(h => `• ${h}`).join('\n')}`,
        metadata: {
          type: 'interests',
          itemId: 'personal-interests',
          title: 'Hobbies & Interests',
          tags: ['hobbies', 'personal', 'interests'],
        },
      });
    }

    // Books
    if (personalInfo.interests.books.length > 0) {
      chunks.push({
        id: 'interests-books',
        content: `Shree's Favorite Books:\n\n${personalInfo.interests.books.join('\n\n')}`,
        metadata: {
          type: 'interests',
          itemId: 'personal-interests',
          title: 'Favorite Books',
          tags: ['reading', 'books', 'learning'],
        },
      });
    }

    // Podcasts
    if (personalInfo.interests.podcasts.length > 0) {
      chunks.push({
        id: 'interests-podcasts',
        content: `Shree's Favorite Podcasts:\n\n${personalInfo.interests.podcasts.join('\n\n')}`,
        metadata: {
          type: 'interests',
          itemId: 'personal-interests',
          title: 'Favorite Podcasts',
          tags: ['podcasts', 'learning', 'tech'],
        },
      });
    }

    // YouTube
    if (personalInfo.interests.youtube.length > 0) {
      chunks.push({
        id: 'interests-youtube',
        content: `Shree's Favorite YouTube Channels:\n\n${personalInfo.interests.youtube.join('\n\n')}`,
        metadata: {
          type: 'interests',
          itemId: 'personal-interests',
          title: 'Favorite YouTube Channels',
          tags: ['youtube', 'learning', 'tech'],
        },
      });
    }

    // Free time
    if (personalInfo.interests.freeTime) {
      chunks.push({
        id: 'interests-freetime',
        content: `How Shree Spends Free Time:\n\n${personalInfo.interests.freeTime}`,
        metadata: {
          type: 'interests',
          itemId: 'personal-interests',
          title: 'How Shree Unwinds',
          tags: ['personal', 'hobbies', 'wellness'],
        },
      });
    }
  }

  // === FAQs ===

  if (personalInfo.faqs) {
    // Group FAQs by category for better context
    const faqsByCategory = {
      personal: personalInfo.faqs.filter(f => f.category === 'personal'),
      career: personalInfo.faqs.filter(f => f.category === 'career'),
      technical: personalInfo.faqs.filter(f => f.category === 'technical'),
      hiring: personalInfo.faqs.filter(f => f.category === 'hiring'),
    };

    // Create chunks for each FAQ
    personalInfo.faqs.forEach((faq, index) => {
      chunks.push({
        id: `faq-${index}`,
        content: `Question: ${faq.question}\n\nAnswer: ${faq.answer}`,
        metadata: {
          type: 'faq',
          itemId: 'faqs',
          title: faq.question,
          category: faq.category,
          tags: [faq.category, 'faq', 'common questions'],
        },
      });
    });
  }

  // === WORK STYLE ===

  if (personalInfo.workStyle) {
    // Preferences
    chunks.push({
      id: 'workstyle-preferences',
      content: `Shree's Work Style and Preferences:\n\n${personalInfo.workStyle.preferences}`,
      metadata: {
        type: 'workstyle',
        itemId: 'work-style',
        title: 'Work Style & Preferences',
        tags: ['work style', 'collaboration', 'methodology'],
      },
    });

    // Values
    chunks.push({
      id: 'workstyle-values',
      content: `Important Workplace Values for Shree:\n\n${personalInfo.workStyle.values.map(v => `• ${v}`).join('\n')}`,
      metadata: {
        type: 'workstyle',
        itemId: 'work-style',
        title: 'Workplace Values',
        tags: ['values', 'culture', 'teamwork'],
      },
    });

    // Handling challenges
    chunks.push({
      id: 'workstyle-challenges',
      content: `How Shree Handles Challenges and Setbacks:\n\n${personalInfo.workStyle.handlingChallenges}`,
      metadata: {
        type: 'workstyle',
        itemId: 'work-style',
        title: 'Handling Challenges',
        tags: ['problem solving', 'incidents', 'resilience'],
      },
    });
  }

  // === JOB SEARCH INFO ===

  if (personalInfo.jobSearch) {
    // Visa status
    chunks.push({
      id: 'jobsearch-visa',
      content: `Shree's Visa Status and Work Authorization:\n\n${personalInfo.jobSearch.visa}`,
      metadata: {
        type: 'faq',
        itemId: 'job-search',
        title: 'Visa Status & Work Authorization',
        category: 'hiring',
        tags: ['visa', 'work authorization', 'opt', 'stem opt', 'h1b'],
      },
    });

    // Location preference
    chunks.push({
      id: 'jobsearch-location',
      content: `Shree's Location and Relocation Preferences:\n\n${personalInfo.jobSearch.locationPreference}`,
      metadata: {
        type: 'faq',
        itemId: 'job-search',
        title: 'Location Preferences',
        category: 'career',
        tags: ['location', 'relocation', 'remote', 'onsite'],
      },
    });

    // Company size preference
    chunks.push({
      id: 'jobsearch-company',
      content: `Shree's Company Size and Type Preferences:\n\n${personalInfo.jobSearch.companySizePreference}`,
      metadata: {
        type: 'faq',
        itemId: 'job-search',
        title: 'Company Preferences',
        category: 'career',
        tags: ['company', 'startup', 'culture'],
      },
    });
  }

  return chunks;
}

/**
 * Chunks all portfolio content
 */
export function chunkAllContent(
  projects: Project[],
  experiences: Experience[],
  education: Education[],
  personalInfo?: PersonalInfo
): ContentChunk[] {
  const chunks: ContentChunk[] = [];

  // Chunk personal info first (skills, bio)
  if (personalInfo) {
    chunks.push(...chunkPersonalInfo(personalInfo));
  }

  // Chunk projects
  projects.forEach((project) => {
    chunks.push(...chunkProject(project));
  });

  // Chunk experiences
  experiences.forEach((exp) => {
    chunks.push(...chunkExperience(exp));
  });

  // Chunk education
  education.forEach((edu) => {
    chunks.push(...chunkEducation(edu));
  });

  return chunks;
}

