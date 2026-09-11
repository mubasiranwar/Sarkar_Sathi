import OpenAI from 'openai';

// Sarkar Sathi system prompt
const SYSTEM_PROMPT = `You are Sarkar Sathi, a citizen-service navigation assistant for Pakistan.

Your purpose is to help citizens understand government programs and public services in simple language.

You are NOT the government and must never pretend to be an official government representative.

CRITICAL RULES:
1. ONLY use information from the provided program data below. Never invent or assume information.
2. If the user's query doesn't match any program in the data, say "I don't have information about that specific program in my database."
3. If you need more information to determine eligibility, ASK the user for details (income, family size, occupation, location, etc.)
4. Never make up eligibility criteria, benefit amounts, deadlines, phone numbers, or application procedures that aren't in the provided data.
5. If verified information is unavailable, clearly say "This information needs verification with the relevant government department."

Your approach:
- When a user describes their situation, analyze which programs from the provided data might be relevant
- Ask clarifying questions if you need more information to make accurate recommendations
- Only recommend programs that are explicitly in the provided data
- Explain why each program might be relevant based on the user's situation
- Provide only the eligibility criteria, documents, and steps that are in the provided data

Language:
- Use simple English by default
- If the user writes in Urdu, respond in Urdu
- If the user writes in Roman Urdu, respond in Roman Urdu
- Keep responses concise and actionable

IMPORTANT: When recommending programs, ONLY reference programs from the provided context data.
Include the program IDs in your response so the frontend can display them.

Respond in this JSON format:
{
  "answer": "Your response text here",
  "intent": "financial|education|healthcare|employment|business|housing|agriculture|general",
  "followUpQuestion": "Follow-up question to ask the user, or null if no question needed",
  "recommendedPrograms": ["program-id-1", "program-id-2"],
  "eligibilityConsiderations": ["Consideration 1", "Consideration 2"],
  "documents": ["Document 1", "Document 2"],
  "nextSteps": ["Step 1", "Step 2"],
  "sources": ["Source information"]
}

If you cannot produce valid JSON, respond with plain text.`;

