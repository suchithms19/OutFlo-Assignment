import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { campaignApi } from '../services/api';
import type { Campaign } from '../types';
import { Users, MessageSquare, Activity, Search } from 'lucide-react';
import ProfileScraper from './ProfileScraper';

const Dashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scraper'>('dashboard');

  useEffect(() => {
    const fetchCampaigns = async (): Promise<void> => {
      try {
        const data = await campaignApi.getAll();
        // Ensure data is an array and has proper structure
        const campaigns = Array.isArray(data) ? data.map(campaign => ({
          ...campaign,
          leads: campaign.leads || [],
          account_ids: campaign.account_ids || []
        })) : [];
        setCampaigns(campaigns);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalLeads = campaigns.reduce((sum, campaign) => sum + (campaign.leads?.length || 0), 0);

  const stats = [
    {
      title: 'Total Campaigns',
      value: campaigns.length.toLocaleString(),
      icon: Users,
      bgColor: 'bg-emerald-50',
      iconColor: 'bg-emerald-500',
    },
    {
      title: 'Active Campaigns',
      value: activeCampaigns.toLocaleString(),
      icon: Activity,
      bgColor: 'bg-blue-50',
      iconColor: 'bg-blue-500',
    },
    {
      title: 'Total Leads',
      value: totalLeads.toLocaleString(),
      icon: MessageSquare,
      bgColor: 'bg-purple-50',
      iconColor: 'bg-purple-500',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header skeleton */}
          <div className="space-y-2">
            <div className="animate-pulse bg-gray-200 rounded h-8 w-64"></div>
            <div className="animate-pulse bg-gray-200 rounded h-5 w-96"></div>
          </div>

          {/* Stats cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="animate-pulse bg-gray-200 rounded h-4 w-24"></div>
                    <div className="animate-pulse bg-gray-200 rounded h-8 w-16"></div>
                    <div className="animate-pulse bg-gray-200 rounded h-3 w-20"></div>
                  </div>
                  <div className="animate-pulse bg-gray-200 rounded-full h-12 w-12"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent campaigns skeleton */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="animate-pulse bg-gray-200 rounded h-6 w-40"></div>
            </div>
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 rounded h-12 w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Hello Campaign Manager 👋</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Here's what's happening with your campaigns today.</p>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 bg-white rounded-lg">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <Activity className="w-4 h-4" />
              Campaign Overview
            </button>
            <button
              onClick={() => setActiveTab('scraper')}
              className={`${
                activeTab === 'scraper'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <Search className="w-4 h-4" />
              LinkedIn Scraper
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' ? (
          <>
            {/* Dashboard Content */}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className={`${stat.bgColor} rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.iconColor} p-2 sm:p-3 rounded-full`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* All Campaigns */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Campaigns</h3>
          </div>
          
          {campaigns.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2 text-sm sm:text-base">No campaigns yet</p>
              <Link
                to="/campaigns"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
              >
                Create your first campaign
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {/* Mobile-friendly campaign cards */}
              <div className="block sm:hidden">
                {campaigns.map((campaign) => (
                  <Link
                    key={campaign._id}
                    to={`/campaigns/${campaign._id}`}
                    className="block p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{campaign.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{campaign.leads?.length || 0} leads</p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            campaign.status === 'active' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {campaign.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Desktop table view */}
              <div className="hidden sm:block">
                {/* Table Header */}
                <div className="grid grid-cols-3 gap-4 p-4 sm:p-6 text-sm font-medium text-gray-500 bg-gray-50">
                  <div>Campaign Name</div>
                  <div>Leads</div>
                  <div>Status</div>
                </div>

                {/* Table Rows */}
                {campaigns.map((campaign) => (
                  <Link
                    key={campaign._id}
                    to={`/campaigns/${campaign._id}`}
                    className="grid grid-cols-3 gap-4 p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900 truncate">{campaign.name}</div>
                    <div className="text-gray-600">{campaign.leads?.length || 0} leads</div>
                    <div>
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                          campaign.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {campaign.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
          </>
        ) : (
          <ProfileScraper />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
