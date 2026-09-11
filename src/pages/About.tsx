import React from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../data/translations';
import { GraduationCap, Award, Code, Cpu, Network, Eye, Rocket } from 'lucide-react';

export default function AboutPage() {
  const { language } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">About Sarkar Sathi</h1>
          <p className="text-xl text-navy-200">
            Empowering Pakistani citizens to navigate government services with AI
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-navy-100">
            <h2 className="text-3xl font-bold text-navy-900 mb-6 text-center">Our Mission</h2>
            <p className="text-lg text-navy-700 leading-relaxed mb-4">
              Sarkar Sathi is a citizen-first digital platform that helps people in Pakistan discover, understand, and access government programs and public services.
            </p>
            <p className="text-lg text-navy-700 leading-relaxed">
              We believe that government information should be understandable before it becomes accessible. Our AI-powered assistant guides citizens through complex eligibility criteria, required documents, and application processes in simple language.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-navy-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-navy-900 mb-12 text-center">Meet the Team</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Umair Nazeer */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-navy-100 hover:shadow-xl transition-shadow">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-navy-600 to-navy-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">UN</span>
                </div>
                <h3 className="text-2xl font-bold text-navy-900 mb-1">Umair Nazeer</h3>
                <p className="text-navy-600 flex items-center justify-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  UET Peshawar
                </p>
                <p className="text-sm text-navy-500 mt-1">Electrical Communication Engineering</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Cpu className="w-5 h-5 text-navy-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-navy-900">AI & Networking</p>
                    <p className="text-sm text-navy-600">Expertise in artificial intelligence and network systems</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Code className="w-5 h-5 text-navy-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-navy-900">Open Source Fine-tuning</p>
                    <p className="text-sm text-navy-600">Experience in fine-tuning open source AI models</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-navy-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-navy-900">Computer Vision</p>
                    <p className="text-sm text-navy-600">Specialized in computer vision applications</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-navy-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-navy-900">Competition Experience</p>
                    <p className="text-sm text-navy-600">Active participant in hackathons and tech competitions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mubasir Anwar */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-navy-100 hover:shadow-xl transition-shadow">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-navy-600 to-navy-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">MA</span>
                </div>
                <h3 className="text-2xl font-bold text-navy-900 mb-1">Mubasir Anwar</h3>
                <p className="text-navy-600 flex items-center justify-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  UET Peshawar
                </p>
                <p className="text-sm text-navy-500 mt-1">Computer System Engineering</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Rocket className="w-5 h-5 text-navy-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-navy-900">Agentic AI</p>
                    <p className="text-sm text-navy-600">Broad vision in agentic AI systems and architectures</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Cpu className="w-5 h-5 text-navy-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-navy-900">Physical World Projects</p>
                    <p className="text-sm text-navy-600">Experience in IoT and physical computing projects</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Network className="w-5 h-5 text-navy-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-navy-900">Networking</p>
                    <p className="text-sm text-navy-600">Strong background in network engineering</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-navy-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-navy-900">Competition Experience</p>
                    <p className="text-sm text-navy-600">Active participant in hackathons and tech competitions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-navy-100">
            <h2 className="text-3xl font-bold text-navy-900 mb-6 text-center">Powered by Advanced AI</h2>
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-navy-100 to-navy-50 px-6 py-4 rounded-xl mb-6">
                <div className="w-12 h-12 bg-navy-800 rounded-lg flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-navy-900">Qwen3-Max</p>
                  <p className="text-sm text-navy-600">via ModelScope API</p>
                </div>
              </div>
              <p className="text-navy-700 leading-relaxed">
                Sarkar Sathi uses Qwen3-Max, one of the most advanced AI models available, to provide accurate, helpful guidance to citizens. Our AI is trained to understand government programs and explain them in simple, accessible language.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-navy-200 mb-8">
            Ask Sarkar Sathi about any government program or service
          </p>
          <a
            href="/#/assistant"
            className="inline-flex items-center gap-2 bg-white text-navy-900 px-8 py-4 rounded-xl font-semibold hover:bg-navy-50 transition-colors"
          >
            Start Conversation
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