// Program data for context injection
const programs = [
  {
    id: 'bisp-kafaalat',
    name: 'Benazir Kafaalat',
    nameUrdu: 'بینظیر کفالت',
    organization: 'Benazir Income Support Programme (BISP)',
    category: 'Social Protection',
    level: 'Federal',
    purpose: 'Unconditional cash transfer program providing financial support to low-income families across Pakistan.',
    targetGroups: ['Low-income families', 'Women', 'Rural households'],
    eligibility: ['Pakistani citizen with valid CNIC', 'Household poverty score below threshold', 'Female family member must be registered'],
    benefits: ['Quarterly cash transfer of PKR 10,500', 'Direct payment through designated channels'],
    documents: ['Valid CNIC', 'Family registration information', 'Proof of residence', 'Mobile phone number'],
    applicationSteps: ['Visit nearest BISP tehsil office', 'Complete NSER survey', 'Provide CNIC and household info', 'Wait for eligibility determination', 'Receive payment instructions via SMS'],
    applicationChannels: ['BISP Tehsil Offices', 'BISP Helpline: 0800-26477'],
    source: 'BISP Official',
    keywords: ['cash', 'financial', 'support', 'poverty', 'women', 'family', 'welfare', 'bisp', 'benazir']
  },
  {
    id: 'bisp-education-stipend',
    name: 'Waseela-e-Taleem',
    nameUrdu: 'وسیلاِ تعلیم',
    organization: 'Benazir Income Support Programme (BISP)',
    category: 'Education',
    level: 'Federal',
    purpose: 'Conditional cash transfer for families who keep children enrolled in school.',
    targetGroups: ['School-going children', 'Low-income families', 'BISP beneficiary families'],
    eligibility: ['Must be BISP Kafaalat beneficiary', 'Children aged 5-18', 'Minimum 70% attendance'],
    benefits: ['Quarterly education stipend per child', 'Supports primary and secondary education'],
    documents: ['Parent CNIC', 'Child B-Form', 'School enrollment certificate', 'Attendance records'],
    applicationSteps: ['Register as BISP beneficiary', 'Register children through BISP education wing', 'Maintain attendance', 'Receive stipend'],
    applicationChannels: ['BISP Tehsil Offices', 'BISP Education Wing'],
    source: 'BISP Official',
    keywords: ['education', 'school', 'stipend', 'children', 'student', 'scholarship', 'waseela', 'taleem']
  },
  {
    id: 'ehsaas-scholarship',
    name: 'Ehsaas Scholarship Program',
    nameUrdu: 'احساس اسکالرشپ پروگرام',
    organization: 'Higher Education Commission (HEC)',
    category: 'Education',
    level: 'Federal',
    purpose: 'Scholarship for underprivileged students pursuing higher education.',
    targetGroups: ['University students', 'Low-income families', 'Merit-based candidates'],
    eligibility: ['Pakistani citizen', 'Enrolled in HEC-recognized university', 'Minimum 60% marks', 'Family income below PKR 45,000'],
    benefits: ['Full tuition coverage', 'Monthly stipend', 'Book allowance'],
    documents: ['CNIC / B-Form', 'University enrollment letter', 'Academic transcripts', 'Income certificate', 'Domicile certificate'],
    applicationSteps: ['Check eligibility on HEC portal', 'Create account', 'Fill application', 'Upload documents', 'Submit before deadline'],
    applicationChannels: ['HEC Online Portal', 'University financial aid offices'],
    source: 'HEC Official',
    keywords: ['scholarship', 'education', 'university', 'student', 'higher education', 'ehsaas', 'hec']
  },
  {
    id: 'sehat-card',
    name: 'Sehat Sahulat Program',
    nameUrdu: 'صحت سہولت پروگرام',
    organization: 'Government of Pakistan',
    category: 'Health',
    level: 'Federal',
    purpose: 'Health insurance providing free treatment at empaneled hospitals.',
    targetGroups: ['All families', 'Low-income households', 'BISP beneficiaries'],
    eligibility: ['Pakistani citizen', 'Valid CNIC', 'BISP beneficiaries auto-enrolled'],
    benefits: ['Free treatment at empaneled hospitals', 'Maternity services', 'Surgical procedures', 'Coverage up to PKR 10 lakh'],
    documents: ['CNIC', 'Sehat Card'],
    applicationSteps: ['Send CNIC to 8500', 'Collect Sehat Card if eligible', 'Visit empaneled hospital', 'Present card for treatment'],
    applicationChannels: ['SMS to 8500', 'Sehat Card centers', 'Empaneled hospitals'],
    source: 'Sehat Sahulat Program',
    keywords: ['health', 'insurance', 'hospital', 'medical', 'treatment', 'sehat', 'card', 'free']
  },
  {
    id: 'pm-youth-business',
    name: 'PM Youth Business & Agriculture Loan',
    nameUrdu: 'وزیراعظم یوتھ بزنس لون',
    organization: "Prime Minister's Office",
    category: 'Business',
    level: 'Federal',
    purpose: 'Interest-free or low-interest loans for young entrepreneurs.',
    targetGroups: ['Youth (18-35 years)', 'Entrepreneurs', 'Small business owners'],
    eligibility: ['Pakistani citizen aged 18-35', 'Valid CNIC', 'Viable business plan'],
    benefits: ['Loans up to PKR 7.5 million', 'Mark-up free loans up to PKR 500,000', 'Repayment up to 8 years'],
    documents: ['CNIC', 'Business plan', 'Guarantor information'],
    applicationSteps: ['Visit PM Youth Loan portal', 'Submit application with business plan', 'Application reviewed', 'Complete documentation', 'Receive disbursement'],
    applicationChannels: ['PM Youth Loan Portal', 'Participating banks'],
    source: 'PM Youth Program',
    keywords: ['business', 'loan', 'youth', 'entrepreneur', 'startup', 'pm', 'prime minister']
  },
  {
    id: 'nadc',
    name: 'National Agricultural Development Program',
    nameUrdu: 'قومی زرعی ترقیاتی پروگرام',
    organization: 'Ministry of National Food Security',
    category: 'Agriculture',
    level: 'Federal',
    purpose: 'Support for farmers with subsidies, training, and resources.',
    targetGroups: ['Farmers', 'Agriculture workers', 'Rural communities'],
    eligibility: ['Pakistani citizen', 'Engaged in agriculture', 'Land documentation'],
    benefits: ['Subsidized seeds and fertilizers', 'Training programs', 'Equipment access', 'Crop insurance'],
    documents: ['CNIC', 'Land documents', 'Proof of agricultural activity'],
    applicationSteps: ['Contact local agriculture office', 'Register as farmer', 'Apply for subsidy', 'Submit documents', 'Receive benefits'],
    applicationChannels: ['Local Agriculture Extension Offices', 'District Agriculture Department'],
    source: 'Ministry of National Food Security',
    keywords: ['agriculture', 'farming', 'farmer', 'seeds', 'fertilizer', 'crop', 'rural']
  },
  {
    id: 'punjab-housing',
    name: 'Punjab Housing Scheme',
    nameUrdu: 'پنجاب ہاؤسنگ سکیم',
    organization: 'Government of Punjab',
    category: 'Housing',
    level: 'Provincial',
    province: 'Punjab',
    purpose: 'Affordable housing for low and middle-income families.',
    targetGroups: ['Low-income families', 'Middle-income families', 'First-time buyers'],
    eligibility: ['Punjab resident', 'Income within limits', 'No existing property'],
    benefits: ['Subsidized housing', 'Flexible payment plans', 'Secure ownership'],
    documents: ['CNIC', 'Punjab domicile', 'Income proof', 'Affidavit of no property'],
    applicationSteps: ['Check scheme availability', 'Obtain application form', 'Submit with documents', 'Attend balloting', 'Complete payment'],
    applicationChannels: ['Punjab Housing Development Authority', 'Government housing portal'],
    source: 'Punjab Government',
    keywords: ['housing', 'home', 'property', 'punjab', 'affordable']
  },
  {
    id: 'kp-education-support',
    name: 'KP Education Support',
    nameUrdu: 'خیبر پختونخوا تعلیمی امداد',
    organization: 'Government of Khyber Pakhtunkhwa',
    category: 'Education',
    level: 'Provincial',
    province: 'Khyber Pakhtunkhwa',
    purpose: 'Education support for students in KP.',
    targetGroups: ['Students in KP', 'School-going children', 'Low-income families in KP'],
    eligibility: ['KP resident', 'Enrolled in KP institution', 'Income within limits'],
    benefits: ['Free textbooks', 'School supplies', 'Transportation allowance', 'Merit scholarships'],
    documents: ['CNIC / B-Form', 'KP Domicile', 'School enrollment proof', 'Income certificate'],
    applicationSteps: ['Contact local education office', 'Submit application', 'Verification', 'Receive benefits'],
    applicationChannels: ['District Education Offices in KP', 'School administrations'],
    source: 'KP Education Department',
    keywords: ['education', 'kp', 'kpk', 'khyber pakhtunkhwa', 'school', 'textbook']
  },
  {
    id: 'zakat-usthr',
    name: 'Zakat & Ushr Distribution',
    nameUrdu: 'زکوٰۃ اور عشر تقسیم',
    organization: 'Central Zakat Council',
    category: 'Social Protection',
    level: 'Federal',
    purpose: 'Distribution of Zakat funds to deserving individuals.',
    targetGroups: ['Needy individuals', 'Widows', 'Orphans', 'Disabled persons'],
    eligibility: ['Muslim citizen', 'Income below Nisab', 'Valid CNIC'],
    benefits: ['Annual Zakat distribution', 'Monthly stipends', 'Medical assistance', 'Education support'],
    documents: ['CNIC', 'Income declaration', 'Application form', 'Proof of need'],
    applicationSteps: ['Contact local Zakat committee', 'Fill application', 'Submit documents', 'Appear before committee', 'Receive distribution'],
    applicationChannels: ['Local Zakat Committee offices', 'Provincial Zakat Councils'],
    source: 'Central Zakat Council',
    keywords: ['zakat', 'ushr', 'charity', 'welfare', 'needy', 'widow', 'orphan']
  },
  {
    id: 'pesh-worker',
    name: 'Workers Welfare Fund Benefits',
    nameUrdu: 'ورکرز ویلفیئر فنڈ',
    organization: 'Workers Welfare Fund',
    category: 'Employment',
    level: 'Federal',
    purpose: 'Welfare benefits for industrial workers.',
    targetGroups: ['Industrial workers', 'Factory employees', 'Low-wage workers'],
    eligibility: ['Employed in industrial establishment', 'Wages below threshold', 'Valid CNIC'],
    benefits: ['Education grants for children', 'Marriage grants', 'Health support', 'Housing assistance'],
    documents: ['CNIC', 'Employment proof', 'Family details', 'Educational documents'],
    applicationSteps: ['Obtain form from WWF office', 'Complete form', 'Attach documents', 'Submit to WWF', 'Await approval'],
    applicationChannels: ['Workers Welfare Fund offices', 'Labour department offices'],
    source: 'Workers Welfare Fund',
    keywords: ['worker', 'welfare', 'industrial', 'factory', 'employee', 'education grant', 'labour']
  },
  {
    id: 'nasp-computer-literate',
    name: 'NASP Computer Literacy Program',
    nameUrdu: 'قومی مہارت پروگرام',
    organization: 'NAVTTC',
    category: 'Youth',
    level: 'Federal',
    purpose: 'Free computer literacy and IT skills training for youth.',
    targetGroups: ['Youth (18-35)', 'Students', 'Unemployed graduates'],
    eligibility: ['Pakistani citizen 18-35', 'Minimum matriculation', 'Valid CNIC'],
    benefits: ['Free training (3-6 months)', 'Certificate', 'Job placement assistance'],
    documents: ['CNIC', 'Educational certificates', 'Photographs', 'Domicile'],
    applicationSteps: ['Check NAVTC portal', 'Register online', 'Submit documents', 'Selection test', 'Begin training'],
    applicationChannels: ['NAVTTC Online Portal', 'Government training centers'],
    source: 'NAVTTC',
    keywords: ['computer', 'training', 'skills', 'youth', 'IT', 'technology', 'free', 'course']
  },
  {
    id: 'sindh-education-foundation',
    name: 'Sindh Education Foundation Support',
    nameUrdu: 'سندھ ایجوکیشن فاؤنڈیشن',
    organization: 'Sindh Education Foundation',
    category: 'Education',
    level: 'Provincial',
    province: 'Sindh',
    purpose: 'Educational support for students in Sindh.',
    targetGroups: ['Students in Sindh', 'Low-income families'],
    eligibility: ['Sindh resident', 'Enrolled in institution', 'Income within limits'],
    benefits: ['Financial assistance', 'Free textbooks', 'Scholarships'],
    documents: ['CNIC / B-Form', 'Sindh Domicile', 'Enrollment proof', 'Income certificate'],
    applicationSteps: ['Visit SEF office', 'Obtain form', 'Submit documents', 'Verification', 'Receive benefits'],
    applicationChannels: ['SEF offices', 'SEF Website'],
    source: 'Sindh Education Foundation',
    keywords: ['education', 'sindh', 'school', 'student', 'scholarship', 'provincial']
  }
];

