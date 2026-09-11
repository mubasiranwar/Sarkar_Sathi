import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../data/translations';
import { programs } from '../data/programs';
import { getRecommendedPrograms } from '../lib/recommendations';
import { getRecommendedPrograms as getRecs } from '../lib/recommendations';
import { 
  Bookmark, Search, FileText, CheckCircle2, 
  AlertCircle, Clock, ArrowRight, User, 
  ChevronRight, X, Circle
} from 'lucide-react';

export default function MyServicesPage() {
  const { language, savedPrograms, toggleSaveProgram, documentChecklist, setDocumentStatus, userProfile } = useApp();
  
  const savedProgramData = savedPrograms
    .map(id => programs.find(p => p.id === id))
    .filter(Boolean);
  
  // Get all documents from saved programs
  const allDocuments = savedProgramData.flatMap(p => p!.documents);
  const uniqueDocuments = [...new Set(allDocuments)];
  
  // Get recommended programs
  const recommended = userProfile 
    ? getRecs(userProfile).slice(0, 3).map(r => r.program)
    : programs.slice(0, 3);
  
  // Next steps
  const nextSteps = [];
  if (savedPrograms.length === 0) {
    nextSteps.push({ text: 'Browse and save programs you\'re interested in', link: '/programs', icon: Search });
  }
  if (!userProfile) {
    nextSteps.push({ text: 'Complete eligibility check for personalized recommendations', link: '/eligibility', icon: CheckCircle2 });
  }
  const unreadyDocs = uniqueDocuments.filter(doc => documentChecklist[doc] !== 'ready');
  if (unreadyDocs.length > 0) {
    nextSteps.push({ text: `Prepare ${unreadyDocs.length} document${unreadyDocs.length > 1 ? 's' : ''} for your saved programs`, link: '#documents', icon: FileText });
  }
  if (nextSteps.length === 0) {
    nextSteps.push({ text: 'Review your saved programs and apply when ready', link: '#saved', icon: ArrowRight });
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">{t('my.title', language)}</h1>
          <p className="text-navy-500 mt-1">Your personalized government services dashboard</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
          <User className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-xs font-medium text-amber-700">{t('my.demoProfile', language)}</span>
        </div>
      </div>
      
      {/* Next Steps */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-navy-900 mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-navy-600" />
          {t('my.nextSteps', language)}
        </h2>
        <div className="space-y-2">
          {nextSteps.map((step, i) => {
            const Icon = step.icon;
            const isLink = step.link.startsWith('/');
            const content = (
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-navy-100 hover:border-navy-300 transition-all">
                <div className="w-8 h-8 bg-navy-50 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-navy-600" />
                </div>
                <p className="text-sm text-navy-700 flex-1">{step.text}</p>
                <ChevronRight className="w-4 h-4 text-navy-400" />
              </div>
            );
            return isLink ? (
              <Link key={i} to={step.link}>{content}</Link>
            ) : (
              <div key={i}>{content}</div>
            );
          })}
        </div>
      </section>
      
      {/* Saved Programs */}
      <section className="mb-8" id="saved">
        <h2 className="text-lg font-semibold text-navy-900 mb-3 flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-navy-600" />
          {t('my.saved', language)}
        </h2>
        
        {savedProgramData.length > 0 ? (
          <div className="space-y-3">
            {savedProgramData.map(program => (
              <div key={program!.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-navy-100 hover:border-navy-300 transition-all">
                <div className="flex-1 min-w-0">
                  <Link to={`/programs/${program!.id}`} className="font-medium text-navy-900 hover:text-navy-700 block truncate">
                    {program!.name}
                  </Link>
                  <p className="text-xs text-navy-500 truncate">{program!.organization}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/programs/${program!.id}`}
                    className="px-3 py-1.5 text-xs font-medium text-navy-700 bg-navy-50 rounded-lg hover:bg-navy-100"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => toggleSaveProgram(program!.id)}
                    className="p-1.5 text-navy-400 hover:text-red-500 transition-colors"
                    aria-label="Remove from saved"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-xl border border-navy-100">
            <Bookmark className="w-8 h-8 text-navy-200 mx-auto mb-2" />
            <p className="text-sm text-navy-500 mb-3">{t('my.noSaved', language)}</p>
            <Link
              to="/programs"
              className="inline-flex items-center gap-1 text-sm font-medium text-navy-700 hover:text-navy-900"
            >
              {t('my.browsePrograms', language)} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </section>
      
      {/* Recommended */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-navy-900 mb-3 flex items-center gap-2">
          <Search className="w-5 h-5 text-navy-600" />
          {t('my.recommended', language)}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {recommended.map(program => (
            <Link
              key={program.id}
              to={`/programs/${program.id}`}
              className="p-4 bg-white rounded-xl border border-navy-100 hover:border-navy-300 hover:shadow-sm transition-all"
            >
              <h3 className="font-medium text-sm text-navy-900 mb-1 truncate">{program.name}</h3>
              <p className="text-xs text-navy-500 truncate">{program.organization}</p>
              <p className="text-xs text-navy-600 mt-2 line-clamp-2">{program.purpose}</p>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Document Checklist */}
      <section id="documents">
        <h2 className="text-lg font-semibold text-navy-900 mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-navy-600" />
          {t('my.documents', language)}
        </h2>
        
        {uniqueDocuments.length > 0 ? (
          <div className="space-y-2">
            {uniqueDocuments.map((doc, i) => {
              const status = documentChecklist[doc] || 'not-sure';
              return (
                <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-navy-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      status === 'ready' ? 'bg-green-100' :
                      status === 'not-ready' ? 'bg-red-100' :
                      'bg-navy-100'
                    }`}>
                      {status === 'ready' ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> :
                       status === 'not-ready' ? <AlertCircle className="w-3.5 h-3.5 text-red-600" /> :
                       <Circle className="w-3.5 h-3.5 text-navy-400" />}
                    </div>
                    <span className="text-sm text-navy-700">{doc}</span>
                  </div>
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
        ) : (
          <div className="text-center py-8 bg-white rounded-xl border border-navy-100">
            <FileText className="w-8 h-8 text-navy-200 mx-auto mb-2" />
            <p className="text-sm text-navy-500 mb-3">Save programs to see required documents here.</p>
            <Link
              to="/programs"
              className="inline-flex items-center gap-1 text-sm font-medium text-navy-700 hover:text-navy-900"
            >
              Browse Programs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
