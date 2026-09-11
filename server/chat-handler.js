import OpenAI from 'openai';

// Verified program data - source of truth
const verifiedPrograms = [
  {
    id: 'bisp_kafaalat',
    name: 'Benazir Kafaalat',
    nameUrdu: 'بینظیر کفالت',
    organization: 'Benazir Income Support Programme (BISP)',
    level: 'Federal',
    category: ['social_protection', 'financial_assistance'],
    purpose: 'Unconditional cash transfer programme providing financial assistance to eligible poor families, particularly women.',
    description: 'Benazir Kafaalat is the core unconditional cash transfer programme of BISP. Beneficiary selection is based on the National Socio-Economic Registry (NSER) and Proxy Means Test (PMT).',
    targetGroups: ['low-income households', 'eligible women', 'vulnerable families'],
    eligibility: {
      familyStatus: ['poor households', 'women-headed households'],
      other: ['Must be registered in NSER', 'PMT score below threshold (currently 32, or 37 for families with disabled person)'],
    },
    benefits: [
      'Quarterly cash stipend (currently Rs. 8,500 as per official BISP data - verify for current amount)',
      'Direct bank transfer to beneficiary',
    ],
    documents: ['Valid CNIC', 'NSER registration (if not already registered)'],
    applicationSteps: [
      'Visit nearest BISP tehsil office or registration center',
      'Complete NSER survey if not already registered',
      'Wait for eligibility determination based on PMT score',
      'If eligible, receive payment instructions via SMS',
    ],
    applicationChannels: ['BISP Tehsil Offices', 'BISP Dynamic Registry Centers', 'Official BISP website: https://www.bisp.gov.pk/'],
    keywords: ['cash', 'financial', 'support', 'poverty', 'women', 'family', 'welfare', 'bisp', 'benazir', 'kafaalat', 'money', 'stipend'],
    source: { name: 'Benazir Income Support Programme', url: 'https://www.bisp.gov.pk/', verifiedAt: '2026-01-15', verificationStatus: 'official' },
    relatedPrograms: ['bisp_taleemi_wazaif', 'bisp_nashonuma', 'bisp_nser'],
  },
  {
    id: 'bisp_taleemi_wazaif',
    name: 'Benazir Taleemi Wazaif',
    nameUrdu: 'بینظیر تعلیمی وظائف',
    organization: 'Benazir Income Support Programme (BISP)',
    level: 'Federal',
    category: ['education', 'financial_assistance'],
    purpose: 'Conditional cash transfer programme supporting education of children from active BISP Kafaalat beneficiary families.',
    description: 'Taleemi Wazaif provides education stipends to children of BISP Kafaalat beneficiaries to encourage school enrollment and attendance.',
    targetGroups: ['children of BISP Kafaalat beneficiaries', 'school-going children'],
    eligibility: {
      age: { note: 'Primary: 4-12 years, Secondary: 8-18 years, Higher Secondary: 13-22 years' },
      familyStatus: ['Must be child of active BISP Kafaalat beneficiary'],
      education: 'Must be enrolled in recognized educational institution',
      other: ['Minimum 70% attendance required per quarter'],
    },
    benefits: [
      'Primary - Boy: Rs. 1,500/quarter, Girl: Rs. 2,000/quarter',
      'Secondary - Boy: Rs. 2,500/quarter, Girl: Rs. 3,000/quarter',
      'Higher Secondary - Boy: Rs. 3,500/quarter, Girl: Rs. 4,000/quarter',
      'Girls graduation bonus: Rs. 3,000 one-time',
    ],
    documents: ['Parent CNIC (must be BISP Kafaalat beneficiary)', 'Child B-Form', 'School enrollment certificate', 'Attendance records'],
    applicationSteps: [
      'Must first be registered as BISP Kafaalat beneficiary',
      'Register children through BISP education wing',
      'Ensure children are enrolled in school',
      'Maintain minimum 70% attendance',
      'Receive stipend payments through designated channels',
    ],
    applicationChannels: ['BISP Tehsil Offices', 'BISP Education Wing', 'Official BISP website: https://www.bisp.gov.pk/'],
    keywords: ['education', 'school', 'stipend', 'children', 'student', 'scholarship', 'waseela', 'taleem', 'taleemi', 'wazaif'],
    source: { name: 'Benazir Income Support Programme', url: 'https://www.bisp.gov.pk/', verifiedAt: '2026-01-15', verificationStatus: 'official' },
    relatedPrograms: ['bisp_kafaalat'],
  },
  {
    id: 'bisp_nashonuma',
    name: 'Benazir Nashonuma',
    nameUrdu: 'بینظیر نشونما',
    organization: 'Benazir Income Support Programme (BISP)',
    level: 'Federal',
    category: ['health', 'nutrition', 'social_protection'],
    purpose: 'Integrated nutrition and maternal/child health support focused on the first 1,000 days from conception until child\'s second birthday.',
    description: 'Nashonuma provides conditional cash transfers, specialized nutritious food, and health services to pregnant/lactating women and children under 2 from BISP beneficiary families.',
    targetGroups: ['pregnant women (BISP beneficiaries)', 'lactating women (BISP beneficiaries)', 'children under 2 years (BISP beneficiaries)'],
    eligibility: {
      age: { min: 18, max: 59, note: 'For pregnant/lactating women' },
      familyStatus: ['Must be enrolled under BISP Kafaalat', 'Pregnant or lactating women', 'Children under 2 years old'],
      location: { note: 'Must reside in selected programme rollout area' },
    },
    benefits: ['Conditional cash transfers', 'Specialized nutritious food', 'Social and behavioral change communication', 'Maternal, newborn and child health services'],
    documents: ['Valid CNIC', 'Pregnancy screening (where applicable)', 'Family Registration Certificate (FRC) for child registration', 'Immunization card'],
    applicationSteps: [
      'Must be BISP Kafaalat beneficiary',
      'Visit nearest Nashonuma center in rollout area',
      'Complete registration and screening',
      'Attend regular health checkups',
      'Receive benefits as per program guidelines',
    ],
    applicationChannels: ['BISP Nashonuma Centers', 'Selected government health facilities', 'Official BISP website: https://www.bisp.gov.pk/'],
    keywords: ['nutrition', 'health', 'pregnant', 'lactating', 'child', 'maternal', 'nashonuma', 'baby', 'infant'],
    source: { name: 'Benazir Income Support Programme', url: 'https://www.bisp.gov.pk/', verifiedAt: '2026-01-15', verificationStatus: 'official' },
    relatedPrograms: ['bisp_kafaalat'],
  },
  {
    id: 'pbm_medical_assistance',
    name: 'Pakistan Bait-ul-Mal Medical Assistance',
    nameUrdu: 'پاکستان بیت المال طبی امداد',
    organization: 'Pakistan Bait-ul-Mal',
    level: 'Federal',
    category: ['health', 'financial_assistance'],
    purpose: 'Medical assistance for poor and deserving individuals according to PBM criteria.',
    description: 'PBM provides Individual Financial Assistance for medical treatment, medicines, artificial limbs, hearing aids, and other medical needs to deserving individuals.',
    targetGroups: ['poor and deserving individuals', 'patients requiring medical treatment'],
    eligibility: {
      familyStatus: ['Poor and deserving individuals'],
      other: ['Must meet PBM criteria for medical assistance'],
    },
    benefits: ['Financial assistance for medical treatment', 'Support for medicines', 'Artificial limbs and hearing aids support', 'Other medical assistance as per criteria'],
    documents: ['Patient CNIC', 'Medical documentation from qualified doctor', 'Disease/medicine specific form (download from PBM website)', 'Application form'],
    applicationSteps: [
      'Visit official PBM forms page: https://www.pbm.gov.pk/Pbm-Function.html',
      'Read applicable criteria',
      'Download relevant disease/medicine form',
      'Have required medical documentation completed by doctor',
      'Submit application with photocopy of patient CNIC to PBM office/hospital desk',
    ],
    applicationChannels: ['PBM Regional/Provincial/Head Offices', 'PBM hospital desks', 'Official PBM website: https://www.pbm.gov.pk/'],
    keywords: ['medical', 'health', 'treatment', 'medicine', 'hospital', 'patient', 'disease', 'pbm', 'bait-ul-mal'],
    source: { name: 'Pakistan Bait-ul-Mal', url: 'https://www.pbm.gov.pk/', verifiedAt: '2026-01-15', verificationStatus: 'official' },
  },
  {
    id: 'pmyp_business_agriculture_loan',
    name: 'Prime Minister\'s Youth Business & Agriculture Loan Scheme',
    nameUrdu: 'وزیراعظم یوتھ بزنس اینڈ ایگریکلچر لون سکیم',
    organization: 'Prime Minister\'s Youth Programme',
    level: 'Federal',
    category: ['business', 'agriculture', 'youth', 'finance'],
    purpose: 'Provides business and agriculture financing opportunities to eligible Pakistani youth.',
    description: 'PMYP offers tiered loans with subsidized markup rates to young entrepreneurs for starting or expanding businesses and agricultural activities.',
    targetGroups: ['youth entrepreneurs', 'young farmers', 'small business owners'],
    eligibility: {
      age: { min: 21, max: 45, note: '18+ for IT/E-commerce businesses' },
      familyStatus: ['Pakistani residents with entrepreneurial potential'],
      other: ['Government employees not eligible', 'Must apply online through official website'],
    },
    benefits: [
      'Tier 1: Up to PKR 0.5 million at 0% markup',
      'Tier 2: PKR 0.5-1.5 million at 5% markup',
      'Tier 3: PKR 1.5-7.5 million at 7% markup',
    ],
    documents: ['Valid CNIC', 'Business plan', 'Proof of business registration (if existing)', 'Guarantor information', 'For agriculture: land documents'],
    applicationSteps: [
      'Visit official PMYP website: https://pmybals.pmyp.gov.pk/',
      'Create account and fill online application',
      'Upload business plan and required documents',
      'Application reviewed by participating bank',
      'If approved, complete loan documentation',
      'Receive disbursement as per approved terms',
    ],
    applicationChannels: ['Official PMYP website: https://pmybals.pmyp.gov.pk/', 'Participating banks'],
    keywords: ['business', 'loan', 'youth', 'entrepreneur', 'startup', 'agriculture', 'pmyp', 'prime minister', 'farming'],
    source: { name: 'Prime Minister\'s Youth Programme', url: 'https://pmybals.pmyp.gov.pk/', verifiedAt: '2026-01-15', verificationStatus: 'official' },
  },
  {
    id: 'punjab_medical_social_services',
    name: 'Punjab Medical Social Services',
    nameUrdu: 'پنجاب طبی سماجی خدمات',
    organization: 'Social Welfare Department, Government of Punjab',
    level: 'Provincial',
    province: ['Punjab'],
    category: ['health', 'financial_assistance'],
    purpose: 'Assistance for deserving and destitute patients through Medical Social Services Units in government hospitals.',
    description: 'Medical Social Services Units in Punjab government hospitals provide assistance including medicines, treatment expenses, patient support, and rehabilitation.',
    targetGroups: ['deserving and destitute patients', 'poor patients in Punjab'],
    eligibility: {
      location: { provinces: ['Punjab'] },
      familyStatus: ['Deserving and destitute patients'],
    },
    benefits: ['Medicines', 'Treatment expenses', 'Patient support', 'Psychosocial support', 'Referrals and rehabilitation support'],
    documents: ['CNIC', 'Medical documentation', 'Proof of financial need'],
    applicationSteps: [
      'Visit Medical Social Services Unit in government hospital',
      'Submit application with required documents',
      'Case assessment by social welfare officer',
      'Receive assistance as per eligibility',
    ],
    applicationChannels: ['Medical Social Services Units in government hospitals', 'Social Welfare Department, Punjab', 'Official website: https://swd.punjab.gov.pk/medical_social_services'],
    keywords: ['medical', 'health', 'hospital', 'punjab', 'social welfare', 'patient', 'treatment'],
    source: { name: 'Social Welfare Department, Government of Punjab', url: 'https://swd.punjab.gov.pk/medical_social_services', verifiedAt: '2026-01-15', verificationStatus: 'official' },
  },
  {
    id: 'punjab_public_health_programs',
    name: 'Punjab Government Health Programs',
    nameUrdu: 'پنجاب حکومتی صحت پروگرام',
    organization: 'Directorate General Health Services, Government of Punjab',
    level: 'Provincial',
    province: ['Punjab'],
    category: ['health', 'public_health'],
    purpose: 'Public health services and programs for Punjab residents.',
    description: 'DGHS Punjab operates various public health programs including immunization, disease control, maternal health, and health education.',
    targetGroups: ['Punjab residents', 'general public'],
    eligibility: { location: { provinces: ['Punjab'] } },
    benefits: [
      'Epidemics Prevention and Control', 'Expanded Programme on Immunization (EPI)',
      'Reproductive, Maternal, Newborn, Child Health & Nutrition', 'Family Planning & Primary Health Care',
      'Hepatitis Prevention and Control', 'AIDS Control Program', 'Malaria Control Program',
      'TB Control Program', 'Health Education Program', 'School Health & Nutrition Program',
      'Non-Communicable Diseases Prevention',
    ],
    documents: ['CNIC', 'Relevant medical records'],
    applicationSteps: ['Visit nearest government health facility', 'Access relevant public health services', 'Follow program-specific guidelines'],
    applicationChannels: ['Government hospitals and health facilities', 'Basic Health Units (BHUs)', 'Rural Health Centers (RHCs)', 'Official website: https://dghs.punjab.gov.pk/programs'],
    keywords: ['health', 'public health', 'immunization', 'vaccination', 'punjab', 'disease control', 'maternal health'],
    source: { name: 'Directorate General Health Services, Government of Punjab', url: 'https://dghs.punjab.gov.pk/programs', verifiedAt: '2026-01-15', verificationStatus: 'official' },
  },
  {
    id: 'psdf_skills',
    name: 'Punjab Skills Development Fund',
    nameUrdu: 'پنجاب مہارت ترقیاتی فنڈ',
    organization: 'Punjab Skills Development Fund',
    level: 'Provincial',
    province: ['Punjab'],
    category: ['skills', 'employment', 'training'],
    purpose: 'Skills training and employability opportunities for Punjab youth.',
    description: 'PSDF offers demand-driven skills training through 250+ trades with 750+ private-sector training partners across Punjab.',
    targetGroups: ['youth seeking skills training', 'unemployed youth', 'job seekers'],
    eligibility: { location: { provinces: ['Punjab'] }, age: { note: 'Age requirements vary by trade' } },
    benefits: ['250+ demand-driven trades', 'Training through 750+ private-sector partners', 'Thousands of training opportunities', 'Industry-relevant skills', 'Employment assistance'],
    documents: ['CNIC', 'Educational certificates', 'Domicile certificate'],
    applicationSteps: ['Visit PSDF website to explore available trades', 'Select preferred training program', 'Apply through designated training partner', 'Complete training program', 'Receive certification and employment assistance'],
    applicationChannels: ['PSDF website: https://www.psdf.org.pk/', 'Private-sector training partners'],
    keywords: ['skills', 'training', 'employment', 'vocational', 'punjab', 'youth', 'jobs', 'psdf'],
    source: { name: 'Punjab Skills Development Fund', url: 'https://www.psdf.org.pk/', verifiedAt: '2026-01-15', verificationStatus: 'official' },
  },
  {
    id: 'bisp_nser',
    name: 'National Socio-Economic Registry (NSER)',
    nameUrdu: 'قومی سماجی معاشی رجسٹر',
    organization: 'Benazir Income Support Programme (BISP)',
    level: 'Federal',
    category: ['social_protection', 'registration'],
    purpose: 'Registration and assessment mechanism for BISP beneficiary identification.',
    description: 'NSER is a database used by BISP to identify eligible beneficiaries through Proxy Means Test (PMT) surveys. This is not a cash program itself but a registration mechanism.',
    targetGroups: ['poor households', 'families seeking social protection'],
    eligibility: { familyStatus: ['Poor and deserving households'] },
    benefits: ['Registration for BISP programs', 'Eligibility assessment for social protection programs'],
    documents: ['CNIC of household head', 'Family registration information', 'Proof of residence'],
    applicationSteps: [
      'Visit nearest BISP tehsil office or NSER registration center',
      'Complete NSER survey questionnaire',
      'Provide household information',
      'Receive PMT score',
      'If eligible, enroll in relevant BISP programs',
    ],
    applicationChannels: ['BISP Tehsil Offices', 'NSER Dynamic Registry Centers', 'Official BISP website: https://www.bisp.gov.pk/'],
    keywords: ['nser', 'registration', 'survey', 'pmt', 'bisp', 'social protection'],
    source: { name: 'Benazir Income Support Programme', url: 'https://www.bisp.gov.pk/', verifiedAt: '2026-01-15', verificationStatus: 'official' },
    relatedPrograms: ['bisp_kafaalat'],
  },
];

