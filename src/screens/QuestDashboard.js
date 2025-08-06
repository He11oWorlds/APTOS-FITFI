import React, { useEffect, useState } from 'react';
import { fetchDailyQuests, fetchAllQuests, getUserQuests, joinQuest } from '../services/questAPI';

export default function QuestDashboard() {
  const [quests, setQuests] = useState([]);
  const [activeTab, setActiveTab] = useState('daily');
  const [userId, setUserId] = useState('');
  const [joinedQuestIds, setJoinedQuestIds] = useState([]);
  const [joiningId, setJoiningId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('fitfi_user');
    if (stored) {
      const data = JSON.parse(stored);
      setUserId(data.user_id || '');
    }
  }, []);

  useEffect(() => {
    if (userId) {
      loadQuests();
    }
  }, [activeTab, userId]);

  const loadQuests = async () => {
    try {
      let questData = [];
      if (activeTab === 'daily') {
        questData = await fetchDailyQuests();
      } else {
        questData = await fetchAllQuests();
      }

      const userQuestProfiles = await getUserQuests(userId);
      const joined = userQuestProfiles.map((q) => q.quest_id);

      const merged = questData.map((q) => {
        const profile = userQuestProfiles.find((p) => p.quest_id === q.quest_id);
        return {
          ...q,
          progress: profile?.progress || 0,
          joined: !!profile,
        };
      });

      setJoinedQuestIds(joined);
      setQuests(merged);
    } catch (err) {
      console.error('Failed to load quests', err);
    }
  };

  const handleJoin = async (quest_id) => {
    setJoiningId(quest_id);
    try {
      await joinQuest(userId, quest_id);
      await loadQuests();
    } catch (err) {
      alert('Failed to join quest');
    }
    setJoiningId(null);
  };

  const questIcons = {
    steps: '🦶',
    calories: '⚡',
    duration: '⏱️',
    distance: '📍',
  };

  return (
    <div className="min-h-screen bg-white text-white px-4 pb-24 pt-6 font-sans">
      {/* Points badge */}
      <div className="flex justify-end mb-3 pr-2">
        <div className="bg-black px-3 py-1 rounded-full flex items-center gap-1 text-green-400 text-sm shadow-md">
          <img src="/fitfi-star.png" className="w-4 h-4" alt="points" />
          0
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
        {quests.map((quest) => (
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
                  <p className="text-xs text-gray-400">
                    {quest.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-green-400 bg-black px-2 py-1 rounded-full text-xs font-semibold">
                <img src="/fitfi-star.png" className="w-4 h-4 mr-1" alt="points" />
                {quest.points}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-1">Progress:</p>
              <div className="bg-gray-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-green-400 h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      (quest.progress / (quest.goal || 1)) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-right text-xs text-gray-300 mt-1">
                {quest.progress}/{quest.goal} {quest.unit}
              </p>
            </div>

            {/* Join Button */}
            {!quest.joined && (
              <div className="mt-2 text-right">
                <button
                  onClick={() => handleJoin(quest.quest_id)}
                  className="bg-green-500 hover:bg-green-600 text-sm text-white px-4 py-1 rounded-full"
                  disabled={joiningId === quest.quest_id}
                >
                  {joiningId === quest.quest_id ? 'Joining...' : 'Join Quest'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
