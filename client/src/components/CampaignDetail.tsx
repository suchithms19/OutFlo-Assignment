import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { campaignApi } from '../services/api';
import type { Campaign } from '../types';
import { ArrowLeft, Edit, Trash2, Users, Link as LinkIcon } from 'lucide-react';

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCampaign(id);
    }
  }, [id]);

  const fetchCampaign = async (campaignId: string): Promise<void> => {
    try {
      const data = await campaignApi.getById(campaignId);
      setCampaign({
        ...data,
        leads: data.leads || [],
        account_ids: data.account_ids || []
      });
    } catch (error) {
      console.error('Failed to fetch campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!campaign?._id || !window.confirm('Are you sure you want to delete this campaign?')) return;
    
    try {
      await campaignApi.delete(campaign._id);
      navigate('/campaigns');
    } catch (error) {
      console.error('Failed to delete campaign:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8">
          {/* Header skeleton */}
          <div className="flex items-center gap-4">
            <div className="animate-pulse bg-gray-200 rounded h-5 w-5"></div>
            <div className="space-y-2">
              <div className="animate-pulse bg-gray-200 rounded h-6 sm:h-8 w-48 sm:w-64"></div>
              <div className="animate-pulse bg-gray-200 rounded h-4 sm:h-5 w-32 sm:w-48"></div>
            </div>
          </div>

          {/* Stats cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="animate-pulse bg-gray-200 rounded h-4 w-20 sm:w-24"></div>
                    <div className="animate-pulse bg-gray-200 rounded h-6 sm:h-8 w-12 sm:w-16"></div>
                  </div>
                  <div className="animate-pulse bg-gray-200 rounded-full h-10 w-10 sm:h-12 sm:w-12"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Content skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="animate-pulse bg-gray-200 rounded h-6 w-32 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 rounded h-12 w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-3 sm:p-6">
          <div className="text-center py-8 sm:py-12">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Campaign not found</h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">The campaign you're looking for doesn't exist.</p>
            <Link
              to="/campaigns"
              className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Campaigns
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/campaigns"
              className="text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{campaign.name}</h1>
              <p className="text-gray-600 text-sm sm:text-base">{campaign.description}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link
              to={`/campaigns/${campaign._id}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-emerald-50 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Status</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </p>
              </div>
              <div className={`p-2 sm:p-3 rounded-full ${
                campaign.status === 'active' ? 'bg-emerald-500' : 'bg-gray-500'
              }`}>
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{campaign.leads?.length || 0}</p>
              </div>
              <div className="bg-blue-500 p-2 sm:p-3 rounded-full">
                <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Account IDs</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{campaign.account_ids?.length || 0}</p>
              </div>
              <div className="bg-purple-500 p-2 sm:p-3 rounded-full">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {campaign.leads && campaign.leads.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">LinkedIn Leads</h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3">
                {campaign.leads.map((lead, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <a
                      href={lead}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 truncate flex-1 text-sm sm:text-base"
                    >
                      {lead}
                    </a>
                    <LinkIcon className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {campaign.account_ids && campaign.account_ids.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Account IDs</h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {campaign.account_ids.map((accountId, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg text-center">
                    <span className="text-sm font-mono text-gray-700">{accountId}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetail;