const SYSTEM_PROMPT = `You are Sarkar Sathi, a citizen-service navigation assistant for Pakistan.

Your purpose is to help citizens understand government programs and public services in simple language.

You are NOT the government and must never pretend to be an official government representative.

CRITICAL RULES:
1. ONLY use information from the provided VERIFIED PROGRAM DATA. Never invent information.
2. NEVER ask for information the user has already provided in the conversation.
3. If you need more information, ask for ONLY the missing details.
4. Never make up eligibility criteria, benefit amounts, or procedures not in the data.
5. If verified information is unavailable, say "This information needs verification."

LANGUAGE HANDLING:
- Detect the language of the user's latest query and the active session language flag.
- If the user writes or speaks in Urdu (اردو) or Roman Urdu, or if the active session language is Urdu, respond entirely in natural, polite, and fluent Urdu (اردو رسم الخط).
- NEVER respond in English when the user is conversing in Urdu.
- Provide program names, eligibility criteria, and instructions clearly in authentic Urdu.
- If the user writes in English and the active session language is English, respond entirely in English.
- Program names can remain in their original form (e.g., "Benazir Kafaalat", "بینظیر کفالت")

CONVERSATION STATE:
- Track what the user has already told you
- Never repeat questions for information already provided
- Build on previous information
- If user provided age/income/children/etc., NEVER ask for it again

RESPONSE FORMAT (valid JSON only):
{
  "profileUpdates": {"field": "value"},
  "answer": "Your response in user's language",
  "intent": "find_programs|program_details|check_eligibility|documents|application_process|health_support|education_support|financial_support|agriculture_support|business_support|general_question",
  "followUpQuestion": "Next question or null (in user's language)",
  "recommendedPrograms": ["program-id-1"],
  "eligibilityStatus": "likely_match|potential_match|needs_more_information|not_a_match",
  "missingInformation": ["province"],
  "nextSteps": ["Step 1"],
  "sources": ["Source name and URL"]
}`;

