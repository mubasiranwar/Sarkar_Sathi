import { UserProfile } from './profile';
import { VerifiedProgram } from '../data/verifiedPrograms';

export interface Recommendation {
  programId: string;
  score: number;
  reasons: string[];
  eligibilityStatus: 'potential_match' | 'likely_match' | 'needs_more_information' | 'not_a_match' | 'official_verification_required';
  missingInformation: string[];
  matchPercentage: number;
}

// Calculate recommendation score for a program based on user profile
export function calculateRecommendationScore(
  profile: UserProfile,
  program: VerifiedProgram
): Recommendation {
  let score = 0;
  const reasons: string[] = [];
  const missingInfo: string[] = [];

  // Category/need match (+30)
  if (profile.needs && profile.needs.length > 0) {
    const hasMatchingCategory = program.category.some(cat => 
      profile.needs!.some(need => {
        const needLower = need.toLowerCase();
        return cat.toLowerCase().includes(needLower) || 
               needLower.includes(cat.toLowerCase().split('_')[0]);
      })
    );
    
    if (hasMatchingCategory) {
      score += 30;
      reasons.push(`Your need for ${profile.needs.join(', ')} matches this program's category`);
    }
  }

  // Occupation match (+20)
  if (profile.occupation) {
    const occupationKeywords = {
      farmer: ['agriculture', 'farming'],
      student: ['education', 'skills'],
      business_owner: ['business', 'finance'],
    };

    const relevantKeywords = occupationKeywords[profile.occupation as keyof typeof occupationKeywords] || [];
    const hasOccupationMatch = program.category.some(cat =>
      relevantKeywords.some(keyword => cat.toLowerCase().includes(keyword))
    ) || program.keywords.some(keyword =>
      relevantKeywords.some(relKeyword => keyword.toLowerCase().includes(relKeyword))
    );

    if (hasOccupationMatch) {
      score += 20;
      reasons.push(`Your occupation as ${profile.occupation.replace('_', ' ')} is relevant to this program`);
    }
  }

  // Target group match (+20)
  if (profile.needs || profile.occupation || profile.isBispBeneficiary) {
    const targetGroupMatch = program.targetGroups.some(target => {
      const targetLower = target.toLowerCase();
      
      // Check BISP beneficiary status
      if (profile.isBispBeneficiary && targetLower.includes('bisp')) {
        return true;
      }
      
      // Check needs
      if (profile.needs) {
        return profile.needs.some(need => 
          targetLower.includes(need.toLowerCase()) ||
          need.toLowerCase().includes(targetLower.split(' ')[0])
        );
      }
      
      // Check occupation
      if (profile.occupation) {
        return targetLower.includes(profile.occupation.toLowerCase());
      }
      
      return false;
    });

    if (targetGroupMatch) {
      score += 20;
      reasons.push('You belong to the target group for this program');
    }
  }

  // Location match (+15)
  if (profile.province) {
    if (program.province) {
      if (program.province.includes(profile.province)) {
        score += 15;
        reasons.push(`This program is available in ${profile.province}`);
      } else if (program.level === 'Federal') {
        score += 10;
        reasons.push('This is a federal program available nationwide');
      } else {
        score += 0;
        reasons.push(`Note: This program is only available in ${program.province.join(', ')}`);
      }
    } else if (program.level === 'Federal') {
      score += 10;
      reasons.push('This is a federal program available nationwide');
    }
  } else {
    // Province not known
    if (program.province) {
      missingInfo.push('province');
      reasons.push(`Location requirement: ${program.province.join(', ')} (please specify your province)`);
    } else {
      score += 5;
    }
  }

  // Age match (+10)
  if (profile.age && program.eligibility.age) {
    const ageReq = program.eligibility.age;
    if (ageReq.min && profile.age < ageReq.min) {
      score -= 20;
      reasons.push(`Age requirement: minimum ${ageReq.min} years`);
    } else if (ageReq.max && profile.age > ageReq.max) {
      score -= 20;
      reasons.push(`Age requirement: maximum ${ageReq.max} years`);
    } else {
      score += 10;
      reasons.push('Your age matches the program requirements');
    }
  } else if (program.eligibility.age) {
    missingInfo.push('age');
  }

  // Income/financial relevance (+10)
  if (profile.monthlyIncome) {
    if (program.eligibility.income?.maxMonthly) {
      if (profile.monthlyIncome <= program.eligibility.income.maxMonthly) {
        score += 10;
        reasons.push('Your income level may qualify for this program');
      } else {
        score -= 10;
        reasons.push(`Income limit: Rs. ${program.eligibility.income.maxMonthly.toLocaleString()}/month`);
      }
    } else if (program.category.includes('financial_assistance') || program.category.includes('social_protection')) {
      score += 5;
    }
  }

  // Existing program relationship (+10)
  if (profile.isBispBeneficiary && program.relatedPrograms?.includes('bisp_kafaalat')) {
    score += 10;
    reasons.push('As a BISP beneficiary, you may be eligible for related programs');
  }

  // Special conditions
  if (profile.pregnancy && program.id === 'bisp_nashonuma') {
    score += 15;
    reasons.push('This program specifically supports pregnant women');
  }

  if (profile.disability && program.id === 'bisp_kafaalat') {
    score += 10;
    reasons.push('Families with disabled members may have higher PMT threshold');
  }

  if (profile.children && program.id === 'bisp_taleemi_wazaif') {
    score += 15;
    reasons.push('This program provides education stipends for children');
  }

  // Calculate match percentage
  const maxPossibleScore = 100;
  const matchPercentage = Math.min(100, Math.round((score / maxPossibleScore) * 100));

  // Determine eligibility status
  let eligibilityStatus: Recommendation['eligibilityStatus'];
  
  if (score >= 70) {
    eligibilityStatus = 'likely_match';
  } else if (score >= 50) {
    eligibilityStatus = 'potential_match';
  } else if (missingInfo.length > 0) {
    eligibilityStatus = 'needs_more_information';
  } else if (score < 30) {
    eligibilityStatus = 'not_a_match';
  } else {
    eligibilityStatus = 'official_verification_required';
  }

  return {
    programId: program.id,
    score,
    reasons,
    eligibilityStatus,
    missingInformation: missingInfo,
    matchPercentage,
  };
}

// Get recommended programs for a user profile
export function getRecommendedPrograms(
  profile: UserProfile,
  programs: VerifiedProgram[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  for (const program of programs) {
    const recommendation = calculateRecommendationScore(profile, program);
    
    // Only include programs with some relevance
    if (recommendation.score > 0 || recommendation.reasons.length > 0) {
      recommendations.push(recommendation);
    }
  }

  // Sort by score descending
  return recommendations.sort((a, b) => b.score - a.score);
}

// Get eligibility status text
export function getEligibilityStatusText(status: Recommendation['eligibilityStatus']): string {
  switch (status) {
    case 'likely_match':
      return 'Likely Match';
    case 'potential_match':
      return 'Potential Match';
    case 'needs_more_information':
      return 'Needs More Information';
    case 'not_a_match':
      return 'Not a Match';
    case 'official_verification_required':
      return 'Verification Required';
    default:
      return 'Unknown';
  }
}

// Get eligibility status color
export function getEligibilityStatusColor(status: Recommendation['eligibilityStatus']): string {
  switch (status) {
    case 'likely_match':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'potential_match':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'needs_more_information':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'not_a_match':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'official_verification_required':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}
