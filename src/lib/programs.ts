import { programs, Program } from '../data/programs';

export function getAllPrograms(): Program[] {
  return programs;
}

export function getProgramById(id: string): Program | undefined {
  return programs.find(p => p.id === id);
}

export function searchPrograms(query: string): Program[] {
  if (!query.trim()) return programs;
  
  const normalizedQuery = query.toLowerCase().trim();
  const terms = normalizedQuery.split(/\s+/);
  
  return programs.filter(program => {
    const searchableText = [
      program.name,
      program.nameUrdu || '',
      program.organization,
      program.category,
      program.purpose,
      ...program.targetGroups,
      ...program.keywords
    ].join(' ').toLowerCase();
    
    return terms.every(term => searchableText.includes(term));
  });
}

export function filterPrograms(filters: {
  category?: string;
  level?: string;
  province?: string;
}): Program[] {
  let result = [...programs];
  
  if (filters.category && filters.category !== 'all') {
    result = result.filter(p => p.category.toLowerCase() === filters.category!.toLowerCase());
  }
  
  if (filters.level && filters.level !== 'all') {
    result = result.filter(p => p.level === filters.level);
  }
  
  if (filters.province && filters.province !== 'all') {
    result = result.filter(p => !p.province || p.province === filters.province);
  }
  
  return result;
}

export function getProgramCategories(): string[] {
  const cats = new Set(programs.map(p => p.category));
  return Array.from(cats);
}

export function getProgramsByCategory(category: string): Program[] {
  return programs.filter(p => p.category.toLowerCase() === category.toLowerCase());
}
