import { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

interface LeetCodeHeatmapValue {
  date: string;
  count: number;
}

interface LeetCodeStats {
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  currentStreak: number;
  longestStreak: number;
  totalSolved: number;
}

export function LeetCodeHeatmap() {
  const [data, setData] = useState<LeetCodeHeatmapValue[]>([]);
  const [stats, setStats] = useState<LeetCodeStats | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://leetcode-api-faisalshohag.vercel.app/sarthak131')
      .then(res => res.json())
      .then(apiData => {
        const formattedData: LeetCodeHeatmapValue[] = Object.entries(apiData.submissionCalendar).map(([ts, count]) => ({
          date: new Date(Number(ts) * 1000).toISOString().slice(0, 10),
          count: Number(count),
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        // Calculate streaks
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Create a map for quick lookup
        const dateMap = new Map(formattedData.map(d => [d.date, d.count]));
        
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
        for (let i = 0; i < formattedData.length; i++) {
          if (formattedData[i].count > 0) {
            tempStreak++;
            if (tempStreak > longestStreak) longestStreak = tempStreak;
          } else {
            tempStreak = 0;
          }
        }
        
        setData(formattedData);
        setStats({
          easySolved: apiData.easySolved,
          mediumSolved: apiData.mediumSolved,
          hardSolved: apiData.hardSolved,
          currentStreak,
          longestStreak,
          totalSolved: apiData.easySolved + apiData.mediumSolved + apiData.hardSolved,
        });
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const endDate = new Date();
  const startDate = data.length > 0 
    ? new Date(Math.min(...data.map(d => new Date(d.date).getTime())))
    : new Date(endDate.getTime() - 365 * 24 * 60 * 60 * 1000);

  return (
    <div className="leetcode-heatmap-container">
      {loading ? (
        <div className="text-xs text-gray-500 py-8 text-center">Loading...</div>
      ) : error ? (
        <div className="text-xs text-gray-500 py-8 text-center">LeetCode data unavailable</div>
      ) : (
        <>
          {stats && (
            <>
              <div className="flex gap-3 mb-4">
                <div className="flex-1 bg-[#0A0A0A] border border-white/[0.06] rounded-lg p-3">
                  <p className="text-[10px] text-gray-500 mb-1">Easy Solved</p>
                  <p className="text-lg font-bold text-emerald-400">{stats.easySolved}</p>
                </div>
                <div className="flex-1 bg-[#0A0A0A] border border-white/[0.06] rounded-lg p-3">
                  <p className="text-[10px] text-gray-500 mb-1">Medium Solved</p>
                  <p className="text-lg font-bold text-yellow-400">{stats.mediumSolved}</p>
                </div>
                <div className="flex-1 bg-[#0A0A0A] border border-white/[0.06] rounded-lg p-3">
                  <p className="text-[10px] text-gray-500 mb-1">Hard Solved</p>
                  <p className="text-lg font-bold text-red-400">{stats.hardSolved}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/[0.06]">
                <div>
                  <p className="text-[10px] text-gray-500">Current Streak</p>
                  <p className="text-sm font-bold text-emerald-400">{stats.currentStreak} days</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">Longest Streak</p>
                  <p className="text-sm font-bold text-gray-300">{stats.longestStreak} days</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">Total Solved</p>
                  <p className="text-sm font-bold text-gray-300">{stats.totalSolved}</p>
                </div>
              </div>
            </>
          )}
          <div style={{ minHeight: "150px", width: "100%" }}>
            <CalendarHeatmap
              startDate={startDate}
              endDate={endDate}
              values={data}
              classForValue={(value) => {
                if (!value || !value.count || value.count === 0) return 'color-empty';
                if (value.count === 1) return 'color-scale-1';
                if (value.count <= 3) return 'color-scale-2';
                if (value.count <= 6) return 'color-scale-3';
                return 'color-scale-4';
              }}
              tooltipDataAttrs={(value: any) => ({
                'data-tip': value?.date ? `${value.date}: ${value.count} submissions` : 'No data'
              })}
              showWeekdayLabels={false}
            />
          </div>
        </>
      )}
      <style>{`
        .leetcode-heatmap-container .react-calendar-heatmap {
          font-size: 10px;
        }
        .leetcode-heatmap-container .react-calendar-heatmap rect {
          shape-rendering: geometricPrecision;
          rx: 2;
          transition: all 0.2s ease;
        }
        .leetcode-heatmap-container .react-calendar-heatmap .color-empty {
          fill: #1f2937;
        }
        .leetcode-heatmap-container .react-calendar-heatmap .color-scale-1 {
          fill: #0e4429;
        }
        .leetcode-heatmap-container .react-calendar-heatmap .color-scale-2 {
          fill: #006d32;
        }
        .leetcode-heatmap-container .react-calendar-heatmap .color-scale-3 {
          fill: #26a641;
        }
        .leetcode-heatmap-container .react-calendar-heatmap .color-scale-4 {
          fill: #39d353;
        }
        .leetcode-heatmap-container .react-calendar-heatmap text {
          fill: rgba(255, 255, 255, 0.3);
          font-size: 8px;
        }
        .leetcode-heatmap-container .react-calendar-heatmap rect:hover {
          stroke: #26a641;
          stroke-width: 2px;
        }
      `}</style>
    </div>
  );
}
