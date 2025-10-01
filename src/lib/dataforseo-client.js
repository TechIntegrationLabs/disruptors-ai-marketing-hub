/**
 * DataForSEO API Client
 * Comprehensive keyword research and SEO data integration
 *
 * API Documentation: https://docs.dataforseo.com/v3/
 *
 * Features:
 * - Keyword research with search volume, difficulty, CPC
 * - Keyword suggestions and related keywords
 * - SERP analysis and competition data
 * - Trend data and seasonality
 */

class DataForSEOClient {
  constructor() {
    this.username = import.meta.env.VITE_DATAFORSEO_USERNAME;
    this.password = import.meta.env.VITE_DATAFORSEO_PASSWORD;
    this.baseURL = 'https://api.dataforseo.com/v3';

    if (!this.username || !this.password) {
      console.warn('DataForSEO credentials not configured. Keyword research features will be limited.');
    }
  }

  /**
   * Make authenticated request to DataForSEO API
   */
  async makeRequest(endpoint, method = 'POST', data = null) {
    const credentials = btoa(`${this.username}:${this.password}`);

    const options = {
      method,
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    };

    if (data && method === 'POST') {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, options);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`DataForSEO API Error: ${error.status_message || response.statusText}`);
      }

      const result = await response.json();

      // DataForSEO returns results in tasks array
      if (result.tasks && result.tasks[0]) {
        const task = result.tasks[0];
        if (task.status_code !== 20000) {
          throw new Error(`API Error: ${task.status_message}`);
        }
        return task.result;
      }

      return result;
    } catch (error) {
      console.error('DataForSEO API Error:', error);
      throw error;
    }
  }

  /**
   * Get keyword ideas and search volume data
   * @param {string} keyword - Seed keyword to research
   * @param {string} location - Location code (default: US)
   * @param {string} language - Language code (default: English)
   */
  async getKeywordIdeas(keyword, location = 2840, language = 'en') {
    const endpoint = '/keywords_data/google_ads/search_volume/live';

    const requestData = [{
      keywords: [keyword],
      location_code: location,
      language_code: language,
      search_partners: false,
      date_from: new Date(new Date().setMonth(new Date().getMonth() - 12)).toISOString().split('T')[0],
      date_to: new Date().toISOString().split('T')[0]
    }];

    return await this.makeRequest(endpoint, 'POST', requestData);
  }

  /**
   * Get keyword suggestions based on seed keyword
   * @param {string} keyword - Seed keyword
   * @param {number} limit - Number of suggestions (default: 100)
   */
  async getKeywordSuggestions(keyword, location = 2840, language = 'en', limit = 100) {
    const endpoint = '/keywords_data/google_ads/keywords_for_keywords/live';

    const requestData = [{
      keywords: [keyword],
      location_code: location,
      language_code: language,
      search_partners: false,
      sort_by: 'search_volume',
      limit: limit
    }];

    const result = await this.makeRequest(endpoint, 'POST', requestData);

    // Format results for easier consumption
    if (result && result[0] && result[0].items) {
      return result[0].items.map(item => ({
        keyword: item.keyword,
        searchVolume: item.search_volume || 0,
        competition: item.competition || 0,
        competitionLevel: this.getCompetitionLevel(item.competition),
        cpc: item.cpc || 0,
        lowTopBid: item.low_top_of_page_bid || 0,
        highTopBid: item.high_top_of_page_bid || 0,
        monthlySearches: item.monthly_searches || [],
        trend: this.calculateTrend(item.monthly_searches || [])
      }));
    }

    return [];
  }

  /**
   * Get related keywords with detailed metrics
   * @param {string} keyword - Target keyword
   */
  async getRelatedKeywords(keyword, location = 2840, language = 'en') {
    const endpoint = '/keywords_data/google_ads/keywords_for_site/live';

    const requestData = [{
      target: keyword,
      location_code: location,
      language_code: language,
      search_partners: false,
      sort_by: 'relevance'
    }];

    const result = await this.makeRequest(endpoint, 'POST', requestData);

    if (result && result[0] && result[0].items) {
      return result[0].items.map(item => ({
        keyword: item.keyword,
        searchVolume: item.search_volume || 0,
        competition: item.competition || 0,
        competitionLevel: this.getCompetitionLevel(item.competition),
        cpc: item.cpc || 0,
        relevance: item.relevance || 0
      }));
    }

    return [];
  }

  /**
   * Get keyword difficulty and SERP data
   * @param {string[]} keywords - Array of keywords to analyze
   */
  async getKeywordDifficulty(keywords, location = 2840, language = 'en') {
    const endpoint = '/dataforseo_labs/google/keyword_ideas/live';

    const requestData = [{
      keywords: keywords,
      location_code: location,
      language_code: language,
      include_seed_keyword: true,
      include_serp_info: true
    }];

    const result = await this.makeRequest(endpoint, 'POST', requestData);

    if (result && result[0] && result[0].items) {
      return result[0].items.map(item => ({
        keyword: item.keyword,
        searchVolume: item.keyword_info?.search_volume || 0,
        difficulty: item.keyword_properties?.keyword_difficulty || 0,
        cpc: item.keyword_info?.cpc || 0,
        competition: item.keyword_info?.competition || 0,
        serpInfo: {
          paidResults: item.serp_info?.paid_results || 0,
          organicResults: item.serp_info?.organic_results || 0,
          featuredSnippet: item.serp_info?.featured_snippet || false
        },
        impressions: item.impressions_info?.monthly_impressions || 0
      }));
    }

    return [];
  }

  /**
   * Batch keyword research - combines multiple API calls
   * @param {string} seedKeyword - Starting keyword
   * @param {number} limit - Number of suggestions to return
   */
  async comprehensiveKeywordResearch(seedKeyword, limit = 50) {
    try {
      // Get keyword suggestions
      const suggestions = await this.getKeywordSuggestions(seedKeyword, 2840, 'en', limit);

      // Sort by search volume and competition score
      const sortedKeywords = suggestions
        .sort((a, b) => {
          const scoreA = this.calculateKeywordScore(a);
          const scoreB = this.calculateKeywordScore(b);
          return scoreB - scoreA;
        })
        .slice(0, limit);

      return {
        seedKeyword,
        totalResults: suggestions.length,
        keywords: sortedKeywords,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Comprehensive keyword research error:', error);
      throw error;
    }
  }

  /**
   * Calculate keyword opportunity score
   * Higher score = better opportunity (high volume, low competition)
   */
  calculateKeywordScore(keyword) {
    const volumeScore = Math.log10(keyword.searchVolume + 1) * 10;
    const competitionPenalty = keyword.competition * 20;
    const trendBonus = keyword.trend === 'rising' ? 10 : 0;

    return volumeScore - competitionPenalty + trendBonus;
  }

  /**
   * Get competition level label
   */
  getCompetitionLevel(competition) {
    if (competition < 0.33) return 'Low';
    if (competition < 0.66) return 'Medium';
    return 'High';
  }

  /**
   * Calculate trend from monthly searches
   */
  calculateTrend(monthlySearches) {
    if (!monthlySearches || monthlySearches.length < 3) return 'stable';

    const recent = monthlySearches.slice(-3);
    const older = monthlySearches.slice(0, 3);

    const recentAvg = recent.reduce((sum, m) => sum + (m.search_volume || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum, m) => sum + (m.search_volume || 0), 0) / older.length;

    if (recentAvg > olderAvg * 1.2) return 'rising';
    if (recentAvg < olderAvg * 0.8) return 'falling';
    return 'stable';
  }

  /**
   * Format keyword data for UI display
   */
  formatKeywordForUI(keyword) {
    return {
      keyword: keyword.keyword,
      volume: keyword.searchVolume?.toLocaleString() || '0',
      difficulty: keyword.competition ? Math.round(keyword.competition * 100) : 0,
      difficultyLabel: keyword.competitionLevel || this.getCompetitionLevel(keyword.competition || 0),
      cpc: keyword.cpc ? `$${keyword.cpc.toFixed(2)}` : '$0.00',
      trend: keyword.trend || 'stable',
      score: this.calculateKeywordScore(keyword),
      raw: keyword
    };
  }
}

// Export singleton instance
export const dataForSEOClient = new DataForSEOClient();
export default dataForSEOClient;
