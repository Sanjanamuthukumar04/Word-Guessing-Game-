import { supabase } from './supabase.jsx';

export const gameService = {
  async getRandomWord() {
    const { data, error } = await supabase
      .rpc('get_random_word');
    
    if (error) throw error;
    return data;
  },

  async saveGameResult(gameData) {
    const { data, error } = await supabase
      .from('game_sessions')
      .insert([{
        user_id: gameData.user_id,
        target_word: gameData.target_word,
        guesses: gameData.guesses,
        is_win: gameData.is_win,
        guess_count: gameData.guess_count
      }])
      .select();
    
    if (error) throw error;
    return data;
  },

  async getTodayGameCount(userId) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('game_sessions')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', today + 'T00:00:00')
      .lte('created_at', today + 'T23:59:59');
    
    if (error) throw error;
    return data.length;
  },

  async getGameHistory(userId) {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

export const adminService = {
  async getDailyReport(date) {
    const { data, error } = await supabase
      .rpc('get_daily_report', { report_date: date });
    
    if (error) throw error;
    return data;
  },

  async getUserReport(userId) {
    const { data, error } = await supabase
      .rpc('get_user_report');
    
    if (error) throw error;
    return data;
  }
};