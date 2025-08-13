import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { campaignApi } from '../services/api';
import type { Campaign } from '../types';
import { ArrowLeft, Edit, Trash2, Users, Link as LinkIcon } from 'lucide-react';
import { DetailPageSkeleton } from './Skeleton';

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
        accountIDs: data.accountIDs || []
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
    return <DetailPageSkeleton />;
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Campaign not found</h2>
        <p className="text-gray-600 mt-2">The campaign you're looking for doesn't exist.</p>
        <Link
          to="/campaigns"
          className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Campaigns
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/campaigns"
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
            <p className="text-gray-600">{campaign.description}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link
            to={`/campaigns/${campaign._id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              campaign.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
            }`}>
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{campaign.leads?.length || 0}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-full">
              <LinkIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Account IDs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{campaign.accountIDs?.length || 0}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {campaign.leads && campaign.leads.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">LinkedIn Leads</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {campaign.leads.map((lead, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <a
                    href={lead}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 truncate flex-1"
                  >
                    {lead}
                  </a>
                  <LinkIcon className="w-4 h-4 text-gray-400 ml-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {campaign.accountIDs && campaign.accountIDs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Account IDs</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {campaign.accountIDs.map((accountId, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg text-center">
                  <span className="text-sm font-mono text-gray-700">{accountId}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetail;
