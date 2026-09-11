export interface Program {
  id: string;
  name: string;
  nameUrdu?: string;
  organization: string;
  category: string;
  level: 'Federal' | 'Provincial' | 'District';
  province?: string;
  purpose: string;
  targetGroups: string[];
  eligibility: string[];
  benefits: string[];
  documents: string[];
  applicationSteps: string[];
  applicationChannels: string[];
  source: string;
  sourceUrl?: string;
  lastUpdated: string;
  verificationStatus: 'verified' | 'needs-verification' | 'unverified';
  keywords: string[];
}

export const programs: Program[] = [
  {
    id: 'nasp-computer-literate',
    name: 'NASP Computer Literacy Program',
    nameUrdu: 'قومی مہارت پروگرام',
    organization: 'National Vocational & Technical Training Commission (NAVTTC)',
    category: 'Youth',
    level: 'Federal',
    purpose: 'Free computer literacy and IT skills training program for youth across Pakistan.',
    targetGroups: ['Youth (18-35 years)', 'Students', 'Unemployed graduates'],
    eligibility: [
      'Pakistani citizen aged 18-35',
      'Minimum matriculation education',
      'Valid CNIC',
      'Not currently enrolled in similar government training program'
    ],
    benefits: [
      'Free computer literacy training (3-6 months)',
      'Certificate upon completion',
      'Job placement assistance',
      'Access to IT infrastructure'
    ],
    documents: [
      'CNIC',
      'Educational certificates',
      'Passport-size photographs',
      'Domicile certificate'
    ],
    applicationSteps: [
      'Check NAVTC portal for available courses',
      'Register online or visit nearest training center',
      'Submit required documents',
      'Appear for selection test (if applicable)',
      'Begin training upon selection'
    ],
    applicationChannels: [
      'NAVTTC Online Portal',
      'Government technical training centers',
      'Partner institutions nationwide'
    ],
    source: 'NAVTTC Official Information',
    lastUpdated: '2024',
    verificationStatus: 'needs-verification',
    keywords: ['computer', 'training', 'skills', 'youth', 'IT', 'technology', 'education', 'free', 'course']
  },
  {
    id: 'sindh-education-foundation',
    name: 'Sindh Education Foundation Support',
    nameUrdu: 'سندھ ایجوکیشن فاؤنڈیشن',
    organization: 'Sindh Education Foundation',
    category: 'Education',
    level: 'Provincial',
    province: 'Sindh',
    purpose: 'Educational support program providing financial assistance and resources to students in Sindh province.',
    targetGroups: ['Students in Sindh', 'Low-income families', 'School-going children'],
    eligibility: [
      'Sindh resident with valid domicile',
      'Enrolled in recognized educational institution',
      'Family income within program limits',
      'Pakistani citizen'
    ],
    benefits: [
      'Financial assistance for education expenses',
      'Free textbooks and supplies',
      'Scholarship support for meritorious students',
      'Access to learning resources'
    ],
    documents: [
      'CNIC / B-Form',
      'Sindh Domicile certificate',
      'School/College enrollment proof',
      'Income certificate / affidavit',
      'Academic records'
    ],
    applicationSteps: [
      'Visit SEF office or website',
      'Obtain application form',
      'Submit with required documents',
      'Verification by SEF team',
      'Receive benefits if approved'
    ],
    applicationChannels: [
      'Sindh Education Foundation offices',
      'SEF Website',
      'District education departments in Sindh'
    ],
    source: 'Sindh Education Foundation',
    lastUpdated: '2024',
    verificationStatus: 'needs-verification',
    keywords: ['education', 'sindh', 'school', 'student', 'scholarship', 'textbook', 'provincial']
  },
  {
    id: 'bisp-kafaalat',
    name: 'Benazir Kafaalat',
    nameUrdu: 'بینظیر کفالت',
    organization: 'Benazir Income Support Programme (BISP)',
    category: 'Social Protection',
    level: 'Federal',
    purpose: 'Unconditional cash transfer program providing financial support to low-income families across Pakistan.',
    targetGroups: ['Low-income families', 'Women', 'Rural households'],
    eligibility: [
      'Pakistani citizen with valid CNIC',
      'Household poverty score below threshold (determined by NSER survey)',
      'Female family member must be registered',
      'Not receiving overlapping social protection benefits'
    ],
    benefits: [
      'Quarterly cash transfer of PKR 10,500 (subject to revision)',
      'Direct payment through designated channels',
      'Access to additional BISP programs'
    ],
    documents: [
      'Valid CNIC (Computerized National Identity Card)',
      'Family registration information',
      'Proof of residence',
      'Mobile phone number for verification'
    ],
    applicationSteps: [
      'Visit nearest BISP tehsil office or registration center',
      'Complete NSER (National Socio-Economic Registry) survey',
      'Provide CNIC and household information',
      'Wait for eligibility determination based on poverty score',
      'If eligible, receive payment instructions via SMS'
    ],
    applicationChannels: [
      'BISP Tehsil Offices nationwide',
      'BISP Dynamic Registry Centers',
      'BISP Helpline: 0800-26477'
    ],
    source: 'BISP Official Program Information',
    sourceUrl: 'https://bisp.gov.pk',
    lastUpdated: '2024',
    verificationStatus: 'needs-verification',
    keywords: ['cash', 'financial', 'support', 'poverty', 'women', 'family', 'welfare', 'bisp', 'benazir']
  },
  {
    id: 'bisp-education-stipend',
    name: 'Waseela-e-Taleem',
    nameUrdu: 'وسیلاِ تعلیم',
    organization: 'Benazir Income Support Programme (BISP)',
    category: 'Education',
    level: 'Federal',
    purpose: 'Conditional cash transfer program that provides stipends to families who keep their children enrolled in school.',
    targetGroups: ['School-going children', 'Low-income families', 'BISP beneficiary families'],
    eligibility: [
      'Must be a BISP Kafaalat beneficiary family',
      'Children aged 5-18 years',
      'Children must be enrolled in recognized educational institution',
      'Minimum 70% school attendance required'
    ],
    benefits: [
      'Quarterly education stipend per child',
      'Additional incentive for enrollment and attendance',
      'Supports primary and secondary education'
    ],
    documents: [
      'Parent CNIC',
      'Child B-Form (CRC)',
      'School enrollment certificate',
      'Attendance records'
    ],
    applicationSteps: [
      'Must first be registered as BISP Kafaalat beneficiary',
      'Register children through BISP education wing',
      'Ensure children are enrolled in school',
      'Maintain minimum attendance requirements',
      'Receive stipend payments through designated channels'
    ],
    applicationChannels: [
      'BISP Tehsil Offices',
      'BISP Education Wing',
      'Partner schools and institutions'
    ],
    source: 'BISP Official Program Information',
    sourceUrl: 'https://bisp.gov.pk',
    lastUpdated: '2024',
    verificationStatus: 'needs-verification',
    keywords: ['education', 'school', 'stipend', 'children', 'student', 'scholarship', 'waseela', 'taleem']
  },
  {
    id: 'ehsaas-scholarship',
    name: 'Ehsaas Scholarship Program',
    nameUrdu: 'احساس اسکالرشپ پروگرام',
    organization: 'Higher Education Commission (HEC)',
    category: 'Education',
    level: 'Federal',
    purpose: 'Scholarship program for underprivileged students pursuing higher education at recognized universities.',
    targetGroups: ['University students', 'Low-income families', 'Merit-based candidates'],
    eligibility: [
      'Pakistani citizen',
      'Enrolled in HEC-recognized university',
      'Minimum 60% marks or equivalent CGPA',
      'Family monthly income below PKR 45,000',
      'Not receiving other HEC scholarships'
    ],
    benefits: [
      'Full tuition fee coverage',
      'Monthly stipend for living expenses',
      'Book allowance',
      'Coverage for up to 4 years of undergraduate study'
    ],
    documents: [
      'CNIC / B-Form',
      'University enrollment letter',
      'Academic transcripts',
      'Income certificate / affidavit',
      'Father/Guardian CNIC',
      'Domicile certificate'
    ],
    applicationSteps: [
      'Check eligibility on HEC scholarship portal',
      'Create account on HEC online portal',
      'Fill scholarship application form',
      'Upload required documents',
      'Submit application before deadline',
      'Await merit-based selection results'
    ],
    applicationChannels: [
      'HEC Online Scholarship Portal',
      'University financial aid offices'
    ],
    source: 'HEC Official Scholarship Information',
    sourceUrl: 'https://www.hec.gov.pk',
    lastUpdated: '2024',
    verificationStatus: 'needs-verification',
    keywords: ['scholarship', 'education', 'university', 'student', 'higher education', 'ehsaas', 'hec']
  },
  {
    id: 'sehat-card',
    name: 'Sehat Sahulat Program',
    nameUrdu: 'صحت سہولت پروگرام',
    organization: 'Government of Pakistan / Provincial Health Departments',
    category: 'Health',
    level: 'Federal',
    purpose: 'Health insurance program providing free treatment at empaneled hospitals for eligible families.',
    targetGroups: ['All families', 'Low-income households', 'BISP beneficiaries (automatic enrollment)'],
    eligibility: [
      'Pakistani citizen',
      'Valid CNIC',
      'BISP beneficiaries automatically enrolled',
      'Other families may qualify based on provincial criteria'
    ],
    benefits: [
      'Free treatment at empaneled hospitals',
      'Coverage for secondary and tertiary care',
      'Maternity services',
      'Surgical procedures',
      'Coverage up to PKR 10 lakh per family per year (varies by province)'
    ],
    documents: [
      'CNIC of family head',
      'Family members CNIC / B-Form',
      'Sehat Card (if issued)'
    ],
    applicationSteps: [
      'Check eligibility by sending CNIC number to 8500',
      'If eligible, collect Sehat Card from designated center',
      'Visit any empaneled hospital for treatment',
      'Present Sehat Card at hospital registration',
      'Receive treatment — hospital handles claims directly'
    ],
    applicationChannels: [
      'SMS to 8500 (send CNIC number)',
      'Sehat Card centers',
      'Empaneled hospitals'
    ],
    source: 'Sehat Sahulat Program Official Information',
    lastUpdated: '2024',
    verificationStatus: 'needs-verification',
    keywords: ['health', 'insurance', 'hospital', 'medical', 'treatment', 'sehat', 'card', 'free']
  },
  {
    id: 'punjab-housing',
    name: 'Punjab Housing Scheme',
    nameUrdu: 'پنجاب ہاؤسنگ سکیم',
    organization: 'Government of Punjab',
    category: 'Housing',
    level: 'Provincial',
    province: 'Punjab',
    purpose: 'Affordable housing initiative providing subsidized housing options for low and middle-income families in Punjab.',
    targetGroups: ['Low-income families', 'Middle-income families', 'First-time home buyers'],
    eligibility: [
      'Punjab resident with valid domicile',
      'Monthly household income within scheme limits',
      'No existing property ownership',
      'Pakistani citizen',
      'CNIC holder'
    ],
    benefits: [
      'Subsidized housing units',
      'Flexible payment plans',
      'Government-subsidized rates',
      'Secure property ownership'
    ],
    documents: [
      'CNIC',
      'Punjab domicile certificate',
      'Income proof / salary slip',
      'Affidavit of no property ownership',
      'Family registration details'
    ],
    applicationSteps: [
      'Check current scheme availability on Punjab government portal',
      'Obtain application form from designated office',
      'Submit completed form with required documents',
      'Attend balloting/selection process',
      'If selected, complete payment plan formalities'
    ],
    applicationChannels: [
      'Punjab Housing Development Authority offices',
      'Government housing portal'
    ],
    source: 'Punjab Government Housing Initiative',
    lastUpdated: '2024',
    verificationStatus: 'needs-verification',
    keywords: ['housing', 'home', 'property', 'punjab', 'affordable', 'house']
  },
  {
    id: 'pm-youth-business',
    name: 'Prime Minister Youth Business & Agriculture Loan',
    nameUrdu: 'وزیراعظم یوتھ بزنس اینڈ ایگریکلچر لون',
    organization: 'Prime Minister\'s Office / Ministry of Youth Affairs',
    category: 'Business',
    level: 'Federal',
    purpose: 'Interest-free or low-interest loans for young entrepreneurs to start or expand businesses.',
    targetGroups: ['Youth (18-35 years)', 'Entrepreneurs', 'Small business owners', 'Agriculture workers'],
    eligibility: [
      'Pakistani citizen aged 18-35',
      'Valid CNIC',
      'Viable business plan',
      'No default on existing government loans',
      'For agriculture: land ownership or lease documentation'
    ],
    benefits: [
      'Loans up to PKR 7.5 million (tiered)',
      'Mark-up free loans up to PKR 500,000',
      'Repayment period up to 8 years',
      'Business training support'
    ],
    documents: [
      'CNIC',
      'Business plan',
      'Recommendation letter (if applicable)',
      'Proof of business registration (if existing)',
      'Guarantor information',
      'For agriculture: land documents'
    ],
    applicationSteps: [
      'Visit PM Youth Loan portal or designated bank',
      'Submit loan application with business plan',
      'Application reviewed by bank/committee',
      'If approved, complete loan documentation',
      'Receive disbursement as per approved terms'
    ],
    applicationChannels: [
      'PM Youth Loan Portal (online)',
      'Participating banks nationwide',
      'You Affairs offices'
    ],
    source: 'Prime Minister Youth Program',
    lastUpdated: '2024',
    verificationStatus: 'needs-verification',
    keywords: ['business', 'loan', 'youth', 'entrepreneur', 'startup', 'agriculture', 'pm', 'prime minister']
  },
  {
    id: 'nadc',
    name: 'National Agricultural Development Program',
    nameUrdu: 'قومی زرعی ترقیاتی پروگرام',
    organization: 'Ministry of National Food Security & Research',
    category: 'Agriculture',
    level: 'Federal',
    purpose: 'Support program for farmers providing subsidies, training, and resources for agricultural development.',
    targetGroups: ['Farmers', 'Agriculture workers', 'Rural communities', 'Small landholders'],
    eligibility: [
      'Pakistani citizen',
      'Engaged in agricultural activities',
      'Land ownership or lease documentation',
      'Valid CNIC'
    ],
    benefits: [
      'Subsidized seeds and fertilizers',
      'Agricultural training programs',
      'Access to modern farming equipment',
      'Crop insurance support',
      'Market linkage assistance'
    ],
    documents: [
      'CNIC',
      'Land ownership/lease documents',
      'Proof of agricultural activity',
      'Agriculture department registration (if applicable)'
    ],
    applicationSteps: [
      'Contact local agriculture extension office',
      'Register as farmer with agriculture department',
      'Apply for relevant subsidy or support program',
      'Submit required documents',
      'Receive benefits through designated channels'
    ],
    applicationChannels: [
      'Local Agriculture Extension Offices',
      'District Agriculture Department',
      'Provincial Agriculture Directorates'
    ],
    source: 'Ministry of National Food Security & Research',
    lastUpdated: '2024',
    verificationStatus: 'needs-verification',
    keywords: ['agriculture', 'farming', 'farmer', 'seeds', 'fertilizer', 'crop', 'rural', 'land']
  },
  {
    id: 'kp-education-support',
    name: 'Khyber Pakhtunkhwa Education Support',
    nameUrdu: 'خیبر پختونخوا تعلیمی امداد',
    organization: 'Government of Khyber Pakhtunkhwa / Elementary & Secondary Education Department',
    category: 'Education',
    level: 'Provincial',
    province: 'Khyber Pakhtunkhwa',
    purpose: 'Provincial education support program providing resources and assistance to students in KP.',
    targetGroups: ['Students in KP', 'School-going children', 'Low-income families in KP'],
    eligibility: [
      'KP resident with valid domicile',
      'Enrolled in recognized educational institution in KP',
      'Family income within program limits',
      'Pakistani citizen'
    ],
    benefits: [
      'Free textbooks',
      'School supplies support',
      'Transportation allowance in some districts',
      'Merit-based scholarships'
    ],
    documents: [
      'CNIC / B-Form',
      'KP Domicile certificate',
      'School enrollment proof',
      'Income certificate'
    ],
    applicationSteps: [
      'Contact local education department office',
      'Submit application with required documents',
      'Verification by education department',
      'Receive benefits through school or designated channel'
    ],
    applicationChannels: [
      'District Education Offices in KP',
      'School administrations',
      'KP Education Department portal'
    ],
    source: 'KP Elementary & Secondary Education Department',
    lastUpdated: '2024',
    verificationStatus: 'needs-verification',
    keywords: ['education', 'kp', 'kpk', 'khyber pakhtunkhwa', 'school', 'textbook', 'student', 'provincial']
  },
  {
    id: 'zakat-usthr',
    name: 'Zakat & Ushr Distribution',
    nameUrdu: 'زکوٰۃ اور عشر تقسیم',
    organization: 'Central Zakat Council / Provincial Zakat Councils',
    category: 'Social Protection',
    level: 'Federal',
    purpose: 'Distribution of Zakat funds to eligible deserving individuals and families.',
    targetGroups: ['Needy individuals', 'Widows', 'Orphans', 'Disabled persons', 'Low-income families'],
    eligibility: [
      'Muslim Pakistani citizen',
      'Income/assets below Nisab threshold',
      'Valid CNIC',
      'Recommendation from local Zakat committee (in some cases)'
    ],
    benefits: [
      'Annual Zakat distribution (amount varies)',
      'Monthly stipends for widows/orphans in some councils',
      'Medical assistance grants',
      'Education support for children'
    ],
    documents: [
      'CNIC',
      'Income/asset declaration',
      'Application form from local Zakat committee',
      'Recommendation letters (if required)',
      'Proof of need'
    ],
    applicationSteps: [
      'Contact local Zakat committee or council office',
      'Obtain and fill application form',
      'Submit with required documents',
      'Appear before committee if required',
      'Receive Zakat distribution if approved'
    ],
    applicationChannels: [
      'Local Zakat Committee offices',
      'Provincial Zakat Councils',
      'District administration offices'
    ],
    source: 'Central Zakat Council',
    lastUpdated: '2024',
    verificationStatus: 'needs-verification',
    keywords: ['zakat', 'ushr', 'charity', 'welfare', 'needy', 'widow', 'orphan', 'financial']
  },
  {
    id: 'pesh-worker',
    name: 'Workers Welfare Fund Benefits',
    nameUrdu: 'ورکرز ویلفیئر فنڈ',
    organization: 'Workers Welfare Fund / Ministry of Labour',
    category: 'Employment',
    level: 'Federal',
    purpose: 'Welfare benefits for industrial workers including education grants, marriage grants, and health support.',
    targetGroups: ['Industrial workers', 'Factory employees', 'Low-wage workers'],
    eligibility: [
      'Employed in industrial establishment',
      'Monthly wages below specified threshold',
      'Worker or family member of worker',
      'Valid CNIC'
    ],
    benefits: [
      'Education grants for workers\' children',
      'Marriage grants for workers\' daughters',
      'Health support grants',
      'Housing assistance in some cases'
    ],
    documents: [
      'CNIC',
      'Employment proof / salary slip',
      'Family registration details',
      'Educational documents (for education grants)',
      'Application form'
    ],
    applicationSteps: [
      'Obtain application form from WWF office',
      'Complete form with required details',
      'Attach supporting documents',
      'Submit to nearest WWF office',
      'Await verification and approval'
    ],
    applicationChannels: [
      'Workers Welfare Fund regional offices',
      'Labour department offices',
      'WWF online portal (where available)'
    ],
    source: 'Workers Welfare Fund',
    lastUpdated: '2024',
    verificationStatus: 'needs-verification',
    keywords: ['worker', 'welfare', 'industrial', 'factory', 'employee', 'education grant', 'marriage', 'labour']
  }
];

export const categories = [
  { id: 'social-protection', name: 'Social Protection', nameUrdu: 'سماجی تحفظ', icon: 'Shield' },
  { id: 'education', name: 'Education', nameUrdu: 'تعلیم', icon: 'GraduationCap' },
  { id: 'health', name: 'Health', nameUrdu: 'صحت', icon: 'Heart' },
  { id: 'youth', name: 'Youth', nameUrdu: 'نوجوان', icon: 'Users' },
  { id: 'employment', name: 'Employment', nameUrdu: 'روزگار', icon: 'Briefcase' },
  { id: 'business', name: 'Business', nameUrdu: 'کاروبار', icon: 'Store' },
  { id: 'agriculture', name: 'Agriculture', nameUrdu: 'زراعت', icon: 'Sprout' },
  { id: 'housing', name: 'Housing', nameUrdu: 'رہائش', icon: 'Home' },
];
