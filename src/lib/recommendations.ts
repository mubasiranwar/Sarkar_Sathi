import { Program, programs } from '../data/programs';

export interface UserProfile {
  need: string;
  province?: string;
  age?: number;
  isStudent?: boolean;
  isEmployed?: boolean;
  householdIncome?: 'low' | 'middle' | 'high';
  gender?: 'male' | 'female';
  hasChildren?: boolean;
  isFarmer?: boolean;
}

interface ScoredProgram {
  program: Program;
  score: number;
  reasons: string[];
}

const needToCategoryMap: Record<string, string[]> = {
  'financial': ['Social Protection'],
  'education': ['Education'],
  'healthcare': ['Health'],
  'employment': ['Employment', 'Business'],
  'business': ['Business'],
  'agriculture': ['Agriculture'],
  'housing': ['Housing'],
  'other': [],
};

export function getRecommendedPrograms(profile: UserProfile): ScoredProgram[] {
  const scored: ScoredProgram[] = programs.map(program => {
    let score = 0;
    const reasons: string[] = [];
    
    // Category match based on need
    const targetCategories = needToCategoryMap[profile.need] || [];
    if (targetCategories.includes(program.category)) {
      score += 40;
      reasons.push(`Matches your need: ${profile.need}`);
    }
    
    // Province match
    if (profile.province && program.province) {
      if (program.province === profile.province) {
        score += 25;
        reasons.push(`Available in your province: ${profile.province}`);
      }
    } else if (!program.province || program.level === 'Federal') {
      score += 15;
      reasons.push('Available nationwide');
    }
    
    // Target group match
    if (profile.isStudent && program.targetGroups.some(t => t.toLowerCase().includes('student'))) {
      score += 20;
      reasons.push('Targets students');
    }
    
    if (profile.householdIncome === 'low' && program.targetGroups.some(t => t.toLowerCase().includes('low-income'))) {
      score += 20;
      reasons.push('Designed for low-income families');
    }
    
    if (profile.gender === 'female' && program.targetGroups.some(t => t.toLowerCase().includes('women'))) {
      score += 15;
      reasons.push('Specifically supports women');
    }
    
    if (profile.hasChildren && program.targetGroups.some(t => t.toLowerCase().includes('children'))) {
      score += 15;
      reasons.push('Supports families with children');
    }
    
    if (profile.isFarmer && program.targetGroups.some(t => t.toLowerCase().includes('farmer'))) {
      score += 25;
      reasons.push('Designed for farmers');
    }
    
    if (profile.age && profile.age <= 35 && program.targetGroups.some(t => t.toLowerCase().includes('youth'))) {
      score += 15;
      reasons.push('Youth-focused program');
    }
    
    // Federal programs are always somewhat relevant
    if (program.level === 'Federal') {
      score += 5;
    }
    
    return { program, score, reasons };
  });
  
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);
}
