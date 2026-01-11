'use client';

import { useState, useEffect } from 'react';
import { getLeaderboard } from '@/app/actions/userActions';
import { getCurrentUser } from '@/lib/auth';
import { Trophy, Medal, Crown, Search } from 'lucide-react';

interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  level: number;
  email: string;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getLeaderboard();
        if (result.success) {
          setUsers(result.data as LeaderboardUser[]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const topThree = users.slice(0, 3);
  const restUsers = users.slice(3);

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <div className="container mx-auto px-6 pt-32">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 flex items-center justify-center gap-4">
            <Trophy className="text-yellow-500 hidden md:block" size={48} />
            Leaderboard
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            See how you compare with the community. Rise through the ranks and earn your glory!
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
          </div>
        ) : (
          <>
            {/* Podium (Only show if we have users) */}
            {topThree.length > 0 && (
              <div className="flex justify-center items-end gap-4 md:gap-8 mb-16 h-64 md:h-80">
                {/* 2nd Place */}
                {topThree[1] && (
                  <div className="flex flex-col items-center w-24 md:w-32 animate-fade-in-up delay-100">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-slate-300 bg-slate-700 flex items-center justify-center text-xl font-bold text-white mb-4 shadow-xl overflow-hidden relative">
                      {topThree[1].name.charAt(0)}
                      <div className="absolute -bottom-1 -right-1 bg-slate-300 text-slate-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-black border-2 border-slate-800">2</div>
                    </div>
                    <div className="text-white font-bold text-sm md:text-base mb-1 text-center truncate w-full">{topThree[1].name}</div>
                    <div className="text-slate-400 text-xs font-bold mb-3">{topThree[1].points} pts</div>
                    <div className="w-full bg-gradient-to-t from-slate-700 to-slate-600 rounded-t-lg h-32 md:h-40 flex items-end justify-center pb-4 opacity-80">
                      <Medal className="text-slate-300" size={32} />
                    </div>
                  </div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                  <div className="flex flex-col items-center w-28 md:w-40 z-10 animate-fade-in-up">
                    <div className="relative">
                      <Crown className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-400 animate-bounce" size={32} fill="currentColor" />
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-yellow-400 bg-slate-700 flex items-center justify-center text-2xl font-bold text-white mb-4 shadow-2xl shadow-yellow-500/20 overflow-hidden relative">
                        {topThree[0].name.charAt(0)}
                        <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 rounded-full w-8 h-8 flex items-center justify-center text-sm font-black border-2 border-slate-800">1</div>
                      </div>
                    </div>
                    <div className="text-white font-bold text-base md:text-lg mb-1 text-center truncate w-full">{topThree[0].name}</div>
                    <div className="text-yellow-400 text-sm font-bold mb-3">{topThree[0].points} pts</div>
                    <div className="w-full bg-gradient-to-t from-yellow-500 to-amber-400 rounded-t-xl h-40 md:h-52 flex items-end justify-center pb-6 shadow-lg shadow-yellow-500/10">
                      <Trophy className="text-yellow-900" size={40} />
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                  <div className="flex flex-col items-center w-24 md:w-32 animate-fade-in-up delay-200">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-orange-700 bg-slate-700 flex items-center justify-center text-xl font-bold text-white mb-4 shadow-xl overflow-hidden relative">
                      {topThree[2].name.charAt(0)}
                      <div className="absolute -bottom-1 -right-1 bg-orange-700 text-orange-100 rounded-full w-6 h-6 flex items-center justify-center text-xs font-black border-2 border-slate-800">3</div>
                    </div>
                    <div className="text-white font-bold text-sm md:text-base mb-1 text-center truncate w-full">{topThree[2].name}</div>
                    <div className="text-slate-400 text-xs font-bold mb-3">{topThree[2].points} pts</div>
                    <div className="w-full bg-gradient-to-t from-orange-800 to-orange-700 rounded-t-lg h-24 md:h-32 flex items-end justify-center pb-4 opacity-80">
                      <Medal className="text-orange-300" size={32} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* List View */}
            <div className="max-w-4xl mx-auto bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center gap-4">
                <Trophy className="text-slate-500" size={20} />
                <h3 className="text-lg font-bold text-white">Top 50 Players</h3>
              </div>

              <div className="divide-y divide-white/5">
                {topThree.length === 0 && <div className="p-8 text-center text-slate-500">No users found.</div>}

                {restUsers.map((user, idx) => {
                  const rank = idx + 4;
                  return (
                    <div key={user.id} className={`flex items-center p-4 md:p-6 hover:bg-white/5 transition-colors ${user.id === currentUser?.id ? 'bg-violet-500/10 border-l-4 border-violet-500' : ''}`}>
                      <div className="w-12 text-center font-black text-slate-500 text-lg">#{rank}</div>

                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            {user.name}
                            {user.id === currentUser?.id && <span className="text-[10px] bg-violet-500 text-white px-1.5 py-0.5 rounded font-bold uppercase">You</span>}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-1">
                            Level {user.level} <span className="w-1 h-1 rounded-full bg-slate-600" /> Member
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-black text-white text-lg">{user.points}</div>
                        <div className="text-xs text-slate-500 font-bold">
                          POINTS
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
