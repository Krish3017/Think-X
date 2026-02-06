import { useEffect, useState } from 'react';

interface LeetCodeData {
  currentStreak: number;
  longestStreak: number;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

export function useLeetCodeStats(username: string = 'sarthak131') {
  const [data, setData] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`)
      .then(res => res.json())
      .then(apiData => {
        const submissions = Object.entries(apiData.submissionCalendar)
          .map(([ts, count]) => ({
            date: new Date(Number(ts) * 1000).toISOString().slice(0, 10),
            count: Number(count),
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Create a map for quick lookup
        const dateMap = new Map(submissions.map(d => [d.date, d.count]));

        // Calculate current streak (from today backwards)
        let checkDate = new Date(today);
        while (true) {
          const dateStr = checkDate.toISOString().slice(0, 10);
          const count = dateMap.get(dateStr) || 0;
          if (count > 0) {
            currentStreak++;
          } else {
            break;
          }
          checkDate.setDate(checkDate.getDate() - 1);
        }

        // Calculate longest streak
        for (let i = 0; i < submissions.length; i++) {
          if (submissions[i].count > 0) {
            tempStreak++;
            if (tempStreak > longestStreak) longestStreak = tempStreak;
          } else {
            tempStreak = 0;
          }
        }

        setData({
          currentStreak,
          longestStreak,
          totalSolved: apiData.easySolved + apiData.mediumSolved + apiData.hardSolved,
          easySolved: apiData.easySolved,
          mediumSolved: apiData.mediumSolved,
          hardSolved: apiData.hardSolved,
        });
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [username]);

  return { data, loading, error };
}
