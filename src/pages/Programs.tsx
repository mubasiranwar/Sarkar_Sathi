import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../data/translations';
import { verifiedPrograms, VerifiedProgram } from '../data/verifiedPrograms';
import { Search, Filter, X, ArrowRight, Shield, MapPin } from 'lucide-react';

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
  'Social Protection': 'bg-blue-50 text-blue-700 border-blue-200',
  'Education': 'bg-purple-50 text-purple-700 border-purple-200',
  'Health': 'bg-red-50 text-red-700 border-red-200',
  'Employment': 'bg-amber-50 text-amber-700 border-amber-200',
  'Business': 'bg-green-50 text-green-700 border-green-200',
  'Agriculture': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Housing': 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

// Get all unique categories from verified programs
const allCategories = [...new Set(verifiedPrograms.flatMap(p => p.category))];
const allLevels = [...new Set(verifiedPrograms.map(p => p.level))];

// Search function for verified programs
function searchVerifiedPrograms(query: string) {
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

export default function ProgramsPage() {
  const { language } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const filteredPrograms = useMemo(() => {
    let result = verifiedPrograms;
    
    if (searchQuery.trim()) {
      result = searchVerifiedPrograms(searchQuery);
    }
    
    if (categoryFilter !== 'all') {
      result = result.filter(p => p.category.includes(categoryFilter));
    }
    
    if (levelFilter !== 'all') {
      result = result.filter(p => p.level === levelFilter);
    }
    
    return result;
  }, [searchQuery, categoryFilter, levelFilter]);
  
  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setLevelFilter('all');
    setSearchParams({});
  };
  
  const hasActiveFilters = searchQuery || categoryFilter !== 'all' || levelFilter !== 'all';
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">{t('programs.title', language)}</h1>
        <p className="text-navy-500 mt-1">{t('programs.subtitle', language)}</p>
      </div>
      
      {/* Search & Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('programs.search', language)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-navy-200 rounded-xl text-sm text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-navy-400 hover:text-navy-600" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              showFilters ? 'bg-navy-50 border-navy-300 text-navy-800' : 'bg-white border-navy-200 text-navy-600 hover:bg-navy-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-navy-700"></span>
            )}
          </button>
        </div>
        
        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-navy-100 p-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-navy-600 mb-1.5 block">{t('programs.filter.category', language)}</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500"
                >
                  <option value="all">{t('programs.filter.all', language)}</option>
                  {allCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-navy-600 mb-1.5 block">{t('programs.filter.level', language)}</label>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500"
                >
                  <option value="all">{t('programs.filter.all', language)}</option>
                  {allLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="mt-3 text-sm text-navy-600 hover:text-navy-800 font-medium">
                {t('programs.clearFilters', language)}
              </button>
            )}
          </div>
        )}
        
        {/* Active filter pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-navy-100 text-navy-700 rounded-lg text-xs font-medium">
                "{searchQuery}"
                <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {categoryFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-navy-100 text-navy-700 rounded-lg text-xs font-medium">
                {categoryFilter}
                <button onClick={() => setCategoryFilter('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {levelFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-navy-100 text-navy-700 rounded-lg text-xs font-medium">
                {levelFilter}
                <button onClick={() => setLevelFilter('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Results Count */}
      <p className="text-sm text-navy-500 mb-4">
        {filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''} found
      </p>
      
      {/* Program Cards */}
      {filteredPrograms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrograms.map(program => (
            <ProgramCard key={program.id} program={program} language={language} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-navy-50 rounded-full flex items-center justify-center">
            <Search className="w-7 h-7 text-navy-300" />
          </div>
          <p className="text-navy-600 font-medium mb-2">{t('programs.noResults', language)}</p>
          <button onClick={clearFilters} className="text-sm text-navy-700 font-medium hover:text-navy-900">
            {t('programs.clearFilters', language)}
          </button>
        </div>
      )}
    </div>
  );
}

function ProgramCard({ program, language }: { program: VerifiedProgram; language: 'en' | 'ur' }) {
  const primaryCategory = program.category[0] || 'general';
  const eligibilityPreview = program.eligibility.familyStatus?.[0] || 
                             program.eligibility.other?.[0] || 
                             'See details for eligibility';
  
  return (
    <Link
      to={`/programs/${program.id}`}
      className="group p-5 rounded-xl border border-navy-100 bg-white hover:border-navy-300 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${categoryColors[primaryCategory] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
          {primaryCategory.replace('_', ' ')}
        </span>
        <span className="text-xs text-navy-400 font-medium flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {program.level}
        </span>
      </div>
      
      <h3 className="font-semibold text-navy-900 mb-1 group-hover:text-navy-700">
        {language === 'ur' && program.nameUrdu ? program.nameUrdu : program.name}
      </h3>
      <p className="text-xs text-navy-500 mb-2">{program.organization}</p>
      <p className="text-sm text-navy-600 leading-relaxed line-clamp-2 mb-3">
        {program.purpose}
      </p>
      
      {/* Eligibility preview */}
      <div className="mb-3">
        <p className="text-xs text-navy-400 font-medium mb-1">Eligibility:</p>
        <p className="text-xs text-navy-600 line-clamp-1">
          {eligibilityPreview}
        </p>
      </div>
      
      <div className="flex items-center gap-3 pt-3 border-t border-navy-50">
        <span className="text-xs font-medium text-navy-700 group-hover:text-navy-900 flex items-center gap-1">
          {t('programs.viewDetails', language)}
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