const hasUrduCharacters = (text) => /[\u0600-\u06FF]/.test(text);

const CRITICAL_LANGUAGE_DIRECTIVE = `CRITICAL DIRECTIVE - LANGUAGE ENFORCEMENT:
- IF the user query contains ANY Urdu script (e.g., میرے 3 بچے ہیں, کیا میں اہل ہوں؟) OR the requested language parameter is 'ur'/'urdu':
  - You MUST reply 100% in natural, polite Urdu written in Urdu script (اردو رسم الخط).
  - You are STRICTLY FORBIDDEN from using English words or sentences in your response.
  - Translate all program names, eligibility criteria, and step-by-step guidance into clear Urdu.
- IF the user writes in Roman Urdu (e.g. 'mere 3 bachay hain'), reply in Roman Urdu.
- IF the user writes in English, reply in English.
- Do not mix languages unless citing an official acronym like BISP or NADRA.`;

const URDU_MODEL_CONFIG = {
  model: process.env.QWEN_URDU_MODEL || process.env.QWEN_MODEL || 'Qwen/Qwen3-Max',
  temperature: 0.35,
  systemPrompt: `${SYSTEM_PROMPT}

آپ پاکستان کے سرکاری معلوماتی اسسٹنٹ "سرکار ساتھی" ہیں۔
اہم ترین ہدایت:
1. صارف کے ساتھ صرف اور صرف سلیس، شائستہ اور آسان اردو رسم الخط میں گفتگو کریں۔
2. انگریزی میں جواب دینا سختی سے منع ہے۔ تمام حکومتی اسکیموں، اہلیت کے معیار، اور ضروری دستاویزات کے نام اردو میں بتائیں۔
3. صارف کے جواب کی تصدیق کریں اور اگر مزید معلومات درکار ہوں تو صرف اردو میں پوچھیں۔`,
};

