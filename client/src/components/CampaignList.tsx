import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { campaignApi } from '../services/api';
import type { Campaign } from '../types';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { TableRowSkeleton } from './Skeleton';

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
      <div className="space-y-4 sm:space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <div className="animate-pulse bg-gray-200 rounded h-8 w-32 mb-2"></div>
            <div className="animate-pulse bg-gray-200 rounded h-5 w-64"></div>
          </div>
          <div className="animate-pulse bg-gray-200 rounded h-10 w-32"></div>
        </div>

        {/* Table skeleton */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left">
                    <div className="animate-pulse bg-gray-200 rounded h-4 w-20"></div>
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left">
                    <div className="animate-pulse bg-gray-200 rounded h-4 w-16"></div>
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left hidden sm:table-cell">
                    <div className="animate-pulse bg-gray-200 rounded h-4 w-12"></div>
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left hidden md:table-cell">
                    <div className="animate-pulse bg-gray-200 rounded h-4 w-16"></div>
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right">
                    <div className="animate-pulse bg-gray-200 rounded h-4 w-16 ml-auto"></div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(5)].map((_, i) => (
                  <TableRowSkeleton key={i} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first campaign to manage your outreach leads.</p>
            <Link
              to="/campaigns/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Campaign
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Leads
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Accounts
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map((campaign) => (
                  <tr key={campaign._id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{campaign.description}</div>
                        <div className="sm:hidden text-xs text-gray-500 mt-1">
                          {campaign.leads?.length || 0} leads • {campaign.accountIDs?.length || 0} accounts
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(campaign)}
                        className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                          campaign.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                                                 {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </button>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                      {campaign.leads?.length || 0}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                      {campaign.accountIDs?.length || 0}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignList;
