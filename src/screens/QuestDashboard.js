import React, { useEffect, useState } from 'react';
import {
  fetchDailyQuests,
  fetchAllQuests,
  getUserQuests,
  joinQuest,
  claimQuest,
  getUserPoints,
} from '../services/questAPI';

export default function QuestDashboard() {
  const [quests, setQuests] = useState([]);
  const [activeTab, setActiveTab] = useState('daily');
  const [userId, setUserId] = useState('');
  const [joiningId, setJoiningId] = useState(null);
  const [claimingId, setClaimingId] = useState(null);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  // read user
  useEffect(() => {
    const stored = localStorage.getItem('fitfi_user');
    if (stored) {
      const data = JSON.parse(stored);
      setUserId(data.user_id || '');
    }
  }, []);

  // load quests + points whenever tab/user changes
  useEffect(() => {
    if (!userId) return;
    loadQuests();
    refreshPoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, userId]);

  const refreshPoints = async () => {
    if (!userId) return;
    try {
      const data = await getUserPoints(userId); // { points: number }
      setPoints(Number(data?.points ?? 0));
    } catch {
      // backend route might not exist yet — keep 0 gracefully
      setPoints((p) => p ?? 0);
    }
  };

  const loadQuests = async () => {
    try {
      setLoading(true);

      // 1) get tab quests
      const questData =
        activeTab === 'daily' ? await fetchDailyQuests() : await fetchAllQuests();

      // 2) get user profiles (joined/progress/status)
      const userProfiles = await getUserQuests(userId); // array with { quest: {...}, progress, status, ... }

      // 3) merge data
      const merged = questData.map((q) => {
        const profile = userProfiles.find((p) => p.quest?.quest_id === q.quest_id);
        return {
          ...q,
          progress: profile?.progress ?? 0,
          status: profile?.status ?? null,      // 'in_progress' | 'completed' | 'claimed' | null
          joined: !!profile,
        };
      });

      setQuests(merged);
    } catch (err) {
      console.error('Failed to load quests', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (quest_id) => {
    try {
      setJoiningId(quest_id);
      await joinQuest(userId, quest_id);
      await loadQuests();
    } catch (err) {
      alert('Failed to join quest');
    } finally {
      setJoiningId(null);
    }
  };

  const handleClaim = async (quest_id) => {
    try {
      setClaimingId(quest_id);
      await claimQuest(userId, quest_id); // tx_hash optional
      await Promise.all([loadQuests(), refreshPoints()]);
    } catch (err) {
      alert('Failed to claim reward');
    } finally {
      setClaimingId(null);
    }
  };

  const questIcons = {
    steps: '🦶',
    calories: '⚡',
    duration: '⏱️',
    distance: '📍',
  };

  const renderCTA = (q) => {
    // decide which button to show based on joined/status/progress
    if (!q.joined) {
      return (
        <button
          onClick={() => handleJoin(q.quest_id)}
          className="bg-green-500 hover:bg-green-600 text-sm text-white px-4 py-1 rounded-full disabled:opacity-50"
          disabled={joiningId === q.quest_id || loading}
        >
          {joiningId === q.quest_id ? 'Joining…' : 'Join Quest'}
        </button>
      );
    }

    if (q.status === 'claimed') {
      return (
        <span className="text-xs px-3 py-1 rounded-full bg-emerald-900/40 text-emerald-300">
          Claimed
        </span>
      );
    }

    const progressPct = Math.min(((q.progress ?? 0) / (q.goal || 1)) * 100, 100);
    const canClaim = progressPct >= 100 || q.status === 'completed';

    if (canClaim) {
      return (
        <button
          onClick={() => handleClaim(q.quest_id)}
          className="bg-emerald-500 hover:bg-emerald-600 text-sm text-white px-4 py-1 rounded-full disabled:opacity-50"
          disabled={claimingId === q.quest_id || loading}
        >
          {claimingId === q.quest_id ? 'Claiming…' : 'Claim'}
        </button>
      );
    }

    return (
      <span className="text-xs px-3 py-1 rounded-full bg-zinc-700 text-zinc-200">
        Joined
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white text-white px-4 pb-24 pt-6 font-sans">
      {/* Points badge */}
      <div className="flex justify-end mb-3 pr-2">
        <div className="bg-black px-3 py-1 rounded-full flex items-center gap-1 text-green-400 text-sm shadow-md">
          <img src="/fitfi-star.png" className="w-4 h-4" alt="points" />
          {points}
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-4">
        <div className="bg-green-500 text-black text-xl font-techno font-bold px-6 py-2 rounded-full shadow-md inline-block tracking-widest">
          QUEST CENTER
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-6 gap-3">
        {['daily', 'weekly', 'social'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-semibold border transition-all duration-200 ${
              activeTab === tab
                ? 'bg-black text-green-400 border-green-400 shadow-md'
                : 'bg-[#1A1C24] text-gray-400 border-transparent'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Quest Cards */}
      <div className="space-y-4">
        {quests.map((quest) => {
          const pct = Math.min(((quest.progress ?? 0) / (quest.goal || 1)) * 100, 100);
          return (
            <div key={quest.quest_id} className="bg-[#1A1C24] rounded-xl p-4 shadow-lg">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="text-2xl mt-1">
                    {questIcons[quest.type] || '🏁'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight">
                      {quest.title}
                    </h3>
                    <p className="text-xs text-gray-400">{quest.description}</p>
                  </div>
                </div>

                <div className="flex items-center text-green-400 bg-black px-2 py-1 rounded-full text-xs font-semibold">
                  <img src="/fitfi-star.png" className="w-4 h-4 mr-1" alt="points" />
                  {quest.points}
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-1">Progress:</p>
                <div className="bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-green-400 h-full rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-right text-xs text-gray-300 mt-1">
                  {quest.progress}/{quest.goal} {quest.unit}
                </p>
              </div>

              {/* CTA */}
              <div className="mt-3 text-right">
                {renderCTA(quest)}
              </div>
            </div>
          );
        })}

        {quests.length === 0 && (
          <div className="text-center text-gray-700">No quests found.</div>
        )}
      </div>
    </div>
  );
}
