import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { campaignApi } from '../services/api';
import type { Campaign } from '../types';
import { Users, MessageSquare, Activity } from 'lucide-react';
import { StatCardSkeleton, CampaignCardSkeleton } from './Skeleton';

const Dashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async (): Promise<void> => {
      try {
        const data = await campaignApi.getAll();
        // Ensure data is an array and has proper structure
        const campaigns = Array.isArray(data) ? data.map(campaign => ({
          ...campaign,
          leads: campaign.leads || [],
          accountIDs: campaign.accountIDs || []
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

  const stats = [
    {
      title: 'Total Campaigns',
      value: campaigns.length,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Campaigns',
      value: activeCampaigns,
      icon: Activity,
      color: 'bg-green-500',
    },
    {
      title: 'Messages Generated',
      value: '0',
      icon: MessageSquare,
      color: 'bg-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div>
          <div className="animate-pulse bg-gray-200 rounded h-8 w-48 mb-2"></div>
          <div className="animate-pulse bg-gray-200 rounded h-5 w-96"></div>
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(3)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* Recent campaigns skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="animate-pulse bg-gray-200 rounded h-6 w-32"></div>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <CampaignCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-2 sm:p-3 rounded-full`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Campaigns</h3>
        </div>
        <div className="p-4 sm:p-6">
          {campaigns.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No campaigns yet</p>
              <Link
                to="/campaigns"
                className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
              >
                Go to Campaigns
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.slice(0, 5).map((campaign) => (
                <Link
                  key={campaign._id}
                  to={`/campaigns/${campaign._id}`}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                    <p className="text-sm text-gray-600">{campaign.leads?.length || 0} leads</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    campaign.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
