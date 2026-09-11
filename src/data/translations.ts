export type Language = 'en' | 'ur';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.programs': 'Programs',
    'nav.eligibility': 'Eligibility',
    'nav.assistant': 'Ask Sarkar Sathi',
    'nav.myServices': 'My Sarkar Sathi',
    'nav.about': 'About',
    
    // Home
    'home.hero.title': 'Government services, made simple.',
    'home.hero.subtitle': 'Find programs, understand your eligibility, prepare your documents, and know your next step — all in one place.',
    'home.hero.cta': 'Find Programs',
    'home.hero.cta2': 'Ask Sarkar Sathi',
    'home.search.placeholder': 'e.g. I need financial assistance for my family',
    'home.search.title': 'How can Sarkar Sathi help you?',
    'home.suggestions.1': 'Find financial support',
    'home.suggestions.2': 'Scholarships for students',
    'home.suggestions.3': 'Healthcare programs',
    'home.suggestions.4': 'Business support',
    'home.suggestions.5': 'Youth programs',
    
    // How it works
    'home.how.title': 'How it works',
    'home.how.step1.title': 'Discover',
    'home.how.step1.desc': 'Tell us what you need.',
    'home.how.step2.title': 'Match',
    'home.how.step2.desc': 'Sarkar Sathi finds potentially relevant services.',
    'home.how.step3.title': 'Prepare',
    'home.how.step3.desc': 'See eligibility and required documents.',
    'home.how.step4.title': 'Act',
    'home.how.step4.desc': 'Follow the verified application steps.',
    
    // Trust
    'home.trust.title': 'Trusted information',
    'home.trust.1': 'Information is organized from official and public sources.',
    'home.trust.2': 'Users should verify important information with the relevant government department.',
    'home.trust.3': 'Sarkar Sathi provides guidance, not legal authority.',
    
    // Programs
    'programs.title': 'Government Programs',
    'programs.subtitle': 'Discover programs and services available to you',
    'programs.search': 'Search programs...',
    'programs.filter.category': 'Category',
    'programs.filter.level': 'Level',
    'programs.filter.all': 'All',
    'programs.checkEligibility': 'Check Eligibility',
    'programs.viewDetails': 'View Details',
    'programs.noResults': 'No programs match your current filters.',
    'programs.clearFilters': 'Clear filters',
    
    // Program Detail
    'detail.whoFor': 'Who is this for?',
    'detail.whatYouGet': 'What do you get?',
    'detail.eligibility': 'Basic eligibility',
    'detail.documents': 'Required documents',
    'detail.howToApply': 'How to apply',
    'detail.whereToApply': 'Where to apply',
    'detail.importantInfo': 'Important information',
    'detail.source': 'Source',
    'detail.checkEligibility': 'Check My Eligibility',
    'detail.save': 'Save Program',
    'detail.saved': 'Saved',
    
    // Eligibility
    'eligibility.title': 'Check Your Eligibility',
    'eligibility.step1.title': 'What are you looking for?',
    'eligibility.step2.title': 'Tell us about yourself',
    'eligibility.step3.title': 'Programs that may be relevant to you',
    'eligibility.financial': 'Financial support',
    'eligibility.education': 'Education',
    'eligibility.healthcare': 'Healthcare',
    'eligibility.employment': 'Employment',
    'eligibility.business': 'Business',
    'eligibility.other': 'Other',
    'eligibility.next': 'Next',
    'eligibility.back': 'Back',
    'eligibility.results': 'View Results',
    'eligibility.potentiallyEligible': 'Potentially eligible',
    'eligibility.mayQualify': 'May qualify',
    'eligibility.needsVerification': 'Needs verification',
    'eligibility.whyRelevant': 'Why this may be relevant',
    
    // Assistant
    'assistant.title': 'Ask Sarkar Sathi',
    'assistant.subtitle': 'Your guide to government services',
    'assistant.placeholder': 'Ask about any government service or program...',
    'assistant.send': 'Send',
    'assistant.unavailable': 'AI assistant is temporarily unavailable. You can still browse programs and check eligibility information.',
    'assistant.disclaimer': 'Sarkar Sathi provides guidance based on available information. Always verify important details with the relevant government department.',
    
    // My Services
    'my.title': 'My Sarkar Sathi',
    'my.saved': 'Saved Programs',
    'my.recommended': 'Recommended for You',
    'my.documents': 'Document Checklist',
    'my.nextSteps': 'Next Steps',
    'my.noSaved': 'You haven\'t saved any programs yet.',
    'my.browsePrograms': 'Browse Programs',
    'my.demoProfile': 'Demo Profile',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong.',
    'common.retry': 'Try again',
    'common.learnMore': 'Learn more',
    'common.lastUpdated': 'Last updated',
    'common.verificationNeeded': 'Verification with official source recommended',
    'common.federal': 'Federal',
    'common.provincial': 'Provincial',
    'common.district': 'District',
    
    // Footer
    'footer.tagline': 'Making public services easier to understand.',
    'footer.trust': 'Information should be verified with the relevant official department before taking important action.',
    'footer.notGovernment': 'Sarkar Sathi is not an official government portal. It is a citizen navigation tool.',
  },
  ur: {
    // Navigation
    'nav.home': 'ہوم',
    'nav.programs': 'پروگرام',
    'nav.eligibility': 'اہلیت',
    'nav.assistant': 'سرکار ساتھی سے پوچھیں',
    'nav.myServices': 'میرا سرکار ساتھی',
    'nav.about': 'ہمارے بارے میں',
    
    // Home
    'home.hero.title': 'سرکاری خدمات، آسان زبان میں۔',
    'home.hero.subtitle': 'پروگرام تلاش کریں، اپنی اہلیت سمجھیں، دستاویزات تیار کریں، اور اپنا اگلا قدم جانیں — سب ایک جگہ۔',
    'home.hero.cta': 'پروگرام تلاش کریں',
    'home.hero.cta2': 'سرکار ساتھی سے پوچھیں',
    'home.search.placeholder': 'مثلاً: مجھے اپنے خاندان کے لیے مالی مدد چاہیے',
    'home.search.title': 'سرکار ساتھی آپ کی کیا مدد کر سکتا ہے؟',
    'home.suggestions.1': 'مدد مالی تلاش کریں',
    'home.suggestions.2': 'طلباء کے لیے وظائف',
    'home.suggestions.3': 'صحت کے پروگرام',
    'home.suggestions.4': 'کاروباری مدد',
    'home.suggestions.5': 'نوجوانوں کے پروگرام',
    
    // How it works
    'home.how.title': 'یہ کیسے کام کرتا ہے',
    'home.how.step1.title': 'دریافت کریں',
    'home.how.step1.desc': 'ہمیں بتائیں آپ کو کیا چاہیے۔',
    'home.how.step2.title': 'مماثلت',
    'home.how.step2.desc': 'سرکار ساتھی متعلقہ خدمات تلاش کرتا ہے۔',
    'home.how.step3.title': 'تیاری',
    'home.how.step3.desc': 'اہلیت اور ضروری دستاویزات دیکھیں۔',
    'home.how.step4.title': 'عمل کریں',
    'home.how.step4.desc': 'تصدیق شدہ درخواست کے مراحل پر عمل کریں۔',
    
    // Trust
    'home.trust.title': 'قابل اعتماد معلومات',
    'home.trust.1': 'معلومات سرکاری اور عوامی ذرائع سے منظم کی گئی ہیں۔',
    'home.trust.2': 'اہم معلومات متعلقہ سرکاری محکمے سے تصدیق کریں۔',
    'home.trust.3': 'سرکار ساتھی رہنمائی فراہم کرتا ہے، قانونی اتھارٹی نہیں۔',
    
    // Programs
    'programs.title': 'سرکاری پروگرام',
    'programs.subtitle': 'اپنے لیے دستیاب پروگرام اور خدمات دریافت کریں',
    'programs.search': 'پروگرام تلاش کریں...',
    'programs.filter.category': 'زمرہ',
    'programs.filter.level': 'سطح',
    'programs.filter.all': 'سب',
    'programs.checkEligibility': 'اہلیت چیک کریں',
    'programs.viewDetails': 'تفصیلات دیکھیں',
    'programs.noResults': 'آپ کے فلٹرز سے کوئی پروگرام مطابقت نہیں رکھتا۔',
    'programs.clearFilters': 'فلٹرز صاف کریں',
    
    // Program Detail
    'detail.whoFor': 'یہ کس کے لیے ہے؟',
    'detail.whatYouGet': 'آپ کو کیا ملے گا؟',
    'detail.eligibility': 'بنیادی اہلیت',
    'detail.documents': 'ضروری دستاویزات',
    'detail.howToApply': 'درخواست کیسے دیں',
    'detail.whereToApply': 'کہاں درخواست دیں',
    'detail.importantInfo': 'اہم معلومات',
    'detail.source': 'ماخذ',
    'detail.checkEligibility': 'میری اہلیت چیک کریں',
    'detail.save': 'پروگرام محفوظ کریں',
    'detail.saved': 'محفوظ',
    
    // Eligibility
    'eligibility.title': 'اپنی اہلیت چیک کریں',
    'eligibility.step1.title': 'آپ کیا تلاش کر رہے ہیں؟',
    'eligibility.step2.title': 'اپنے بارے میں بتائیں',
    'eligibility.step3.title': 'آپ کے لیے متعلقہ پروگرام',
    'eligibility.financial': 'مالی مدد',
    'eligibility.education': 'تعلیم',
    'eligibility.healthcare': 'صحت',
    'eligibility.employment': 'روزگار',
    'eligibility.business': 'کاروبار',
    'eligibility.other': 'دیگر',
    'eligibility.next': 'اگلا',
    'eligibility.back': 'پیچھے',
    'eligibility.results': 'نتائج دیکھیں',
    'eligibility.potentiallyEligible': 'ممکنہ طور پر اہل',
    'eligibility.mayQualify': 'اہل ہو سکتے ہیں',
    'eligibility.needsVerification': 'تصدیق درکار',
    'eligibility.whyRelevant': 'یہ متعلقہ کیوں ہو سکتا ہے',
    
    // Assistant
    'assistant.title': 'سرکار ساتھی سے پوچھیں',
    'assistant.subtitle': 'آپ کا سرکاری خدمات کا رہنما',
    'assistant.placeholder': 'کسی بھی سرکاری خدمت یا پروگرام کے بارے میں پوچھیں...',
    'assistant.send': 'بھیجیں',
    'assistant.unavailable': 'اے آئی اسسٹنٹ عارضی طور پر دستیاب نہیں ہے۔ آپ اب بھی پروگرام براؤز کر سکتے ہیں۔',
    'assistant.disclaimer': 'سرکار ساتھی دستیاب معلومات کی بنیاد پر رہنمائی فراہم کرتا ہے۔ اہم تفصیلات ہمیشہ متعلقہ سرکاری محکمے سے تصدیق کریں۔',
    
    // My Services
    'my.title': 'میرا سرکار ساتھی',
    'my.saved': 'محفوظ پروگرام',
    'my.recommended': 'آپ کے لیے تجویز کردہ',
    'my.documents': 'دستاویزات چیک لسٹ',
    'my.nextSteps': 'اگلے اقدامات',
    'my.noSaved': 'آپ نے ابھی تک کوئی پروگرام محفوظ نہیں کیا۔',
    'my.browsePrograms': 'پروگرام دیکھیں',
    'my.demoProfile': 'ڈیمو پروفائل',
    
    // Common
    'common.loading': 'لوڈ ہو رہا ہے...',
    'common.error': 'کچھ غلط ہو گیا۔',
    'common.retry': 'دوبارہ کوشش کریں',
    'common.learnMore': 'مزید جانیں',
    'common.lastUpdated': 'آخری اپڈیٹ',
    'common.verificationNeeded': 'سرکاری ماخذ سے تصدیق کی سفارش',
    'common.federal': 'وفاقی',
    'common.provincial': 'صوبائی',
    'common.district': 'ضلعی',
    
    // Footer
    'footer.tagline': 'عوامی خدمات کو سمجھنا آسان بنانا۔',
    'footer.trust': 'اہم اقدام اٹھانے سے پہلے معلومات متعلقہ سرکاری محکمے سے تصدیق کریں۔',
    'footer.notGovernment': 'سرکار ساتھی کوئی سرکاری پورٹل نہیں ہے۔ یہ شہری رہنمائی کا آلہ ہے۔',
  }
};

export function t(key: string, lang: Language): string {
  return translations[lang][key] || key;
}
