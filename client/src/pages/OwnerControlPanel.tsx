import React, { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
// import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLocation, useRoute } from 'wouter';
import { Settings, Users, BarChart3, Package, Zap, Lock } from 'lucide-react';

export default function OwnerControlPanel() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [settings, setSettings] = useState({
    siteName: 'Anom Artsy',
    siteDescription: 'Unite physical and digital identity for social good',
    maxCoinsPerDay: 100,
    levelUpXP: 1000,
    achievementMultiplier: 1,
  });

  // Check if user is admin/owner
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0b0e14] to-[#1a1f2e] p-4 flex items-center justify-center">
        <Card className="border-2 border-[#ff00cc] bg-[#0b0e14]/80 p-8 max-w-md">
          <div className="flex items-center justify-center mb-4">
            <Lock className="w-12 h-12 text-[#ff00cc]" />
          </div>
          <h1 className="text-2xl font-bold text-center text-[#ff00cc] mb-4">Access Denied</h1>
          <p className="text-center text-gray-300 mb-6">
            Only administrators can access the Owner Control Panel.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="w-full bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold"
          >
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0e14] to-[#1a1f2e] p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#ff00cc] mb-2">Owner Control Panel</h1>
        <p className="text-gray-400">Manage your Anom Artsy platform</p>
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'settings', label: 'Settings', icon: Settings },
          { id: 'features', label: 'Features', icon: Zap },
          { id: 'content', label: 'Content', icon: Package },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'border-[#ff00cc] bg-[#ff00cc]/20 text-[#ff00cc]'
                  : 'border-[#00eaff] bg-transparent text-[#00eaff] hover:bg-[#00eaff]/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-bold">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-[#ff00cc] bg-[#0b0e14]/80 p-6">
            <div className="text-gray-400 text-sm mb-2">Total Users</div>
            <div className="text-3xl font-bold text-[#ff00cc]">1,234</div>
            <div className="text-green-400 text-xs mt-2">↑ 12% this month</div>
          </Card>
          <Card className="border-2 border-[#00eaff] bg-[#0b0e14]/80 p-6">
            <div className="text-gray-400 text-sm mb-2">Active Members</div>
            <div className="text-3xl font-bold text-[#00eaff]">567</div>
            <div className="text-green-400 text-xs mt-2">↑ 8% this week</div>
          </Card>
          <Card className="border-2 border-[#a855f7] bg-[#0b0e14]/80 p-6">
            <div className="text-gray-400 text-sm mb-2">Revenue (This Month)</div>
            <div className="text-3xl font-bold text-[#a855f7]">$4,250</div>
            <div className="text-green-400 text-xs mt-2">↑ 25% vs last month</div>
          </Card>
          <Card className="border-2 border-[#fbbf24] bg-[#0b0e14]/80 p-6">
            <div className="text-gray-400 text-sm mb-2">Coins Distributed</div>
            <div className="text-3xl font-bold text-[#fbbf24]">45,678</div>
            <div className="text-green-400 text-xs mt-2">↑ 18% this week</div>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <Card className="border-2 border-[#00eaff] bg-[#0b0e14]/80 p-6">
          <h2 className="text-2xl font-bold text-[#00eaff] mb-6">User Management</h2>
          <div className="space-y-4">
            <div className="bg-[#1a1f2e] p-4 rounded-lg border border-[#00eaff]/20">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-bold text-white">John Doe</p>
                  <p className="text-sm text-gray-400">john@example.com</p>
                </div>
                <div className="text-right">
                  <p className="text-[#ff00cc] font-bold">Level 5</p>
                  <p className="text-sm text-gray-400">1,250 AC</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-[#00eaff] hover:bg-[#00eaff]/80 text-black">Edit</Button>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">Suspend</Button>
              </div>
            </div>
            <div className="bg-[#1a1f2e] p-4 rounded-lg border border-[#00eaff]/20">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-bold text-white">Jane Smith</p>
                  <p className="text-sm text-gray-400">jane@example.com</p>
                </div>
                <div className="text-right">
                  <p className="text-[#ff00cc] font-bold">Level 3</p>
                  <p className="text-sm text-gray-400">850 AC</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-[#00eaff] hover:bg-[#00eaff]/80 text-black">Edit</Button>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">Suspend</Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <Card className="border-2 border-[#a855f7] bg-[#0b0e14]/80 p-6">
          <h2 className="text-2xl font-bold text-[#a855f7] mb-6">Platform Settings</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Site Name</label>
              <Input
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="bg-[#1a1f2e] border-[#a855f7] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Site Description</label>
              <Input
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="bg-[#1a1f2e] border-[#a855f7] text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Max Coins/Day</label>
                <Input
                  type="number"
                  value={settings.maxCoinsPerDay}
                  onChange={(e) => setSettings({ ...settings, maxCoinsPerDay: parseInt(e.target.value) })}
                  className="bg-[#1a1f2e] border-[#a855f7] text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">XP to Level Up</label>
                <Input
                  type="number"
                  value={settings.levelUpXP}
                  onChange={(e) => setSettings({ ...settings, levelUpXP: parseInt(e.target.value) })}
                  className="bg-[#1a1f2e] border-[#a855f7] text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Achievement Multiplier</label>
                <Input
                  type="number"
                  step="0.1"
                  value={settings.achievementMultiplier}
                  onChange={(e) => setSettings({ ...settings, achievementMultiplier: parseFloat(e.target.value) })}
                  className="bg-[#1a1f2e] border-[#a855f7] text-white"
                />
              </div>
            </div>
            <Button className="w-full bg-[#a855f7] hover:bg-[#a855f7]/80 text-white font-bold">
              Save Settings
            </Button>
          </div>
        </Card>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <Card className="border-2 border-[#fbbf24] bg-[#0b0e14]/80 p-6">
          <h2 className="text-2xl font-bold text-[#fbbf24] mb-6">Feature Management</h2>
          <div className="space-y-4">
            {[
              { name: 'Private Lounges', enabled: true },
              { name: 'Kids Corner', enabled: true },
              { name: 'Mini-Games', enabled: true },
              { name: 'Collaboration Station', enabled: true },
              { name: 'Custom Merch', enabled: true },
              { name: 'VIP Membership', enabled: true },
              { name: 'Site Chat', enabled: true },
              { name: 'Social Feed', enabled: true },
            ].map((feature) => (
              <div key={feature.name} className="flex items-center justify-between p-4 bg-[#1a1f2e] rounded-lg border border-[#fbbf24]/20">
                <span className="font-bold text-white">{feature.name}</span>
                <button
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    feature.enabled
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  {feature.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <Card className="border-2 border-[#10b981] bg-[#0b0e14]/80 p-6">
          <h2 className="text-2xl font-bold text-[#10b981] mb-6">Content Management</h2>
          <div className="space-y-4">
            <div className="p-4 bg-[#1a1f2e] rounded-lg border border-[#10b981]/20">
              <h3 className="font-bold text-white mb-2">YouTube Videos</h3>
              <p className="text-sm text-gray-400 mb-3">Manage videos for Kids Corner and content</p>
              <Button className="bg-[#10b981] hover:bg-[#10b981]/80 text-black font-bold">
                Manage Videos
              </Button>
            </div>
            <div className="p-4 bg-[#1a1f2e] rounded-lg border border-[#10b981]/20">
              <h3 className="font-bold text-white mb-2">Announcements</h3>
              <p className="text-sm text-gray-400 mb-3">Create platform-wide announcements</p>
              <Button className="bg-[#10b981] hover:bg-[#10b981]/80 text-black font-bold">
                Create Announcement
              </Button>
            </div>
            <div className="p-4 bg-[#1a1f2e] rounded-lg border border-[#10b981]/20">
              <h3 className="font-bold text-white mb-2">Featured Content</h3>
              <p className="text-sm text-gray-400 mb-3">Set featured projects, users, and content</p>
              <Button className="bg-[#10b981] hover:bg-[#10b981]/80 text-black font-bold">
                Manage Featured
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
