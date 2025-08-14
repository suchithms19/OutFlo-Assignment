import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { campaignApi } from '../services/api';
import type { Campaign } from '../types';
import { Save, X, Plus } from 'lucide-react';

const CampaignForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<Omit<Campaign, '_id'>>({
    name: '',
    description: '',
    status: 'active',
    leads: [],
    account_ids: [],
  });
  const [loading, setLoading] = useState(false);
  const [newLead, setNewLead] = useState('');
  const [newAccountId, setNewAccountId] = useState('');

  useEffect(() => {
    if (isEditing && id) {
      fetchCampaign(id);
    }
  }, [id, isEditing]);

  const fetchCampaign = async (campaignId: string): Promise<void> => {
    try {
      setLoading(true);
      const campaign = await campaignApi.getById(campaignId);
      setFormData({
        name: campaign.name,
        description: campaign.description,
        status: campaign.status,
        leads: campaign.leads,
        account_ids: campaign.account_ids,
      });
    } catch (error) {
      console.error('Failed to fetch campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing && id) {
        await campaignApi.update(id, formData);
      } else {
        await campaignApi.create(formData);
      }
      navigate('/campaigns');
    } catch (error) {
      console.error('Failed to save campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const addLead = (): void => {
    if (newLead.trim() && !(formData.leads || []).includes(newLead.trim())) {
      setFormData(prev => ({
        ...prev,
        leads: [...(prev.leads || []), newLead.trim()]
      }));
      setNewLead('');
    }
  };

  const removeLead = (leadToRemove: string): void => {
    setFormData(prev => ({
      ...prev,
      leads: (prev.leads || []).filter(lead => lead !== leadToRemove)
    }));
  };

  const addAccountId = (): void => {
    if (newAccountId.trim() && !(formData.account_ids || []).includes(newAccountId.trim())) {
      setFormData(prev => ({
        ...prev,
        account_ids: [...(prev.account_ids || []), newAccountId.trim()]
      }));
      setNewAccountId('');
    }
  };

  const removeAccountId = (accountIdToRemove: string): void => {
    setFormData(prev => ({
      ...prev,
      account_ids: (prev.account_ids || []).filter(id => id !== accountIdToRemove)
    }));
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8">
          <div className="space-y-2">
            <div className="animate-pulse bg-gray-200 rounded h-6 sm:h-8 w-32 sm:w-40"></div>
            <div className="animate-pulse bg-gray-200 rounded h-4 sm:h-5 w-48 sm:w-64"></div>
          </div>

          <div className="bg-white shadow-sm rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="animate-pulse bg-gray-200 rounded h-4 w-24"></div>
                <div className="animate-pulse bg-gray-200 rounded h-10 w-full"></div>
              </div>
            ))}
            
            <div className="flex gap-3 pt-4">
              <div className="animate-pulse bg-gray-200 rounded h-10 w-32"></div>
              <div className="animate-pulse bg-gray-200 rounded h-10 w-20"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Campaign' : 'Create New Campaign'}
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {isEditing ? 'Update your campaign details' : 'Set up a new outreach campaign'}
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-xl overflow-hidden">

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter campaign name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter campaign description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Leads
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={newLead}
                  onChange={(e) => setNewLead(e.target.value)}
                  placeholder="https://linkedin.com/in/profile"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={addLead}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {(formData.leads || []).map((lead, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-sm text-gray-700 truncate">{lead}</span>
                    <button
                      type="button"
                      onClick={() => removeLead(lead)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account IDs
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newAccountId}
                  onChange={(e) => setNewAccountId(e.target.value)}
                  placeholder="Enter account ID"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={addAccountId}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {(formData.account_ids || []).map((accountId, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-sm text-gray-700">{accountId}</span>
                    <button
                      type="button"
                      onClick={() => removeAccountId(accountId)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? 'Saving...' : 'Save Campaign'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/campaigns')}
                className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CampaignForm;
