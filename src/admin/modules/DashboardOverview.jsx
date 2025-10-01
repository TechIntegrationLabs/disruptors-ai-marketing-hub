/**
 * Dashboard Overview Module
 * Overview of YOUR site's content, team, and activity
 */

import React, { useState, useEffect } from 'react'
import { supabase } from '../../api/auth'
import { BusinessBrains } from '../../api/entities.ts'
import { FileText, Users, Image as ImageIcon, Bot, TrendingUp, Calendar } from 'lucide-react'

export default function DashboardOverview() {
  const [stats, setStats] = useState({})
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)

      // Load overview stats
      const [postsResult, membersResult, mediaResult, agentsResult, brainResult] = await Promise.all([
        supabase.from('posts').select('id, status', { count: 'exact', head: true }),
        supabase.from('team_members').select('id', { count: 'exact', head: true }),
        supabase.from('site_media').select('id', { count: 'exact', head: true }),
        supabase.from('agents').select('id', { count: 'exact', head: true }),
        BusinessBrains.list()
      ])

      const postsCount = postsResult.count || 0
      const publishedPosts = await supabase
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published')

      const brainHealth = brainResult[0]
        ? await BusinessBrains.getHealth(brainResult[0].id)
        : null

      setStats({
        total_posts: postsCount,
        published_posts: publishedPosts.count || 0,
        draft_posts: postsCount - (publishedPosts.count || 0),
        team_members: membersResult.count || 0,
        media_assets: mediaResult.count || 0,
        ai_agents: agentsResult.count || 0,
        brain_facts: brainHealth?.total_facts || 0,
        brain_verified: brainHealth?.verified_percentage || 0
      })

      // Load recent activity from telemetry
      const { data: activity } = await supabase
        .from('telemetry_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      setRecentActivity(activity || [])

    } catch (error) {
      console.error('Failed to load dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-green-500 animate-pulse">LOADING_DASHBOARD...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-green-400">DASHBOARD_OVERVIEW</h1>
        <p className="text-green-500/70 text-sm mt-1">
          System status and recent activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-green-500/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <FileText size={20} className="text-green-400" />
            <div className="text-xs text-green-500/70">CONTENT</div>
          </div>
          <div className="text-2xl text-green-400">{stats.total_posts}</div>
          <div className="text-xs text-green-500/50 mt-1">
            {stats.published_posts} published
          </div>
        </div>

        <div className="bg-gray-900 border border-green-500/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <Users size={20} className="text-green-400" />
            <div className="text-xs text-green-500/70">TEAM</div>
          </div>
          <div className="text-2xl text-green-400">{stats.team_members}</div>
          <div className="text-xs text-green-500/50 mt-1">
            members
          </div>
        </div>

        <div className="bg-gray-900 border border-green-500/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <ImageIcon size={20} className="text-green-400" />
            <div className="text-xs text-green-500/70">MEDIA</div>
          </div>
          <div className="text-2xl text-green-400">{stats.media_assets}</div>
          <div className="text-xs text-green-500/50 mt-1">
            assets
          </div>
        </div>

        <div className="bg-gray-900 border border-green-500/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <Bot size={20} className="text-green-400" />
            <div className="text-xs text-green-500/70">AI_AGENTS</div>
          </div>
          <div className="text-2xl text-green-400">{stats.ai_agents}</div>
          <div className="text-xs text-green-500/50 mt-1">
            configured
          </div>
        </div>
      </div>

      {/* Brain Health */}
      <div className="bg-gray-900 border border-green-500/30 p-4">
        <h2 className="text-lg font-bold text-green-400 mb-4">BUSINESS_BRAIN_HEALTH</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-green-500/70 text-sm mb-2">Total Facts</div>
            <div className="text-3xl text-green-400">{stats.brain_facts}</div>
          </div>
          <div>
            <div className="text-green-500/70 text-sm mb-2">Verified</div>
            <div className="text-3xl text-green-400">{stats.brain_verified}%</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 border border-green-500/30 p-4">
        <h2 className="text-lg font-bold text-green-400 mb-4">QUICK_ACTIONS</h2>
        <div className="grid grid-cols-3 gap-4">
          <a
            href="/admin/secret/business-brain"
            className="p-4 bg-black border border-green-500/30 hover:border-green-500 transition-colors text-center"
          >
            <TrendingUp size={24} className="mx-auto text-green-400 mb-2" />
            <div className="text-green-400 text-sm">Manage Business Brain</div>
          </a>
          <a
            href="/admin/secret/agents"
            className="p-4 bg-black border border-green-500/30 hover:border-green-500 transition-colors text-center"
          >
            <Bot size={24} className="mx-auto text-green-400 mb-2" />
            <div className="text-green-400 text-sm">Configure Agents</div>
          </a>
          <button
            onClick={() => alert('Content generation coming soon!')}
            className="p-4 bg-black border border-green-500/30 hover:border-green-500 transition-colors text-center"
          >
            <FileText size={24} className="mx-auto text-green-400 mb-2" />
            <div className="text-green-400 text-sm">Generate Content</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900 border border-green-500/30 p-4">
        <h2 className="text-lg font-bold text-green-400 mb-4">RECENT_ACTIVITY</h2>
        <div className="space-y-2">
          {recentActivity.length === 0 ? (
            <div className="text-green-500/50 text-sm text-center py-8">
              No recent activity
            </div>
          ) : (
            recentActivity.map((event, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-black border border-green-500/10 hover:border-green-500/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Calendar size={14} className="text-green-500/50" />
                  <div>
                    <div className="text-green-400 text-sm">{event.name}</div>
                    <div className="text-green-500/50 text-xs">{event.area}</div>
                  </div>
                </div>
                <div className="text-green-500/50 text-xs">
                  {new Date(event.created_at).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
