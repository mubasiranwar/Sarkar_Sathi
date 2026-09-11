import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../data/translations';
import { getRecommendedPrograms, UserProfile } from '../lib/recommendations';
import { 
  ArrowLeft, ArrowRight, Shield, DollarSign, GraduationCap, 
  Heart, Briefcase, Store, HelpCircle, CheckCircle2, 
  AlertTriangle, ChevronRight, MapPin, Users
} from 'lucide-react';

const needOptions = [
  { id: 'financial', label: 'eligibility.financial', icon: DollarSign },
  { id: 'education', label: 'eligibility.education', icon: GraduationCap },
  { id: 'healthcare', label: 'eligibility.healthcare', icon: Heart },
  { id: 'employment', label: 'eligibility.employment', icon: Briefcase },
  { id: 'business', label: 'eligibility.business', icon: Store },
  { id: 'other', label: 'eligibility.other', icon: HelpCircle },
];

const provinces = [
  'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 
  'Islamabad', 'Gilgit-Baltistan', 'Azad Jammu & Kashmir'
];

export default function EligibilityPage() {
  const { language, setUserProfile } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    need: '',
    province: '',
    householdIncome: undefined,
    isStudent: false,
    isEmployed: false,
    gender: undefined,
    hasChildren: false,
    isFarmer: false,
  });
  const [results, setResults] = useState<ReturnType<typeof getRecommendedPrograms>>([]);
  
  const handleNeedSelect = (need: string) => {
    setProfile(prev => ({ ...prev, need }));
  };
  
  const handleNext = () => {
    if (step === 1 && profile.need) {
      setStep(2);
    } else if (step === 2) {
      const scored = getRecommendedPrograms(profile);
      setResults(scored);
      setUserProfile(profile);
      setStep(3);
    }
  };
  
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">{t('eligibility.title', language)}</h1>
        <p className="text-navy-500 mt-1">Answer a few questions to find programs that may be relevant to you.</p>
      </div>
      
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <React.Fragment key={s}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              s <= step ? 'bg-navy-800 text-white' : 'bg-navy-100 text-navy-400'
            }`}>
              {s}
            </div>
            {s < 3 && <div className={`flex-1 h-0.5 ${s < step ? 'bg-navy-800' : 'bg-navy-100'}`}></div>}
          </React.Fragment>
        ))}
      </div>
      
      {/* Step 1: Need */}
      {step === 1 && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-semibold text-navy-900 mb-6">{t('eligibility.step1.title', language)}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {needOptions.map(option => {
              const Icon = option.icon;
              const isSelected = profile.need === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleNeedSelect(option.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                    isSelected 
                      ? 'bg-navy-50 border-navy-400 ring-2 ring-navy-200' 
                      : 'bg-white border-navy-200 hover:border-navy-300 hover:bg-navy-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-navy-800 text-white' : 'bg-navy-50 text-navy-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-navy-800">{t(option.label, language)}</span>
                </button>
              );
            })}
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!profile.need}
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy-800 text-white font-semibold rounded-xl hover:bg-navy-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('eligibility.next', language)}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Step 2: Details */}
      {step === 2 && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-semibold text-navy-900 mb-6">{t('eligibility.step2.title', language)}</h2>
          
          <div className="space-y-5">
            {/* Province */}
            <div>
              <label className="text-sm font-medium text-navy-700 mb-2 block">Province / Region</label>
              <select
                value={profile.province || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, province: e.target.value || undefined }))}
                className="w-full px-4 py-2.5 bg-white border border-navy-200 rounded-xl text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500"
              >
                <option value="">Select province (optional)</option>
                {provinces.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            
            {/* Income */}
            <div>
              <label className="text-sm font-medium text-navy-700 mb-2 block">Household income level</label>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'middle', 'high'] as const).map(income => (
                  <button
                    key={income}
                    onClick={() => setProfile(prev => ({ ...prev, householdIncome: income }))}
                    className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      profile.householdIncome === income
                        ? 'bg-navy-50 border-navy-400 text-navy-800'
                        : 'bg-white border-navy-200 text-navy-600 hover:bg-navy-50'
                    }`}
                  >
                    {income === 'low' ? 'Low' : income === 'middle' ? 'Middle' : 'High'}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quick toggles */}
            <div>
              <label className="text-sm font-medium text-navy-700 mb-2 block">Tell us more (optional)</label>
              <div className="space-y-2">
                {[
                  { key: 'isStudent', label: 'I am a student' },
                  { key: 'isEmployed', label: 'I am employed' },
                  { key: 'hasChildren', label: 'I have children' },
                  { key: 'isFarmer', label: 'I am a farmer' },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-3 p-3 rounded-lg border border-navy-100 cursor-pointer hover:bg-navy-50">
                    <input
                      type="checkbox"
                      checked={(profile as any)[item.key] || false}
                      onChange={(e) => setProfile(prev => ({ ...prev, [item.key]: e.target.checked }))}
                      className="w-4 h-4 rounded border-navy-300 text-navy-700 focus:ring-navy-500"
                    />
                    <span className="text-sm text-navy-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Gender */}
            <div>
              <label className="text-sm font-medium text-navy-700 mb-2 block">Gender (optional)</label>
              <div className="grid grid-cols-2 gap-2">
                {(['female', 'male'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => setProfile(prev => ({ ...prev, gender: g }))}
                    className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      profile.gender === g
                        ? 'bg-navy-50 border-navy-400 text-navy-800'
                        : 'bg-white border-navy-200 text-navy-600 hover:bg-navy-50'
                    }`}
                  >
                    {g === 'female' ? 'Female' : 'Male'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-3 text-navy-600 font-medium hover:text-navy-800"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('eligibility.back', language)}
            </button>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy-800 text-white font-semibold rounded-xl hover:bg-navy-700 transition-all"
            >
              {t('eligibility.results', language)}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Step 3: Results */}
      {step === 3 && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-semibold text-navy-900 mb-2">{t('eligibility.step3.title', language)}</h2>
          <p className="text-sm text-navy-500 mb-6">Based on the information you provided, these programs may be relevant to you.</p>
          
          {results.length > 0 ? (
            <div className="space-y-4">
              {results.slice(0, 6).map(({ program, score, reasons }) => (
                <div key={program.id} className="p-5 bg-white rounded-xl border border-navy-100 hover:border-navy-300 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-navy-900">{program.name}</h3>
                      <p className="text-xs text-navy-500">{program.organization}</p>
                    </div>
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                      score >= 60 ? 'bg-green-50 text-green-700 border border-green-200' :
                      score >= 30 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-navy-50 text-navy-600 border border-navy-200'
                    }`}>
                      {score >= 60 ? t('eligibility.potentiallyEligible', language) :
                       score >= 30 ? t('eligibility.mayQualify', language) :
                       t('eligibility.needsVerification', language)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-navy-600 mb-3">{program.purpose}</p>
                  
                  {/* Reasons */}
                  <div className="mb-3">
                    <p className="text-xs font-medium text-navy-500 mb-1">{t('eligibility.whyRelevant', language)}:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {reasons.map((reason, i) => (
                        <span key={i} className="px-2 py-0.5 bg-navy-50 text-navy-600 rounded text-xs">
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-3 border-t border-navy-50">
                    <Link
                      to={`/programs/${program.id}`}
                      className="text-sm font-medium text-navy-700 hover:text-navy-900 flex items-center gap-1"
                    >
                      View details <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-navy-50 rounded-full flex items-center justify-center">
                <HelpCircle className="w-7 h-7 text-navy-300" />
              </div>
              <p className="text-navy-600 font-medium mb-2">No matching programs found</p>
              <p className="text-sm text-navy-500 mb-4">Try adjusting your selections or browse all programs.</p>
              <Link to="/programs" className="text-navy-700 font-medium hover:text-navy-900">
                Browse all programs →
              </Link>
            </div>
          )}
          
          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-3 text-navy-600 font-medium hover:text-navy-800"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('eligibility.back', language)}
            </button>
            <Link
              to="/my-services"
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy-800 text-white font-semibold rounded-xl hover:bg-navy-700 transition-all"
            >
              Go to My Sarkar Sathi
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-700">
                These results are based on general eligibility criteria. Actual eligibility may vary. 
                Please verify with the relevant government department before applying.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
