import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../data/translations';
import { programs } from '../data/programs';
import { 
  Search, ArrowRight, Shield, GraduationCap, Heart, 
  Briefcase, Store, Sprout, Home as HomeIcon,
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
    navigate(`/assistant?query=${encodeURIComponent(suggestion)}`);
  };
  
  const featuredPrograms = programs.slice(0, 3);
  const categories = Object.keys(categoryIcons);
  
  return (
    <div>
      {/* Hero Section - AI Assistant Focus */}
      <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs font-medium text-navy-200">Powered by Qwen3-Max AI</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 animate-fade-in stagger-1">
              Ask Sarkar Sathi
            </h1>
            <p className="text-lg sm:text-xl text-navy-200 leading-relaxed mb-8 animate-fade-in stagger-2 max-w-2xl mx-auto">
              Tell us about yourself and we'll help you find the right government programs
            </p>
            
            <div className="animate-fade-in stagger-3">
              <Link
                to="/assistant"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-navy-900 font-bold rounded-xl hover:bg-navy-50 transition-all shadow-lg shadow-black/20 hover:-translate-y-0.5 text-lg"
              >
                <Sparkles className="w-5 h-5" />
                Start Conversation
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="mt-10 animate-fade-in stagger-4">
              <p className="text-sm text-navy-300 mb-3">Try asking:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => handleSuggestion("I have 3 kids and earn 25,000, am I eligible for any programs?")}
                  className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-xs text-navy-200 hover:bg-white/20 transition-colors"
                >
                  "I have 3 kids and earn 25,000, am I eligible?"
                </button>
                <button
                  onClick={() => handleSuggestion("I'm a farmer, what support is available?")}
                  className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-xs text-navy-200 hover:bg-white/20 transition-colors"
                >
                  "I'm a farmer, what support is available?"
                </button>
                <button
                  onClick={() => handleSuggestion("I need health support for my family")}
                  className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-xs text-navy-200 hover:bg-white/20 transition-colors"
                >
                  "I need health support for my family"
                </button>
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
              Or browse programs directly
            </h2>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for programs..."
                className="w-full pl-12 pr-4 py-3.5 bg-navy-50 border border-navy-200 rounded-xl text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all"
              />
            </form>
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
              Start a conversation with Sarkar Sathi and discover government services designed for you.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/assistant"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-navy-900 font-semibold rounded-xl hover:bg-navy-50 transition-all shadow-lg hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                Ask Sarkar Sathi
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
