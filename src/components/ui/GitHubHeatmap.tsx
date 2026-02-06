import { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

interface GitHubHeatmapValue {
  date: string;
  count: number;
}

interface GitHubStats {
  currentStreak: number;
  longestStreak: number;
  totalContributions: number;
  yearlyContributions: { [year: string]: number };
}

export function GitHubHeatmap() {
  const [data, setData] = useState<GitHubHeatmapValue[]>([]);
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://github-contributions-api.jogruber.de/v4/Krish3017')
      .then(res => res.json())
      .then(apiData => {
        const formattedData: GitHubHeatmapValue[] = apiData.contributions.map((contrib: any) => ({
          date: contrib.date,
          count: contrib.count,
        })).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Calculate streaks
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dateMap = new Map(formattedData.map(d => [d.date, d.count]));

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

        for (let i = 0; i < formattedData.length; i++) {
          if (formattedData[i].count > 0) {
            tempStreak++;
            if (tempStreak > longestStreak) longestStreak = tempStreak;
          } else {
            tempStreak = 0;
          }
        }

        const totalContributions = formattedData.reduce((sum, d) => sum + d.count, 0);

        // Calculate yearly contributions
        const yearlyContributions: { [year: string]: number } = {};
        formattedData.forEach(d => {
          const year = d.date.split('-')[0];
          yearlyContributions[year] = (yearlyContributions[year] || 0) + d.count;
        });

        setData(formattedData);
        setStats({
          currentStreak,
          longestStreak,
          totalContributions,
          yearlyContributions,
        });
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 8);

  return (
    <div className="github-heatmap-container">
      {loading ? (
        <div className="text-xs text-gray-500 py-8 text-center">Loading...</div>
      ) : error ? (
        <div className="text-xs text-gray-500 py-8 text-center">GitHub data unavailable</div>
      ) : (
        <>
          {stats && (
            <>
              <div className="flex gap-3 mb-4">
                {Object.entries(stats.yearlyContributions).map(([year, count]) => (
                  <div key={year} className="flex-1 bg-[#0A0A0A] border border-white/[0.06] rounded-lg p-3">
                    <p className="text-[10px] text-gray-500 mb-1">{year}</p>
                    <p className="text-lg font-bold text-emerald-400">{count}</p>
                  </div>
                ))}
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
                  <p className="text-[10px] text-gray-500">Total Contributions</p>
                  <p className="text-sm font-bold text-gray-300">{stats.totalContributions}</p>
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
                'data-tip': value?.date ? `${value.date}: ${value.count} contributions` : 'No data'
              })}
              showWeekdayLabels={false}
            />
          </div>
          
        </>
      )}
      <style>{`
        .github-heatmap-container .react-calendar-heatmap {
          font-size: 10px;
        }
        .github-heatmap-container .react-calendar-heatmap rect {
          shape-rendering: geometricPrecision;
          rx: 2;
          transition: all 0.2s ease;
        }
        .github-heatmap-container .react-calendar-heatmap .color-empty {
          fill: #1f2937;
        }
        .github-heatmap-container .react-calendar-heatmap .color-scale-1 {
          fill: #9be9a8;
        }
        .github-heatmap-container .react-calendar-heatmap .color-scale-2 {
          fill: #40c463;
        }
        .github-heatmap-container .react-calendar-heatmap .color-scale-3 {
          fill: #30a14e;
        }
        .github-heatmap-container .react-calendar-heatmap .color-scale-4 {
          fill: #216e39;
        }
        .github-heatmap-container .react-calendar-heatmap text {
          fill: rgba(255, 255, 255, 0.3);
          font-size: 8px;
        }
        .github-heatmap-container .react-calendar-heatmap rect:hover {
          stroke: #40c463;
          stroke-width: 2px;
        }
      `}</style>
    </div>
  );
}