function searchPrograms(query) {
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

function buildProgramContext(query) {
  const relevantPrograms = searchPrograms(query);
  
  const lowerQuery = query.toLowerCase();
  const additionalPrograms = programs.filter(p => {
    const keywords = p.keywords.join(' ').toLowerCase();
    return lowerQuery.split(/\s+/).some(term => 
      keywords.includes(term) || 
      p.category.toLowerCase().includes(term) ||
      p.name.toLowerCase().includes(term)
    );
  });
  
  const allRelevant = [...new Set([...relevantPrograms, ...additionalPrograms])];
  const topPrograms = allRelevant.slice(0, 5);
  
  const finalPrograms = topPrograms.length > 0 ? topPrograms : programs.slice(0, 6);
  
  return finalPrograms.map(p => `PROGRAM: ${p.name} (${p.nameUrdu || ''})
ID: ${p.id}
Organization: ${p.organization}
Category: ${p.category}
Level: ${p.level}
${p.province ? `Province: ${p.province}` : ''}
Purpose: ${p.purpose}
Target Groups: ${p.targetGroups.join(', ')}
Eligibility: ${p.eligibility.join('; ')}
Benefits: ${p.benefits.join('; ')}
Required Documents: ${p.documents.join(', ')}
Application Steps: ${p.applicationSteps.join(' → ')}
Application Channels: ${p.applicationChannels.join(', ')}
Source: ${p.source}`).join('\n\n---\n\n');
}

export function createChatHandler() {
  return async function handleChat(messages) {
    const apiKey = process.env.QWEN_API_KEY;
    const model = process.env.QWEN_MODEL || 'Qwen/Qwen3-Max';
    const baseUrl = process.env.QWEN_BASE_URL || 'https://api-inference.modelscope.ai/v1';
    
    if (!apiKey) {
      throw new Error('QWEN_API_KEY not configured');
    }
    
    // Get the last user message for context retrieval
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    const query = lastUserMessage?.content || '';
    
    // Build context from relevant programs
    const programContext = buildProgramContext(query);
    
    // Create OpenAI-compatible client for Qwen via ModelScope
    const client = new OpenAI({
      apiKey: apiKey,
      baseURL: baseUrl,
    });
    
    const completion = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: `${SYSTEM_PROMPT}\n\n=== AVAILABLE GOVERNMENT PROGRAMS ===\n${programContext}\n=== END PROGRAMS ===\n\nUse ONLY the programs listed above when making recommendations. Reference them by their ID.`
        },
        ...messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    const responseContent = completion.choices[0]?.message?.content || '';
    
    // Try to parse as JSON
    try {
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          answer: parsed.answer || responseContent,
          intent: parsed.intent,
          followUpQuestion: parsed.followUpQuestion || null,
          recommendedPrograms: parsed.recommendedPrograms || [],
          eligibilityConsiderations: parsed.eligibilityConsiderations || [],
          documents: parsed.documents || [],
          nextSteps: parsed.nextSteps || [],
          sources: parsed.sources || [],
        };
      }
    } catch (parseError) {
      console.log('[Sarkar Sathi API] JSON parse failed, returning plain text');
    }
    
    return {
      answer: responseContent,
      intent: 'general',
      recommendedPrograms: [],
      eligibilityConsiderations: [],
      documents: [],
      nextSteps: [],
      sources: [],
    };
  };
}