const ENGLISH_MODEL_CONFIG = {
  model: process.env.QWEN_MODEL || 'Qwen/Qwen3-Max',
  temperature: 0.5,
  systemPrompt: SYSTEM_PROMPT,
};

function searchPrograms(query) {
  if (!query.trim()) return verifiedPrograms;
  const normalizedQuery = query.toLowerCase().trim();
  const terms = normalizedQuery.split(/\s+/);
  return verifiedPrograms.filter(program => {
    const searchableText = [
      program.name,
      program.nameUrdu || '',
      program.organization,
      program.category.join(' '),
      program.purpose,
      program.description,
      ...program.targetGroups,
      ...program.keywords
    ].join(' ').toLowerCase();
    return terms.every(term => searchableText.includes(term));
  });
}

function buildProgramContext(query) {
  const relevantPrograms = searchPrograms(query);
  const lowerQuery = query.toLowerCase();
  const additionalPrograms = verifiedPrograms.filter(p => {
    const keywords = p.keywords.join(' ').toLowerCase();
    return lowerQuery.split(/\s+/).some(term => 
      keywords.includes(term) || 
      p.category.some(c => c.toLowerCase().includes(term)) ||
      p.name.toLowerCase().includes(term)
    );
  });
  
  const allRelevant = [...new Set([...relevantPrograms, ...additionalPrograms])];
  const topPrograms = allRelevant.slice(0, 5);
  const finalPrograms = topPrograms.length > 0 ? topPrograms : verifiedPrograms.slice(0, 6);
  
  return finalPrograms.map(p => `PROGRAM: ${p.name} (${p.nameUrdu || ''})
ID: ${p.id}
Organization: ${p.organization}
Category: ${p.category.join(', ')}
Level: ${p.level}
${p.province ? `Province: ${p.province.join(', ')}` : ''}
Purpose: ${p.purpose}
Description: ${p.description}
Target Groups: ${p.targetGroups.join(', ')}
Eligibility: ${JSON.stringify(p.eligibility)}
Benefits: ${p.benefits.join('; ')}
Required Documents: ${p.documents.join(', ')}
Application Steps: ${p.applicationSteps.join(' → ')}
Application Channels: ${p.applicationChannels.join(', ')}
Source: ${p.source.name} (${p.source.url})
Verified: ${p.source.verifiedAt}`).join('\n\n---\n\n');
}

