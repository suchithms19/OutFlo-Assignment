import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { campaignApi } from '../services/api';
import type { Campaign } from '../types';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

const CampaignList: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

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

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    
    try {
      await campaignApi.delete(id);
      setCampaigns(campaigns.filter(c => c._id !== id));
    } catch (error) {
      console.error('Failed to delete campaign:', error);
    }
  };

  const toggleStatus = async (campaign: Campaign): Promise<void> => {
    try {
      const newStatus = campaign.status === 'active' ? 'inactive' : 'active';
      const updated = await campaignApi.update(campaign._id!, { status: newStatus });
      setCampaigns(campaigns.map(c => c._id === campaign._id ? updated : c));
    } catch (error) {
      console.error('Failed to update campaign status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8">
          {/* Header skeleton */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="space-y-2">
              <div className="animate-pulse bg-gray-200 rounded h-6 sm:h-8 w-32 sm:w-40"></div>
              <div className="animate-pulse bg-gray-200 rounded h-4 sm:h-5 w-48 sm:w-64"></div>
            </div>
            <div className="animate-pulse bg-gray-200 rounded h-10 w-32"></div>
          </div>

          {/* Table skeleton */}
          <div className="bg-white shadow-sm rounded-xl overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="animate-pulse bg-gray-200 rounded h-5 sm:h-6 w-32 sm:w-40"></div>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 rounded h-12 sm:h-16 w-full"></div>
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your outreach campaigns</p>
          </div>
          <Link
            to="/campaigns/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
              <p className="text-gray-600 text-sm sm:text-base">Get started by creating your first campaign to manage your outreach leads.</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">All Campaigns</h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              {/* Mobile-friendly campaign cards */}
              <div className="block sm:hidden">
                {campaigns.map((campaign) => (
                  <div key={campaign._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{campaign.name}</h4>
                        <p className="text-sm text-gray-500 truncate mt-1">{campaign.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {campaign.leads?.length || 0} leads • {campaign.account_ids?.length || 0} accounts
                        </p>
                      </div>
                      <button
                        onClick={() => toggleStatus(campaign)}
                        className={`ml-4 px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                          campaign.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {campaign.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        to={`/campaigns/${campaign._id}`}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="View Campaign"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/campaigns/${campaign._id}/edit`}
                        className="text-gray-600 hover:text-gray-800 p-1 rounded"
                        title="Edit Campaign"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(campaign._id!)}
                        className="text-red-600 hover:text-red-800 p-1 rounded"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop table view */}
              <div className="hidden sm:block">
                {/* Table Header */}
                <div className="grid grid-cols-5 gap-4 p-4 sm:p-6 text-sm font-medium text-gray-500 bg-gray-50">
                  <div>Campaign</div>
                  <div>Status</div>
                  <div>Leads</div>
                  <div>Accounts</div>
                  <div className="text-right">Actions</div>
                </div>

                {/* Table Rows */}
                {campaigns.map((campaign) => (
                  <div key={campaign._id} className="grid grid-cols-5 gap-4 p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">{campaign.name}</div>
                      <div className="text-sm text-gray-500 truncate">{campaign.description}</div>
                    </div>
                    <div>
                      <button
                        onClick={() => toggleStatus(campaign)}
                        className={`inline-flex px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                          campaign.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {campaign.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                    <div className="text-gray-600">{campaign.leads?.length || 0}</div>
                    <div className="text-gray-600">{campaign.account_ids?.length || 0}</div>
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        to={`/campaigns/${campaign._id}`}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="View Campaign"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/campaigns/${campaign._id}/edit`}
                        className="text-gray-600 hover:text-gray-800 p-1 rounded"
                        title="Edit Campaign"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(campaign._id!)}
                        className="text-red-600 hover:text-red-800 p-1 rounded"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

export default CampaignList;
