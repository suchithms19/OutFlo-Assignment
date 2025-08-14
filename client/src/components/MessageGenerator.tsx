import React, { useState } from 'react';
import { messageApi } from '../services/api';
import type { LinkedInProfile, GeneratedMessage } from '../types';
import { MessageSquare, Sparkles, Copy, RefreshCw } from 'lucide-react';
import { Skeleton } from './Skeleton';

const MessageGenerator: React.FC = () => {
  const [profile, setProfile] = useState<LinkedInProfile>({
    name: 'Sarah Chen',
    job_title: 'Product Marketing Manager',
    company: 'Stripe',
    location: 'New York, NY',
    summary: 'Results-driven product marketing leader with 6+ years experience scaling B2B SaaS products. Expertise in go-to-market strategy, customer segmentation, and growth marketing. Previously led product launches that generated $50M+ in ARR.',
  });
  const [generatedMessage, setGeneratedMessage] = useState<GeneratedMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (): Promise<void> => {
    setLoading(true);
    try {
      const message = await messageApi.generatePersonalized(profile);
      setGeneratedMessage(message);
    } catch (error) {
      console.error('Failed to generate message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (): Promise<void> => {
    if (generatedMessage?.message) {
      await navigator.clipboard.writeText(generatedMessage.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleInputChange = (field: keyof LinkedInProfile, value: string): void => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">LinkedIn Message Generator </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Create personalized outreach messages that get responses using AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-sm rounded-xl overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Target Profile Information
              </h2>
            </div>
          
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="e.g. Sarah Chen"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={profile.job_title}
                  onChange={(e) => handleInputChange('job_title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="e.g. Product Marketing Manager"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={profile.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="e.g. Stripe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="e.g. New York, NY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Summary
                </label>
                <textarea
                  value={profile.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none"
                  placeholder="Brief overview of their background, achievements, and expertise..."
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !profile.name.trim() || !profile.job_title.trim()}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating AI Message...
                  </>
                ) : (
                  <>
                    Generate Personalized Message
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-xl overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                AI-Generated Message
              </h2>
            </div>
          
            <div className="p-4 sm:p-6">
              {loading ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                    <div className="space-y-3">
                      <Skeleton height="h-4" width="w-full" />
                      <Skeleton height="h-4" width="w-full" />
                      <Skeleton height="h-4" width="w-5/6" />
                      <Skeleton height="h-4" width="w-4/5" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Skeleton height="h-10" width="w-full sm:w-32" className="rounded-lg" />
                    <Skeleton height="h-10" width="w-full sm:w-28" className="rounded-lg" />
                  </div>
                </div>
              ) : !generatedMessage ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate</h3>
  
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-blue-100">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">AI-Generated Message</h4>
                        <p className="text-xs text-gray-500">Personalized for {profile.name}</p>
                      </div>
                    </div>
                    <p className="text-gray-800 leading-relaxed text-sm sm:text-base">{generatedMessage.message}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleCopy}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? 'Copied! ✓' : 'Copy Message'}
                    </button>
                    
                    <button
                      onClick={handleGenerate}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium text-sm sm:text-base"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      Regenerate
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageGenerator;
