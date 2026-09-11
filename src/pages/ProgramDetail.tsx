import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../data/translations';
import { verifiedPrograms } from '../data/verifiedPrograms';
import { 
  ArrowLeft, Bookmark, BookmarkCheck, ExternalLink, 
  CheckCircle2, AlertTriangle, MapPin, Building, 
  FileText, ListChecks, ChevronRight, Shield, Info
} from 'lucide-react';

const categoryColors: Record<string, string> = {
  'social_protection': 'bg-blue-50 text-blue-700 border-blue-200',
  'financial_assistance': 'bg-green-50 text-green-700 border-green-200',
  'education': 'bg-purple-50 text-purple-700 border-purple-200',
  'health': 'bg-red-50 text-red-700 border-red-200',
  'nutrition': 'bg-pink-50 text-pink-700 border-pink-200',
  'business': 'bg-amber-50 text-amber-700 border-amber-200',
  'agriculture': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'skills': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'employment': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'registration': 'bg-gray-50 text-gray-700 border-gray-200',
  'public_health': 'bg-teal-50 text-teal-700 border-teal-200',
};

export default function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { language, savedPrograms, toggleSaveProgram, setDocumentStatus, documentChecklist } = useApp();
  const navigate = useNavigate();
  
  const program = id ? verifiedPrograms.find(p => p.id === id) : undefined;
  
  if (!program) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-navy-50 rounded-full flex items-center justify-center">
          <FileText className="w-7 h-7 text-navy-300" />
        </div>
        <h1 className="text-xl font-semibold text-navy-900 mb-2">Program not found</h1>
        <p className="text-navy-500 mb-4">The program you're looking for doesn't exist or has been removed.</p>
        <Link to="/programs" className="text-navy-700 font-medium hover:text-navy-900">
          ← Back to Programs
        </Link>
      </div>
    );
  }
  
  const isSaved = savedPrograms.includes(program.id);
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-navy-500 mb-6">
        <Link to="/programs" className="hover:text-navy-700">Programs</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-navy-800 font-medium">{program.name}</span>
      </nav>
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {program.category.map((cat, i) => (
                <span key={i} className={`px-2.5 py-1 rounded-md text-xs font-medium border ${categoryColors[cat] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                  {cat.replace('_', ' ')}
                </span>
              ))}
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-navy-50 text-navy-700 border border-navy-200 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {program.level}
              </span>
              {program.province && program.province.length > 0 && (
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-navy-50 text-navy-700 border border-navy-200">
                  {program.province.join(', ')}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-1">
              {language === 'ur' && program.nameUrdu ? program.nameUrdu : program.name}
            </h1>
            <p className="text-navy-500 flex items-center gap-2">
              <Building className="w-4 h-4" />
              {program.organization}
            </p>
          </div>
          <button
            onClick={() => toggleSaveProgram(program.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
              isSaved 
                ? 'bg-navy-50 border-navy-300 text-navy-800' 
                : 'bg-white border-navy-200 text-navy-600 hover:bg-navy-50'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {isSaved ? t('detail.saved', language) : t('detail.save', language)}
          </button>
        </div>
        <p className="text-navy-700 leading-relaxed">{program.purpose}</p>
      </div>
      
      {/* Content Sections */}
      <div className="space-y-8">
        {/* Who is this for */}
        <section>
          <h2 className="text-lg font-semibold text-navy-900 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-navy-600" />
            {t('detail.whoFor', language)}
          </h2>
          <div className="flex flex-wrap gap-2">
            {program.targetGroups.map((group, i) => (
              <span key={i} className="px-3 py-1.5 bg-navy-50 text-navy-700 rounded-lg text-sm border border-navy-100">
                {group}
              </span>
            ))}
          </div>
        </section>
        
        {/* What do you get */}
        <section>
          <h2 className="text-lg font-semibold text-navy-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            {t('detail.whatYouGet', language)}
          </h2>
          <ul className="space-y-2">
            {program.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-2 text-navy-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></span>
                {benefit}
              </li>
            ))}
          </ul>
        </section>
        
        {/* Eligibility */}
        <section>
          <h2 className="text-lg font-semibold text-navy-900 mb-3 flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-navy-600" />
            {t('detail.eligibility', language)}
          </h2>
          <ul className="space-y-2">
            {program.eligibility.age && (
              <li className="flex items-start gap-2 text-navy-700">
                <span className="w-1.5 h-1.5 rounded-full bg-navy-400 mt-2 shrink-0"></span>
                <span>
                  Age: {program.eligibility.age.note || 
                    (program.eligibility.age.min && program.eligibility.age.max 
                      ? `${program.eligibility.age.min}-${program.eligibility.age.max} years`
                      : program.eligibility.age.min ? `Minimum ${program.eligibility.age.min} years` 
                      : program.eligibility.age.max ? `Maximum ${program.eligibility.age.max} years` 
                      : 'Varies')}
                </span>
              </li>
            )}
            {program.eligibility.familyStatus?.map((item, i) => (
              <li key={`fs-${i}`} className="flex items-start gap-2 text-navy-700">
                <span className="w-1.5 h-1.5 rounded-full bg-navy-400 mt-2 shrink-0"></span>
                {item}
              </li>
            ))}
            {program.eligibility.location?.provinces && (
              <li className="flex items-start gap-2 text-navy-700">
                <span className="w-1.5 h-1.5 rounded-full bg-navy-400 mt-2 shrink-0"></span>
                <span>Location: {program.eligibility.location.provinces.join(', ')} {program.eligibility.location.note && `(${program.eligibility.location.note})`}</span>
              </li>
            )}
            {program.eligibility.occupation?.map((item, i) => (
              <li key={`occ-${i}`} className="flex items-start gap-2 text-navy-700">
                <span className="w-1.5 h-1.5 rounded-full bg-navy-400 mt-2 shrink-0"></span>
                {item}
              </li>
            ))}
            {program.eligibility.education && (
              <li className="flex items-start gap-2 text-navy-700">
                <span className="w-1.5 h-1.5 rounded-full bg-navy-400 mt-2 shrink-0"></span>
                Education: {program.eligibility.education}
              </li>
            )}
            {program.eligibility.other?.map((item, i) => (
              <li key={`other-${i}`} className="flex items-start gap-2 text-navy-700">
                <span className="w-1.5 h-1.5 rounded-full bg-navy-400 mt-2 shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
        </section>
        
        {/* Documents */}
        <section>
          <h2 className="text-lg font-semibold text-navy-900 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-navy-600" />
            {t('detail.documents', language)}
          </h2>
          <div className="space-y-2">
            {program.documents.map((doc, i) => {
              const status = documentChecklist[doc] || 'not-sure';
              return (
                <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-navy-100">
                  <span className="text-sm text-navy-700">{doc}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setDocumentStatus(doc, 'ready')}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-navy-50 text-navy-500 hover:bg-green-50'
                      }`}
                    >
                      Ready
                    </button>
                    <button
                      onClick={() => setDocumentStatus(doc, 'not-ready')}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        status === 'not-ready' ? 'bg-red-100 text-red-700' : 'bg-navy-50 text-navy-500 hover:bg-red-50'
                      }`}
                    >
                      Not ready
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        
        {/* How to apply */}
        <section>
          <h2 className="text-lg font-semibold text-navy-900 mb-3 flex items-center gap-2">
            <ChevronRight className="w-5 h-5 text-navy-600" />
            {t('detail.howToApply', language)}
          </h2>
          <div className="space-y-3">
            {program.applicationSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-navy-100 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-navy-700">{i + 1}</span>
                </div>
                <p className="text-sm text-navy-700 pt-1">{step}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Where to apply */}
        <section>
          <h2 className="text-lg font-semibold text-navy-900 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-navy-600" />
            {t('detail.whereToApply', language)}
          </h2>
          <div className="space-y-2">
            {program.applicationChannels.map((channel, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-navy-50 rounded-lg border border-navy-100">
                <Building className="w-4 h-4 text-navy-500 shrink-0" />
                <span className="text-sm text-navy-700">{channel}</span>
              </div>
            ))}
          </div>
        </section>
        
        {/* Important Info */}
        <section className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800 mb-1">{t('detail.importantInfo', language)}</h3>
              <p className="text-sm text-amber-700">
                Please verify all information with the relevant government department before taking action. 
                Program details, eligibility criteria, and benefits may change over time.
              </p>
            </div>
          </div>
        </section>
        
        {/* Source */}
        <section className="bg-navy-50 rounded-xl p-4 border border-navy-100">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-navy-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-navy-800 mb-1">{t('detail.source', language)}</h3>
              <p className="text-sm text-navy-600">{program.source.name}</p>
              <a href={program.source.url} target="_blank" rel="noopener noreferrer" className="text-sm text-navy-700 hover:text-navy-900 flex items-center gap-1 mt-1">
                Visit official source <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-xs text-navy-400 mt-2">
                {t('common.lastUpdated', language)}: {program.source.verifiedAt} | Status: {program.source.verificationStatus === 'official' ? 'Official' : 'Needs verification'}
              </p>
            </div>
          </div>
        </section>
      </div>
      
      {/* CTA */}
      <div className="mt-10 pt-8 border-t border-navy-100">
        <div className="flex flex-wrap gap-3">
          <Link
            to="/assistant"
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy-800 text-white font-semibold rounded-xl hover:bg-navy-700 transition-all shadow-sm"
          >
            <Shield className="w-4 h-4" />
            Ask Sarkar Sathi
          </Link>
          <Link
            to="/assistant"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-navy-700 font-semibold rounded-xl hover:bg-navy-50 transition-all border border-navy-200"
          >
            Check my eligibility
          </Link>
        </div>
      </div>
    </div>
  );
}
