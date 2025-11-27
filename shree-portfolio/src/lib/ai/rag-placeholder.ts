import { Citation } from '@/data/types';
import { projects, experiences, education, personalInfo } from '@/data/portfolio';

// This will be replaced with actual RAG implementation later
export async function getAIResponse(query: string, context?: any) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

  // Convert query to lowercase for matching
  const lowerQuery = query.toLowerCase();

  // Placeholder responses based on common queries
  if (lowerQuery.includes('ai') || lowerQuery.includes('ml') || lowerQuery.includes('machine learning')) {
    const aiProjects = projects.filter(p => p.category === 'AI/ML');
    const response = `I have extensive experience with AI/ML technologies. Here are my top AI/ML projects:

${aiProjects.slice(0, 3).map((p, i) => `${i + 1}. **${p.title}** - ${p.summary}`).join('\n\n')}

I've worked with technologies like OpenAI API, TensorFlow, PyTorch, and implemented RAG systems, recommendation engines, and NLP solutions.`;

    return {
      answer: response,
      citations: aiProjects.slice(0, 3).map(p => ({
        type: 'project' as const,
        id: p.id,
        title: p.title
      })),
      confidence: 0.95
    };
  }

  if (lowerQuery.includes('current') || lowerQuery.includes('now') || lowerQuery.includes('present')) {
    const currentRole = experiences.find(e => e.current);
    if (currentRole) {
      return {
        answer: `I'm currently working as a ${currentRole.role} at ${currentRole.company}. ${currentRole.summary}\n\nSome of my key achievements in this role include:\n${currentRole.highlights.slice(0, 3).map(h => `• ${h.text}`).join('\n')}`,
        citations: [{
          type: 'experience' as const,
          id: currentRole.id,
          title: `${currentRole.role} at ${currentRole.company}`
        }],
        confidence: 0.95
      };
    }
  }

  if (lowerQuery.includes('contact') || lowerQuery.includes('email') || lowerQuery.includes('reach')) {
    return {
      answer: `You can reach me through the following channels:\n\n• Email: ${personalInfo.links.email}\n• LinkedIn: ${personalInfo.links.linkedin}\n• GitHub: ${personalInfo.links.github}\n• Schedule a call: ${personalInfo.links.calendar || 'Available through the Book Call button'}\n\nI'm ${personalInfo.availability.status.toLowerCase()} and typically respond within 24 hours.`,
      citations: [{
        type: 'resume' as const,
        id: 'contact',
        title: 'Contact Information',
        url: personalInfo.links.calendar
      }],
      confidence: 0.95
    };
  }

  if (lowerQuery.includes('tech') || lowerQuery.includes('stack') || lowerQuery.includes('skill')) {
    const skillsText = personalInfo.skills.map(category => 
      `**${category.category}**: ${category.items.join(', ')}`
    ).join('\n\n');

    return {
      answer: `I have expertise across the full stack with proficiency in:\n\n${skillsText}\n\nI'm particularly strong in TypeScript, React, Node.js, and Python, with recent focus on AI/ML integration.`,
      citations: [{
        type: 'skill' as const,
        id: 'skills',
        title: 'Technical Skills'
      }],
      confidence: 0.9
    };
  }

  if (lowerQuery.includes('project')) {
    const featuredProjects = projects.filter(p => p.featured).slice(0, 3);
    return {
      answer: `I've worked on ${projects.length} significant projects. Here are some highlights:\n\n${featuredProjects.map((p, i) => `${i + 1}. **${p.title}** (${p.category})\n   ${p.summary}`).join('\n\n')}\n\nEach project demonstrates my ability to deliver measurable impact through technical innovation.`,
      citations: featuredProjects.map(p => ({
        type: 'project' as const,
        id: p.id,
        title: p.title
      })),
      confidence: 0.9
    };
  }

  if (lowerQuery.includes('education') || lowerQuery.includes('degree') || lowerQuery.includes('university')) {
    const currentYear = new Date().getFullYear();
    const gradSchool = education[0]; // USC - current
    const undergrad = education[1]; // MIT-WPU - completed
    
    // Check if still in grad school
    const isCurrentlyStudying = gradSchool.endYear > currentYear;
    
    let answer = '';
    if (isCurrentlyStudying) {
      answer = `I'm currently pursuing my ${gradSchool.degree} in ${gradSchool.field} at ${gradSchool.institution} (expected ${gradSchool.endYear}). ${gradSchool.gpa ? `Current GPA: ${gradSchool.gpa}.` : ''}\n\nRelevant coursework: ${gradSchool.relevantCoursework.slice(0, 5).join(', ')}.\n\n${gradSchool.achievements ? `Achievements: ${gradSchool.achievements.join(', ')}.` : ''}\n\nI completed my ${undergrad.degree} in ${undergrad.field} from ${undergrad.institution} in ${undergrad.endYear}.`;
    } else {
      answer = `I have a ${gradSchool.degree} in ${gradSchool.field} from ${gradSchool.institution} (${gradSchool.endYear}). ${gradSchool.gpa ? `GPA: ${gradSchool.gpa}.` : ''}\n\nRelevant coursework: ${gradSchool.relevantCoursework.slice(0, 5).join(', ')}.\n\n${gradSchool.achievements ? `Achievements: ${gradSchool.achievements.join(', ')}.` : ''}`;
    }
    
    return {
      answer,
      citations: [{
        type: 'education' as const,
        id: gradSchool.id,
        title: `${gradSchool.degree} from ${gradSchool.institution}`
      }],
      confidence: 0.95
    };
  }

  // Context-aware responses
  if (context?.enabled && context?.itemId) {
    if (context.itemType === 'project') {
      const project = projects.find(p => p.id === context.itemId);
      if (project) {
        return {
          answer: `Regarding the ${project.title} project:\n\n**Problem**: ${project.problem}\n\n**Approach**: ${project.approach}\n\n**Impact**: ${project.impact}\n\n**My Role**: ${project.myRole}`,
          citations: [{
            type: 'project' as const,
            id: project.id,
            title: project.title
          }],
          confidence: 0.95
        };
      }
    }
  }

  // Default response
  return {
    answer: `I'm Shree, a ${personalInfo.title}. ${personalInfo.bio.split('\n')[0]}\n\nI have ${experiences.length} professional experiences and have worked on ${projects.length} significant projects. Feel free to ask me about:\n\n• My projects and their impact\n• Technical skills and expertise\n• Work experience and achievements\n• How to get in touch\n\nWhat would you like to know more about?`,
    citations: [],
    confidence: 0.8
  };
}

// Placeholder embedding function
export async function generateEmbeddings(text: string) {
  // Will be implemented with actual vector embeddings later
  return [0.1, 0.2, 0.3]; // Mock embedding
}

// Placeholder semantic search
export async function semanticSearch(query: string, limit = 5) {
  // Will search through actual embeddings later
  return {
    results: projects.slice(0, limit),
    scores: [0.95, 0.87, 0.82, 0.76, 0.71]
  };
}
