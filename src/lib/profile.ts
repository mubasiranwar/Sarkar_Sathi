export interface UserProfile {
  familySize?: number;
  children?: number;
  childrenAges?: number[];
  monthlyIncome?: number;
  occupation?: string;
  landAcres?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  province?: string;
  district?: string;
  employmentStatus?: 'employed' | 'self_employed' | 'unemployed' | 'student' | 'retired';
  needs?: string[];
  educationLevel?: string;
  disability?: boolean;
  pregnancy?: boolean;
  isBispBeneficiary?: boolean;
  currentProgram?: string;
}

export interface ProfileUpdate {
  field: keyof UserProfile;
  value: any;
  source: 'user' | 'inferred';
}

// Extract profile information from user message
export function extractProfileFromMessage(message: string, currentProfile: UserProfile): UserProfile {
  const updates: Partial<UserProfile> = {};
  const lowerMessage = message.toLowerCase();

  // Extract number of children
  const childrenMatch = message.match(/(\d+)\s*(kids?|children|bachay|bacchon)/i);
  if (childrenMatch) {
    updates.children = parseInt(childrenMatch[1]);
  }

  // Extract income
  const incomeMatch = message.match(/(\d+[\d,]*)\s*(rupees|rs|pkr|income|kamai|tankhah)/i);
  if (incomeMatch) {
    const income = parseInt(incomeMatch[1].replace(/,/g, ''));
    if (income > 0 && income < 1000000) {
      updates.monthlyIncome = income;
    }
  }

  // Extract occupation
  if (lowerMessage.includes('farmer') || lowerMessage.includes('kisan') || lowerMessage.includes('زراعت')) {
    updates.occupation = 'farmer';
    updates.employmentStatus = 'self_employed';
  } else if (lowerMessage.includes('teacher') || lowerMessage.includes('ustad')) {
    updates.occupation = 'teacher';
    updates.employmentStatus = 'employed';
  } else if (lowerMessage.includes('doctor') || lowerMessage.includes('hakim')) {
    updates.occupation = 'doctor';
    updates.employmentStatus = 'employed';
  } else if (lowerMessage.includes('student') || lowerMessage.includes('talib ilm')) {
    updates.occupation = 'student';
    updates.employmentStatus = 'student';
  } else if (lowerMessage.includes('business') || lowerMessage.includes('shop') || lowerMessage.includes('dukandar')) {
    updates.occupation = 'business_owner';
    updates.employmentStatus = 'self_employed';
  } else if (lowerMessage.includes('worker') || lowerMessage.includes('mazdoor')) {
    updates.occupation = 'worker';
    updates.employmentStatus = 'employed';
  }

  // Extract land
  const landMatch = message.match(/(\d+\.?\d*)\s*(acres|marla|kanal|marlay)/i);
  if (landMatch) {
    updates.landAcres = parseFloat(landMatch[1]);
  }

  // Extract age
  const ageMatch = message.match(/(\d+)\s*(years old|saal|age|umar)/i);
  if (ageMatch) {
    const age = parseInt(ageMatch[1]);
    if (age > 0 && age < 120) {
      updates.age = age;
    }
  }

  // Extract gender
  if (lowerMessage.includes('male') || lowerMessage.includes('mard') || lowerMessage.includes('آدمی')) {
    updates.gender = 'male';
  } else if (lowerMessage.includes('female') || lowerMessage.includes('aurat') || lowerMessage.includes('عورت')) {
    updates.gender = 'female';
  }

  // Extract province
  const provinces = ['punjab', 'sindh', 'kpk', 'khyber pakhtunkhwa', 'balochistan', 'islamabad', 'gilgit-baltistan', 'ajk'];
  for (const province of provinces) {
    if (lowerMessage.includes(province)) {
      updates.province = province.charAt(0).toUpperCase() + province.slice(1);
      if (updates.province === 'Kpk') updates.province = 'Khyber Pakhtunkhwa';
      break;
    }
  }

  // Extract needs
  const needs: string[] = [];
  if (lowerMessage.includes('health') || lowerMessage.includes('medical') || lowerMessage.includes('صحت') || lowerMessage.includes('بیماری')) {
    needs.push('health');
  }
  if (lowerMessage.includes('education') || lowerMessage.includes('school') || lowerMessage.includes('تعلیم')) {
    needs.push('education');
  }
  if (lowerMessage.includes('business') || lowerMessage.includes('loan') || lowerMessage.includes('کاروبار')) {
    needs.push('business');
  }
  if (lowerMessage.includes('financial') || lowerMessage.includes('money') || lowerMessage.includes('مدد')) {
    needs.push('financial');
  }
  if (lowerMessage.includes('agriculture') || lowerMessage.includes('farming') || lowerMessage.includes('کھیتی')) {
    needs.push('agriculture');
  }
  if (needs.length > 0) {
    updates.needs = [...(currentProfile.needs || []), ...needs].filter((v, i, a) => a.indexOf(v) === i);
  }

  // Extract BISP beneficiary status
  if (lowerMessage.includes('bisp') || lowerMessage.includes('benazir')) {
    updates.isBispBeneficiary = true;
  }

  // Extract pregnancy
  if (lowerMessage.includes('pregnant') || lowerMessage.includes('hamla') || lowerMessage.includes('حاملہ')) {
    updates.pregnancy = true;
  }

  // Extract disability
  if (lowerMessage.includes('disabled') || lowerMessage.includes('disability') || lowerMessage.includes('معذور')) {
    updates.disability = true;
  }

  // Merge with current profile
  return { ...currentProfile, ...updates };
}

