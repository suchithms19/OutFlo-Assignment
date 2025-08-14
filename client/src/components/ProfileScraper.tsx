import React, { useState, useEffect } from 'react';
import { scrapingApi } from '../services/api';
import type { ScrapedLinkedInProfile, ScrapingRequest } from '../types';
import { Search, Download, Trash2, RefreshCw, ExternalLink, Building, MapPin, Calendar } from 'lucide-react';

const ProfileScraper: React.FC = () => {
  const [scrapingData, setScrapingData] = useState<ScrapingRequest>({
    searchUrl: '',
    numProfiles: 10,
  });
  const [profiles, setProfiles] = useState<ScrapedLinkedInProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [scrapingInProgress, setScrapingInProgress] = useState(false);
  const [filter, setFilter] = useState({
    company: '',
    location: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProfiles, setTotalProfiles] = useState(0);

  useEffect(() => {
    fetchProfiles();
  }, [currentPage, filter]);

  const fetchProfiles = async (): Promise<void> => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(filter.company && { company: filter.company }),
        ...(filter.location && { location: filter.location }),
      };
      
      const response = await scrapingApi.getAllProfiles(params);
      setProfiles(response.profiles);
      setTotalPages(response.pages);
      setTotalProfiles(response.total);
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScrapeProfiles = async (): Promise<void> => {
    if (!scrapingData.searchUrl.trim()) {
      alert('Please enter a LinkedIn search URL');
      return;
    }

    try {
      setScrapingInProgress(true);
      const response = await scrapingApi.scrapeProfiles(scrapingData);
      
      alert(`Successfully scraped ${response.profilesScraped} profiles! The process may still be running in the background.`);
      
      // Refresh the profiles list
      setCurrentPage(1);
      await fetchProfiles();
      
      // Clear the form
      setScrapingData({
        searchUrl: '',
        numProfiles: 10,
      });
    } catch (error: any) {
      console.error('Scraping failed:', error);
      alert(`Scraping failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setScrapingInProgress(false);
    }
  };

  const handleDeleteProfile = async (id: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this profile?')) return;

    try {
      await scrapingApi.deleteProfile(id);
      await fetchProfiles();
    } catch (error) {
      console.error('Failed to delete profile:', error);
      alert('Failed to delete profile');
    }
  };

  const handleDeleteAllProfiles = async (): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete ALL scraped profiles? This action cannot be undone.')) return;

    try {
      const response = await scrapingApi.deleteAllProfiles();
      alert(`Successfully deleted ${response.deletedCount} profiles`);
      await fetchProfiles();
    } catch (error) {
      console.error('Failed to delete all profiles:', error);
      alert('Failed to delete all profiles');
    }
  };

  const handleCleanupInvalidProfiles = async (): Promise<void> => {
    try {
      const response = await scrapingApi.cleanupInvalidProfiles();
      alert(`Successfully cleaned up ${response.deletedCount} invalid profiles`);
      await fetchProfiles();
    } catch (error) {
      console.error('Failed to cleanup invalid profiles:', error);
      alert('Failed to cleanup invalid profiles');
    }
  };

  const handleFilterChange = (key: keyof typeof filter, value: string): void => {
    setFilter(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Scraping Form */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">LinkedIn Profile Scraper (Not deployed to production)</h2>
          <p className="text-sm text-gray-600 mt-1">Scrape LinkedIn profiles from search results</p>
        </div>
        
        <div className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn Search URL
            </label>
            <input
              type="url"
              value={scrapingData.searchUrl}
              onChange={(e) => setScrapingData(prev => ({ ...prev, searchUrl: e.target.value }))}
              placeholder="https://www.linkedin.com/search/results/people/?keywords=..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Profiles (1-50)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={scrapingData.numProfiles}
              onChange={(e) => setScrapingData(prev => ({ ...prev, numProfiles: parseInt(e.target.value) || 10 }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleScrapeProfiles}
              disabled={scrapingInProgress || !scrapingData.searchUrl.trim()}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {scrapingInProgress ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Scraping...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Start Scraping
                </>
              )}
            </button>

            <button
              onClick={handleCleanupInvalidProfiles}
              className="flex items-center justify-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Cleanup Invalid
            </button>

            <button
              onClick={handleDeleteAllProfiles}
              className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete All
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Profiles List */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Scraped Profiles</h3>
              <p className="text-sm text-gray-600">Total: {totalProfiles} profiles</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Filter by company..."
                value={filter.company}
                onChange={(e) => handleFilterChange('company', e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <input
                type="text"
                placeholder="Filter by location..."
                value={filter.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-8">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No profiles found</h3>
              <p className="mt-1 text-sm text-gray-500">Start scraping to see LinkedIn profiles here</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              {/* Mobile Card View */}
              <div className="block sm:hidden space-y-4">
                {profiles.map((profile) => (
                  <div key={profile._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
                          <p className="text-sm text-gray-600">{profile.jobTitle}</p>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={profile.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View
                          </a>
                          <button
                            onClick={() => handleDeleteProfile(profile._id!)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span>{profile.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{profile.location}</span>
                        </div>
                        {profile.scrapedAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(profile.scrapedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {profile.summary && (
                        <p className="text-sm text-gray-700 line-clamp-2">{profile.summary}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Profile
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Scraped Date
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {profiles.map((profile) => (
                        <tr key={profile._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <div className="text-sm font-medium text-gray-900">{profile.name}</div>
                              <div className="text-sm text-gray-500">{profile.jobTitle}</div>
                              {profile.summary && (
                                <div className="text-xs text-gray-400 mt-1 line-clamp-1 max-w-xs">
                                  {profile.summary}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Building className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">{profile.company}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">{profile.location}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">
                                {profile.scrapedAt 
                                  ? new Date(profile.scrapedAt).toLocaleDateString()
                                  : 'N/A'
                                }
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <a
                                href={profile.profileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                                title="View LinkedIn Profile"
                              >
                                <ExternalLink className="w-3 h-3" />
                                View
                              </a>
                              <button
                                onClick={() => handleDeleteProfile(profile._id!)}
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                                title="Delete Profile"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileScraper;
