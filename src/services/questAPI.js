// src/services/questAPI.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/quests';

// Quests
export const fetchAllQuests = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const fetchDailyQuests = async () => {
  const res = await axios.get(`${API_URL}/daily`);
  return res.data;
};

export const joinQuest = async (user_id, quest_id) => {
  return axios.post(`${API_URL}/join`, { user_id, quest_id });
};

export const getUserQuests = async (user_id) => {
  const res = await axios.get(`${API_URL}/user/${user_id}`);
  return res.data;
};

export const updateProgress = async (user_id, quest_id, progress) => {
  return axios.post(`${API_URL}/progress`, { user_id, quest_id, progress });
};

// ✅ Claim a quest
export const claimQuest = async (user_id, quest_id, tx_hash) => {
  return axios.post(`${API_URL}/claim`, { user_id, quest_id, tx_hash });
};

// ✅ Get total user points (expects a backend route /users/:id/points)
// If your backend doesn’t have it yet, I’ll still call it and just show 0 on error.
export const getUserPoints = async (user_id) => {
  const res = await axios.get(`http://localhost:3000/users/${user_id}/points`);
  return res.data; // expect { points: number }
};