// Get missing information for better recommendations
export function getMissingInformation(profile: UserProfile): string[] {
  const missing: string[] = [];

  if (!profile.province) missing.push('province');
  if (!profile.age) missing.push('age');
  if (!profile.monthlyIncome && !profile.occupation) missing.push('income_or_occupation');
  if (!profile.needs || profile.needs.length === 0) missing.push('needs');

  return missing;
}

// Generate next question based on missing info
export function getNextQuestion(profile: UserProfile, missingInfo: string[]): string | null {
  if (missingInfo.length === 0) return null;

  const nextMissing = missingInfo[0];

  switch (nextMissing) {
    case 'province':
      return 'Which province do you currently live in?';
    case 'age':
      return 'What is your age?';
    case 'income_or_occupation':
      if (!profile.occupation) {
        return 'What do you do for work?';
      }
      return 'What is your approximate monthly income?';
    case 'needs':
      return 'What kind of support are you looking for? (health, education, business, financial assistance, etc.)';
    default:
      return null;
  }
}

// Format profile for display
export function formatProfileForDisplay(profile: UserProfile): string[] {
  const items: string[] = [];

  if (profile.monthlyIncome) {
    items.push(`Income: Rs. ${profile.monthlyIncome.toLocaleString()}/month`);
  }
  if (profile.children) {
    items.push(`Children: ${profile.children}`);
  }
  if (profile.occupation) {
    items.push(`Occupation: ${profile.occupation.replace('_', ' ')}`);
  }
  if (profile.landAcres) {
    items.push(`Land: ${profile.landAcres} acres`);
  }
  if (profile.age) {
    items.push(`Age: ${profile.age}`);
  }
  if (profile.province) {
    items.push(`Province: ${profile.province}`);
  }
  if (profile.gender) {
    items.push(`Gender: ${profile.gender}`);
  }
  if (profile.needs && profile.needs.length > 0) {
    items.push(`Needs: ${profile.needs.join(', ')}`);
  }
  if (profile.isBispBeneficiary) {
    items.push('BISP Beneficiary: Yes');
  }
  if (profile.pregnancy) {
    items.push('Pregnancy: Yes');
  }
  if (profile.disability) {
    items.push('Disability: Yes');
  }

  return items;
}
