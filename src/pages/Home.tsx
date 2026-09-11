import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../data/translations';
import { programs } from '../data/programs';
import { searchPrograms } from '../lib/programs';
import { 
  Search, ArrowRight, Shield, GraduationCap, Heart, 
  Briefcase, Store, Sprout, Home as HomeIcon, Users,
  CheckCircle2, FileText, ChevronRight, Info, Sparkles
} from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  'Social Protection': <Shield className="w-5 h-5" />,
  'Education': <GraduationCap className="w-5 h-5" />,
  'Health': <Heart className="w-5 h-5" />,
  'Employment': <Briefcase className="w-5 h-5" />,
  'Business': <Store className="w-5 h-5" />,
  'Agriculture': <Sprout className="w-5 h-5" />,
  'Housing': <HomeIcon className="w-5 h-5" />,
};

const categoryColors: Record<string, string> = {
  'Social Protection': 'bg-blue-50 text-blue-700 border-blue-200',
  'Education': 'bg-purple-50 text-purple-700 border-purple-200',
  'Health': 'bg-red-50 text-red-700 border-red-200',
  'Employment': 'bg-amber-50 text-amber-700 border-amber-200',
  'Business': 'bg-green-50 text-green-700 border-green-200',
  'Agriculture': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Housing': 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

export default function HomePage() {
  const { language } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/programs?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const handleSuggestion = (suggestion: string) => {
    navigate(`/programs?search=${encodeURIComponent(suggestion)}`);
  };
  
  const featuredPrograms = programs.slice(0, 3);
  const categories = Object.keys(categoryIcons);
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-navy-700/20 rounded-full blur-3xl"></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 sm:top-20 sm:right-20 opacity-20">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="hidden sm:block">
            <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="0.5" strokeDasharray="4 4"/>
            <circle cx="100" cy="100" r="60" stroke="white" strokeWidth="0.5" strokeDasharray="4 4"/>
            <circle cx="100" cy="100" r="40" stroke="white" strokeWidth="0.5"/>
            <path d="M100 20 L100 180 M20 100 L180 100" stroke="white" strokeWidth="0.3" strokeDasharray="2 4"/>
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft"></span>
                <span className="text-xs font-medium text-navy-200">Citizen Navigation Platform</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 animate-fade-in stagger-1">
                {t('home.hero.title', language)}
              </h1>
              <p className="text-lg sm:text-xl text-navy-200 leading-relaxed mb-8 animate-fade-in stagger-2">
                {t('home.hero.subtitle', language)}
              </p>
              <div className="flex flex-wrap gap-3 animate-fade-in stagger-3">
                <Link
                  to="/programs"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-navy-900 font-semibold rounded-xl hover:bg-navy-50 transition-all shadow-lg shadow-black/20 hover:shadow-xl hover:-translate-y-0.5"
                >
                  {t('home.hero.cta', language)}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/assistant"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
                >
                  <Sparkles className="w-4 h-4" />
                  {t('home.hero.cta2', language)}
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-6 mt-10 animate-fade-in stagger-4">
                <div>
                  <p className="text-2xl font-bold text-white">{programs.length}+</p>
                  <p className="text-xs text-navy-300">Programs</p>
                </div>
                <div className="w-px h-8 bg-navy-600"></div>
                <div>
                  <p className="text-2xl font-bold text-white">7</p>
                  <p className="text-xs text-navy-300">Categories</p>
                </div>
                <div className="w-px h-8 bg-navy-600"></div>
                <div>
                  <p className="text-2xl font-bold text-white">Free</p>
                  <p className="text-xs text-navy-300">Always</p>
                </div>
              </div>
            </div>
            
            {/* Visual element */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-navy-700/50 to-navy-800/50 rounded-3xl border border-white/10 backdrop-blur-sm p-6 flex flex-col justify-between">
                  {/* Mock interface */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="h-2 w-24 bg-white/20 rounded-full"></div>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full"></div>
                    <div className="h-2 w-3/4 bg-white/10 rounded-full"></div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="h-2 w-20 bg-white/20 rounded-full mb-2"></div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full mb-1"></div>
                      <div className="h-1.5 w-2/3 bg-white/10 rounded-full"></div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="h-2 w-16 bg-white/20 rounded-full mb-2"></div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full mb-1"></div>
                      <div className="h-1.5 w-3/4 bg-white/10 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="h-8 flex-1 bg-green-500/20 rounded-lg border border-green-500/30"></div>
                    <div className="h-8 flex-1 bg-white/10 rounded-lg border border-white/10"></div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-500/20 rounded-2xl border border-green-500/30 flex items-center justify-center backdrop-blur-sm animate-fade-in stagger-2">
                  <CheckCircle2 className="w-7 h-7 text-green-400" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-blue-500/20 rounded-2xl border border-blue-500/30 flex items-center justify-center backdrop-blur-sm animate-fade-in stagger-3">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Smart Search */}
      <section className="relative -mt-8 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-xl shadow-navy-900/5 border border-navy-100 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-navy-900 mb-4">
              {t('home.search.title', language)}
            </h2>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('home.search.placeholder', language)}
                className="w-full pl-12 pr-4 py-3.5 bg-navy-50 border border-navy-200 rounded-xl text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all"
              />
            </form>
            <div className="flex flex-wrap gap-2 mt-4">
              {[1,2,3,4,5].map(i => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(t(`home.suggestions.${i}`, language))}
                  className="px-3 py-1.5 bg-navy-50 text-navy-600 text-sm rounded-lg hover:bg-navy-100 transition-colors border border-navy-100"
                >
                  {t(`home.suggestions.${i}`, language)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-navy-900 mb-1">Browse by Category</h2>
            <p className="text-navy-500">Find programs organized by type</p>
          </div>
          <Link to="/programs" className="hidden sm:flex items-center gap-1 text-sm font-medium text-navy-700 hover:text-navy-900">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((cat, i) => (
            <Link
              key={cat}
              to={`/programs?category=${encodeURIComponent(cat)}`}
              className={`group flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-lg hover:-translate-y-0.5 ${categoryColors[cat] || 'bg-gray-50 text-gray-700 border-gray-200'}`}
            >
              <div className="transition-transform group-hover:scale-110">
                {categoryIcons[cat]}
              </div>
              <span className="font-medium text-sm">{cat}</span>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Featured Programs */}
      <section className="bg-white border-y border-navy-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-navy-900">Featured Programs</h2>
              <p className="text-navy-500 mt-1">Popular government programs</p>
            </div>
            <Link to="/programs" className="hidden sm:flex items-center gap-1 text-navy-700 font-medium text-sm hover:text-navy-900">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredPrograms.map(program => (
              <Link
                key={program.id}
                to={`/programs/${program.id}`}
                className="group p-5 rounded-xl border border-navy-100 hover:border-navy-300 hover:shadow-lg transition-all bg-white"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${categoryColors[program.category] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                    {program.category}
                  </span>
                  <span className="text-xs text-navy-400 font-medium">{program.level}</span>
                </div>
                <h3 className="font-semibold text-navy-900 mb-1 group-hover:text-navy-700">
                  {program.name}
                </h3>
                <p className="text-sm text-navy-500 mb-3">{program.organization}</p>
                <p className="text-sm text-navy-600 leading-relaxed line-clamp-2">
                  {program.purpose}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-navy-700 group-hover:text-navy-900">
                  {t('programs.viewDetails', language)}
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
          <Link to="/programs" className="sm:hidden mt-6 flex items-center justify-center gap-1 text-navy-700 font-medium text-sm">
            View all programs <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
      
      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-navy-50 text-navy-600 text-xs font-semibold rounded-full border border-navy-100 mb-3">SIMPLE PROCESS</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">{t('home.how.title', language)}</h2>
          <p className="text-navy-500 max-w-lg mx-auto">Four simple steps to find and access the government services you need</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[
            { step: '01', title: t('home.how.step1.title', language), desc: t('home.how.step1.desc', language), icon: Search, color: 'bg-blue-50 text-blue-600 border-blue-200' },
            { step: '02', title: t('home.how.step2.title', language), desc: t('home.how.step2.desc', language), icon: Sparkles, color: 'bg-purple-50 text-purple-600 border-purple-200' },
            { step: '03', title: t('home.how.step3.title', language), desc: t('home.how.step3.desc', language), icon: FileText, color: 'bg-amber-50 text-amber-600 border-amber-200' },
            { step: '04', title: t('home.how.step4.title', language), desc: t('home.how.step4.desc', language), icon: CheckCircle2, color: 'bg-green-50 text-green-600 border-green-200' },
          ].map((item, i) => (
            <div key={i} className="relative group">
              <div className="p-6 rounded-2xl bg-white border border-navy-100 hover:border-navy-200 hover:shadow-lg transition-all h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-extrabold text-navy-100 group-hover:text-navy-200 transition-colors">{item.step}</span>
                </div>
                <h3 className="font-semibold text-navy-900 mb-1.5">{item.title}</h3>
                <p className="text-sm text-navy-500 leading-relaxed">{item.desc}</p>
              </div>
              {i < 3 && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className="w-6 h-6 rounded-full bg-navy-100 flex items-center justify-center">
                    <ChevronRight className="w-3.5 h-3.5 text-navy-400" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      
      {/* Service Journey */}
      <section className="bg-navy-50 border-y border-navy-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-navy-900 text-center mb-2">Your Government Service Journey</h2>
          <p className="text-navy-500 text-center mb-12">From discovery to action — we guide you every step</p>
          
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col gap-0">
              {[
                { label: 'Identify your need', icon: Search },
                { label: 'Find matching programs', icon: Sparkles },
                { label: 'Check eligibility', icon: Shield },
                { label: 'Prepare documents', icon: FileText },
                { label: 'Apply with confidence', icon: CheckCircle2 },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center text-white">
                      <step.icon className="w-4 h-4" />
                    </div>
                    {i < 4 && <div className="w-0.5 h-8 bg-navy-200"></div>}
                  </div>
                  <div className="pb-8">
                    <p className="font-medium text-navy-800">{step.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-navy-50 rounded-2xl p-6 sm:p-8 border border-navy-100">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-5 h-5 text-navy-600 mt-0.5 shrink-0" />
            <h2 className="text-lg font-semibold text-navy-900">{t('home.trust.title', language)}</h2>
          </div>
          <div className="space-y-3 ml-8">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                <p className="text-sm text-navy-700">{t(`home.trust.${i}`, language)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why Sarkar Sathi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200 mb-3">WHY SARKAR SATHI</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">Built for Pakistani Citizens</h2>
          <p className="text-navy-500 max-w-lg mx-auto">Designed to bridge the gap between government services and the people who need them</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: 'Simplified Information',
              desc: 'Complex government programs explained in simple, understandable language.',
              color: 'bg-navy-50 text-navy-700'
            },
            {
              icon: Users,
              title: 'Eligibility Guidance',
              desc: 'Know which programs you may qualify for before you start the application process.',
              color: 'bg-green-50 text-green-700'
            },
            {
              icon: FileText,
              title: 'Document Preparation',
              desc: 'Interactive checklists help you prepare all required documents in advance.',
              color: 'bg-blue-50 text-blue-700'
            },
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-navy-100 hover:shadow-lg transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-navy-900 mb-2">{item.title}</h3>
              <p className="text-sm text-navy-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-8 sm:p-12 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 rounded-full blur-3xl"></div>
          </div>
          <div className="relative text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to find the right program?
            </h2>
            <p className="text-navy-200 mb-8 max-w-lg mx-auto">
              Start your journey to discover government services designed for you.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/eligibility"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-navy-900 font-semibold rounded-xl hover:bg-navy-50 transition-all shadow-lg hover:-translate-y-0.5"
              >
                Check Eligibility
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/assistant"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
              >
                <Sparkles className="w-4 h-4" />
                Ask Sarkar Sathi
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