export function createChatHandler() {
  return async function handleChat(messages, profile = {}, language = 'english') {
    const apiKey = process.env.QWEN_API_KEY;
    const baseUrl = process.env.QWEN_BASE_URL || 'https://api-inference.modelscope.ai/v1';
    
    if (!apiKey) {
      throw new Error('QWEN_API_KEY not configured');
    }
    
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    const query = lastUserMessage?.content || '';
    const programContext = buildProgramContext(query);
    
    const hasUrduScript = hasUrduCharacters(query);
    const romanUrduPattern = /\b(mujhe|aap|apka|apni|hai|hain|madad|chahiye|kaise|kya|mera|meri|mere|ke liye|batayein|program|bachay|bache)\b/i;
    const isRomanUrdu = !hasUrduScript && romanUrduPattern.test(query);
    const isUrduScript = language === 'ur' || language === 'urdu' || hasUrduScript;
    const selectedConfig = isUrduScript ? URDU_MODEL_CONFIG : ENGLISH_MODEL_CONFIG;
    const languageInstruction = isUrduScript
      ? `

CRITICAL LANGUAGE ENFORCEMENT RULE:
1. Detect the language of the user's message and check the session language parameter.
2. The user is conversing in Urdu because the message contains Urdu script or the active session language is 'ur'/'urdu'.
3. You MUST reply ENTIRELY in fluent, polite, and natural Urdu using Urdu script (اردو رسم الخط).
4. NEVER reply in English, even partially. Translate all program names, eligibility criteria, required documents, and next steps into natural Urdu, while preserving official names where necessary.
5. Never revert to English when the conversation context or query is in Urdu.`
      : isRomanUrdu
      ? `

CRITICAL LANGUAGE ENFORCEMENT RULE:
1. The user's latest message is Roman Urdu.
2. Reply entirely in clear, natural, polite Roman Urdu using Latin script.
3. Do not switch to English or Urdu script. Keep program names and official URLs unchanged where necessary.`
      : `

CRITICAL LANGUAGE ENFORCEMENT RULE:
1. The user's latest message and active session are English.
2. Reply entirely in clear, natural English.`;
    
    const systemMessage = `${CRITICAL_LANGUAGE_DIRECTIVE}\n\n${selectedConfig.systemPrompt}${languageInstruction}\n\n=== CURRENT USER PROFILE ===\n${JSON.stringify(profile, null, 2)}\n=== END PROFILE ===\n\n=== VERIFIED PROGRAM DATA ===\n${programContext}\n=== END PROGRAMS ===\n\nUse ONLY the programs listed above. Reference them by their ID.`;

    const languageAwareMessages = messages.map((message, index) => {
      if (index !== messages.length - 1 || message.role !== 'user') {
        return { role: message.role, content: message.content };
      }

      const needsUrduInstruction = hasUrduCharacters(message.content) || language === 'ur' || language === 'urdu';
      return {
        role: message.role,
        content: needsUrduInstruction
          ? `${message.content}\n\n[User is communicating in Urdu. Respond exclusively in Urdu script.]`
          : message.content,
      };
    });
    
    const client = new OpenAI({ apiKey, baseURL: baseUrl });
    const completion = await client.chat.completions.create({
      model: selectedConfig.model,
      messages: [
        { role: 'system', content: systemMessage },
        ...languageAwareMessages
      ],
      temperature: selectedConfig.temperature,
      max_tokens: 1500,
    });
    
    const responseContent = completion.choices[0]?.message?.content || '';
    
    try {
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          answer: parsed.answer || responseContent,
          profileUpdates: parsed.profileUpdates || {},
          intent: parsed.intent,
          followUpQuestion: parsed.followUpQuestion || null,
          recommendedPrograms: parsed.recommendedPrograms || [],
          eligibilityStatus: parsed.eligibilityStatus,
          missingInformation: parsed.missingInformation || [],
          nextSteps: parsed.nextSteps || [],
          sources: parsed.sources || [],
        };
      }
    } catch (parseError) {
      console.log('[Sarkar Sathi API] JSON parse failed');
    }
    
    return {
      answer: responseContent,
      profileUpdates: {},
      intent: 'general_question',
      recommendedPrograms: [],
      missingInformation: [],
      nextSteps: [],
      sources: [],
    };
  };
}
