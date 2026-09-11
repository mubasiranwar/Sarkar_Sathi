export interface ProgramSource {
  name: string;
  url: string;
  verifiedAt: string;
  verificationStatus: 'official' | 'needs-verification';
}

export interface EligibilityCriteria {
  age?: { min?: number; max?: number; note?: string };
  income?: { maxMonthly?: number; note?: string };
  familyStatus?: string[];
  location?: { provinces?: string[]; note?: string };
  occupation?: string[];
  education?: string;
  other?: string[];
}

export interface VerifiedProgram {
  id: string;
  name: string;
  nameUrdu?: string;
  organization: string;
  level: 'Federal' | 'Provincial' | 'District';
  province?: string[];
  category: string[];
  purpose: string;
  description: string;
  targetGroups: string[];
  eligibility: EligibilityCriteria;
  benefits: string[];
  documents: string[];
  applicationSteps: string[];
  applicationChannels: string[];
  keywords: string[];
  source: ProgramSource;
  relatedPrograms?: string[];
}

export const verifiedPrograms: VerifiedProgram[] = [
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
    documents: [
      'Valid CNIC',
      'NSER registration (if not already registered)',
    ],
    applicationSteps: [
      'Visit nearest BISP tehsil office or registration center',
      'Complete NSER survey if not already registered',
      'Wait for eligibility determination based on PMT score',
      'If eligible, receive payment instructions via SMS',
    ],
    applicationChannels: [
      'BISP Tehsil Offices',
      'BISP Dynamic Registry Centers',
      'Official BISP website: https://www.bisp.gov.pk/',
    ],
    keywords: ['cash', 'financial', 'support', 'poverty', 'women', 'family', 'welfare', 'bisp', 'benazir', 'kafaalat', 'money', 'stipend'],
    source: {
      name: 'Benazir Income Support Programme',
      url: 'https://www.bisp.gov.pk/',
      verifiedAt: '2026-01-15',
      verificationStatus: 'official',
    },
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
      age: {
        note: 'Primary: 4-12 years, Secondary: 8-18 years, Higher Secondary: 13-22 years',
      },
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
    documents: [
      'Parent CNIC (must be BISP Kafaalat beneficiary)',
      'Child B-Form',
      'School enrollment certificate',
      'Attendance records',
    ],
    applicationSteps: [
      'Must first be registered as BISP Kafaalat beneficiary',
      'Register children through BISP education wing',
      'Ensure children are enrolled in school',
      'Maintain minimum 70% attendance',
      'Receive stipend payments through designated channels',
    ],
    applicationChannels: [
      'BISP Tehsil Offices',
      'BISP Education Wing',
      'Official BISP website: https://www.bisp.gov.pk/',
    ],
    keywords: ['education', 'school', 'stipend', 'children', 'student', 'scholarship', 'waseela', 'taleem', 'taleemi', 'wazaif'],
    source: {
      name: 'Benazir Income Support Programme',
      url: 'https://www.bisp.gov.pk/',
      verifiedAt: '2026-01-15',
      verificationStatus: 'official',
    },
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
    benefits: [
      'Conditional cash transfers',
      'Specialized nutritious food',
      'Social and behavioral change communication',
      'Maternal, newborn and child health services',
    ],
    documents: [
      'Valid CNIC',
      'Pregnancy screening (where applicable)',
      'Family Registration Certificate (FRC) for child registration',
      'Immunization card',
    ],
    applicationSteps: [
      'Must be BISP Kafaalat beneficiary',
      'Visit nearest Nashonuma center in rollout area',
      'Complete registration and screening',
      'Attend regular health checkups',
      'Receive benefits as per program guidelines',
    ],
    applicationChannels: [
      'BISP Nashonuma Centers',
      'Selected government health facilities',
      'Official BISP website: https://www.bisp.gov.pk/',
    ],
    keywords: ['nutrition', 'health', 'pregnant', 'lactating', 'child', 'maternal', 'nashonuma', 'baby', 'infant'],
    source: {
      name: 'Benazir Income Support Programme',
      url: 'https://www.bisp.gov.pk/',
      verifiedAt: '2026-01-15',
      verificationStatus: 'official',
    },
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
    benefits: [
      'Financial assistance for medical treatment',
      'Support for medicines',
      'Artificial limbs and hearing aids support',
      'Other medical assistance as per criteria',
    ],
    documents: [
      'Patient CNIC',
      'Medical documentation from qualified doctor',
      'Disease/medicine specific form (download from PBM website)',
      'Application form',
    ],
    applicationSteps: [
      'Visit official PBM forms page: https://www.pbm.gov.pk/Pbm-Function.html',
      'Read applicable criteria',
      'Download relevant disease/medicine form',
      'Have required medical documentation completed by doctor',
      'Submit application with photocopy of patient CNIC to PBM office/hospital desk',
    ],
    applicationChannels: [
      'PBM Regional/Provincial/Head Offices',
      'PBM hospital desks',
      'Official PBM website: https://www.pbm.gov.pk/',
    ],
    keywords: ['medical', 'health', 'treatment', 'medicine', 'hospital', 'patient', 'disease', 'pbm', 'bait-ul-mal'],
    source: {
      name: 'Pakistan Bait-ul-Mal',
      url: 'https://www.pbm.gov.pk/',
      verifiedAt: '2026-01-15',
      verificationStatus: 'official',
    },
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
    documents: [
      'Valid CNIC',
      'Business plan',
      'Proof of business registration (if existing)',
      'Guarantor information',
      'For agriculture: land documents',
    ],
    applicationSteps: [
      'Visit official PMYP website: https://pmybals.pmyp.gov.pk/',
      'Create account and fill online application',
      'Upload business plan and required documents',
      'Application reviewed by participating bank',
      'If approved, complete loan documentation',
      'Receive disbursement as per approved terms',
    ],
    applicationChannels: [
      'Official PMYP website: https://pmybals.pmyp.gov.pk/',
      'Participating banks',
    ],
    keywords: ['business', 'loan', 'youth', 'entrepreneur', 'startup', 'agriculture', 'pmyp', 'prime minister', 'farming'],
    source: {
      name: 'Prime Minister\'s Youth Programme',
      url: 'https://pmybals.pmyp.gov.pk/',
      verifiedAt: '2026-01-15',
      verificationStatus: 'official',
    },
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
    benefits: [
      'Medicines',
      'Treatment expenses',
      'Patient support',
      'Psychosocial support',
      'Referrals and rehabilitation support',
    ],
    documents: [
      'CNIC',
      'Medical documentation',
      'Proof of financial need',
    ],
    applicationSteps: [
      'Visit Medical Social Services Unit in government hospital',
      'Submit application with required documents',
      'Case assessment by social welfare officer',
      'Receive assistance as per eligibility',
    ],
    applicationChannels: [
      'Medical Social Services Units in government hospitals',
      'Social Welfare Department, Punjab',
      'Official website: https://swd.punjab.gov.pk/medical_social_services',
    ],
    keywords: ['medical', 'health', 'hospital', 'punjab', 'social welfare', 'patient', 'treatment'],
    source: {
      name: 'Social Welfare Department, Government of Punjab',
      url: 'https://swd.punjab.gov.pk/medical_social_services',
      verifiedAt: '2026-01-15',
      verificationStatus: 'official',
    },
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
    eligibility: {
      location: { provinces: ['Punjab'] },
    },
    benefits: [
      'Epidemics Prevention and Control',
      'Expanded Programme on Immunization (EPI)',
      'Reproductive, Maternal, Newborn, Child Health & Nutrition',
      'Family Planning & Primary Health Care',
      'Hepatitis Prevention and Control',
      'AIDS Control Program',
      'Malaria Control Program',
      'TB Control Program',
      'Health Education Program',
      'School Health & Nutrition Program',
      'Non-Communicable Diseases Prevention',
    ],
    documents: [
      'CNIC',
      'Relevant medical records',
    ],
    applicationSteps: [
      'Visit nearest government health facility',
      'Access relevant public health services',
      'Follow program-specific guidelines',
    ],
    applicationChannels: [
      'Government hospitals and health facilities',
      'Basic Health Units (BHUs)',
      'Rural Health Centers (RHCs)',
      'Official website: https://dghs.punjab.gov.pk/programs',
    ],
    keywords: ['health', 'public health', 'immunization', 'vaccination', 'punjab', 'disease control', 'maternal health'],
    source: {
      name: 'Directorate General Health Services, Government of Punjab',
      url: 'https://dghs.punjab.gov.pk/programs',
      verifiedAt: '2026-01-15',
      verificationStatus: 'official',
    },
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
    eligibility: {
      location: { provinces: ['Punjab'] },
      age: { note: 'Age requirements vary by trade' },
    },
    benefits: [
      '250+ demand-driven trades',
      'Training through 750+ private-sector partners',
      'Thousands of training opportunities',
      'Industry-relevant skills',
      'Employment assistance',
    ],
    documents: [
      'CNIC',
      'Educational certificates',
      'Domicile certificate',
    ],
    applicationSteps: [
      'Visit PSDF website to explore available trades',
      'Select preferred training program',
      'Apply through designated training partner',
      'Complete training program',
      'Receive certification and employment assistance',
    ],
    applicationChannels: [
      'PSDF website: https://www.psdf.org.pk/',
      'Private-sector training partners',
    ],
    keywords: ['skills', 'training', 'employment', 'vocational', 'punjab', 'youth', 'jobs', 'psdf'],
    source: {
      name: 'Punjab Skills Development Fund',
      url: 'https://www.psdf.org.pk/',
      verifiedAt: '2026-01-15',
      verificationStatus: 'official',
    },
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
    eligibility: {
      familyStatus: ['Poor and deserving households'],
    },
    benefits: [
      'Registration for BISP programs',
      'Eligibility assessment for social protection programs',
    ],
    documents: [
      'CNIC of household head',
      'Family registration information',
      'Proof of residence',
    ],
    applicationSteps: [
      'Visit nearest BISP tehsil office or NSER registration center',
      'Complete NSER survey questionnaire',
      'Provide household information',
      'Receive PMT score',
      'If eligible, enroll in relevant BISP programs',
    ],
    applicationChannels: [
      'BISP Tehsil Offices',
      'NSER Dynamic Registry Centers',
      'Official BISP website: https://www.bisp.gov.pk/',
    ],
    keywords: ['nser', 'registration', 'survey', 'pmt', 'bisp', 'social protection'],
    source: {
      name: 'Benazir Income Support Programme',
      url: 'https://www.bisp.gov.pk/',
      verifiedAt: '2026-01-15',
      verificationStatus: 'official',
    },
    relatedPrograms: ['bisp_kafaalat'],
  },
];
