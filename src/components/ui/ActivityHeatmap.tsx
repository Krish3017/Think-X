import { useState } from 'react';

interface HeatmapDay {
  date: string;
  count: number;
}

interface ActivityHeatmapProps {
  data: HeatmapDay[];
  colorScheme: 'violet' | 'cyan';
}

export function ActivityHeatmap({ data, colorScheme }: ActivityHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-white/[0.02]';
    if (colorScheme === 'violet') {
      if (count <= 2) return 'bg-violet-500/20';
      if (count <= 5) return 'bg-violet-500/40';
      return 'bg-violet-500/70';
    } else {
      if (count <= 2) return 'bg-cyan-500/20';
      if (count <= 5) return 'bg-cyan-500/40';
      return 'bg-cyan-500/70';
    }
  };

  const getGlow = (count: number) => {
    if (count === 0) return '';
    if (colorScheme === 'violet') {
      return count > 5 ? 'shadow-[0_0_8px_rgba(139,92,246,0.4)]' : '';
    } else {
      return count > 5 ? 'shadow-[0_0_8px_rgba(6,182,212,0.4)]' : '';
    }
  };

  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  return (
    <div className="relative">
      <div className="flex gap-1">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-1">
            {week.map((day, dayIdx) => (
              <div
                key={dayIdx}
                className={`w-2.5 h-2.5 rounded-sm ${getColor(day.count)} ${getGlow(day.count)} transition-all cursor-pointer hover:scale-110`}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
              />
            ))}
          </div>
        ))}
      </div>
      {hoveredDay && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0B0B0B] border border-white/10 rounded px-2 py-1 text-[10px] whitespace-nowrap z-10">
          {hoveredDay.count} {hoveredDay.count === 1 ? 'activity' : 'activities'}
        </div>
      )}
    </div>
  );
}
