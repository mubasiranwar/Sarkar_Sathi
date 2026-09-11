export type Intent =
  | 'find_programs'
  | 'program_details'
  | 'check_eligibility'
  | 'documents'
  | 'application_process'
  | 'health_support'
  | 'education_support'
  | 'financial_support'
  | 'agriculture_support'
  | 'business_support'
  | 'employment_support'
  | 'skills_training'
  | 'track_application'
  | 'general_question'
  | 'greeting'
  | 'profile_update';

export interface IntentResult {
  intent: Intent;
  programId?: string;
  confidence: number;
}

// Classify user intent from message
export function classifyIntent(message: string): IntentResult {
  const lowerMessage = message.toLowerCase();

  // Greeting
  if (/^(hi|hello|assalam|salam|hey|good morning|good evening)/i.test(lowerMessage)) {
    return { intent: 'greeting', confidence: 0.95 };
  }

  // Program-specific queries
  if (lowerMessage.includes('bisp') || lowerMessage.includes('benazir')) {
    if (lowerMessage.includes('kafaalat')) {
      return { intent: 'program_details', programId: 'bisp_kafaalat', confidence: 0.95 };
    }
    if (lowerMessage.includes('taleemi') || lowerMessage.includes('wazaif') || lowerMessage.includes('education')) {
      return { intent: 'program_details', programId: 'bisp_taleemi_wazaif', confidence: 0.95 };
    }
    if (lowerMessage.includes('nashonuma') || lowerMessage.includes('nutrition')) {
      return { intent: 'program_details', programId: 'bisp_nashonuma', confidence: 0.95 };
    }
    if (lowerMessage.includes('nser') || lowerMessage.includes('registration')) {
      return { intent: 'program_details', programId: 'bisp_nser', confidence: 0.95 };
    }
    return { intent: 'program_details', confidence: 0.8 };
  }

  if (lowerMessage.includes('pbm') || lowerMessage.includes('bait-ul-mal') || lowerMessage.includes('bait ul mal')) {
    return { intent: 'program_details', programId: 'pbm_medical_assistance', confidence: 0.95 };
  }

  if (lowerMessage.includes('pmybals') || lowerMessage.includes('youth loan') || lowerMessage.includes('youth business')) {
    return { intent: 'program_details', programId: 'pmyp_business_agriculture_loan', confidence: 0.95 };
  }

  if (lowerMessage.includes('punjab medical') || lowerMessage.includes('social services')) {
    return { intent: 'program_details', programId: 'punjab_medical_social_services', confidence: 0.95 };
  }

  if (lowerMessage.includes('psdf') || lowerMessage.includes('skills development')) {
    return { intent: 'program_details', programId: 'psdf_skills', confidence: 0.95 };
  }

  // Document queries
  if (lowerMessage.includes('document') || lowerMessage.includes('papers') || lowerMessage.includes('cnic') || lowerMessage.includes('کاغذات')) {
    return { intent: 'documents', confidence: 0.9 };
  }

  // Application process
  if (lowerMessage.includes('apply') || lowerMessage.includes('application') || lowerMessage.includes('how to') || lowerMessage.includes('process') || lowerMessage.includes('درخواست')) {
    return { intent: 'application_process', confidence: 0.85 };
  }

  // Eligibility check
  if (lowerMessage.includes('eligible') || lowerMessage.includes('qualify') || lowerMessage.includes('can i get') || lowerMessage.includes('اہل')) {
    return { intent: 'check_eligibility', confidence: 0.9 };
  }

  // Health support
  if (lowerMessage.includes('health') || lowerMessage.includes('medical') || lowerMessage.includes('hospital') || lowerMessage.includes('treatment') || lowerMessage.includes('صحت') || lowerMessage.includes('بیماری')) {
    return { intent: 'health_support', confidence: 0.9 };
  }

  // Education support
  if (lowerMessage.includes('education') || lowerMessage.includes('school') || lowerMessage.includes('scholarship') || lowerMessage.includes('stipend') || lowerMessage.includes('تعلیم')) {
    return { intent: 'education_support', confidence: 0.9 };
  }

  // Business support
  if (lowerMessage.includes('business') || lowerMessage.includes('loan') || lowerMessage.includes('startup') || lowerMessage.includes('کاروبار')) {
    return { intent: 'business_support', confidence: 0.9 };
  }

  // Agriculture support
  if (lowerMessage.includes('agriculture') || lowerMessage.includes('farming') || lowerMessage.includes('farmer') || lowerMessage.includes('کھیتی') || lowerMessage.includes('کسان')) {
    return { intent: 'agriculture_support', confidence: 0.9 };
  }

  // Employment/skills
  if (lowerMessage.includes('job') || lowerMessage.includes('employment') || lowerMessage.includes('skills') || lowerMessage.includes('training') || lowerMessage.includes('نوکری') || lowerMessage.includes('مہارت')) {
    return { intent: 'employment_support', confidence: 0.9 };
  }

  // Financial support
  if (lowerMessage.includes('financial') || lowerMessage.includes('money') || lowerMessage.includes('cash') || lowerMessage.includes('assistance') || lowerMessage.includes('مدد')) {
    return { intent: 'financial_support', confidence: 0.85 };
  }

  // Find programs (general)
  if (lowerMessage.includes('program') || lowerMessage.includes('scheme') || lowerMessage.includes('proگرام')) {
    return { intent: 'find_programs', confidence: 0.8 };
  }

  // Default to general question
  return { intent: 'general_question', confidence: 0.5 };
}

// Get programs relevant to intent
export function getProgramsForIntent(intent: Intent, programId?: string): string[] {
  switch (intent) {
    case 'program_details':
      return programId ? [programId] : [];
    
    case 'health_support':
      return ['pbm_medical_assistance', 'bisp_nashonuma', 'punjab_medical_social_services', 'punjab_public_health_programs'];
    
    case 'education_support':
      return ['bisp_taleemi_wazaif'];
    
    case 'business_support':
    case 'agriculture_support':
      return ['pmyp_business_agriculture_loan'];
    
    case 'financial_support':
      return ['bisp_kafaalat', 'pbm_medical_assistance'];
    
    case 'employment_support':
    case 'skills_training':
      return ['psdf_skills'];
    
    case 'documents':
    case 'application_process':
    case 'check_eligibility':
      // These need context from currentProgram
      return [];
    
    default:
      return [];
  }
}
