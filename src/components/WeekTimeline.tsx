import React, { useRef, useEffect, useState } from 'react';

interface ForecastDay {
  date: string;
  dayName: string;
  temp: number;
  description: string;
  condition: string;
  icon: string;
}

interface WeekTimelineProps {
  forecast: ForecastDay[];
  selectedIndex: number;
  onSelectDay: (index: number) => void;
}

const WeekTimeline: React.FC<WeekTimelineProps> = ({ forecast, selectedIndex, onSelectDay }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current || forecast.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;
    const padding = 40;
    const graphHeight = height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Get min and max temps for scaling
    const temps = forecast.map((f) => f.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const tempRange = maxTemp - minTemp || 1;

    // Calculate points
    const points = forecast.map((day, index) => {
      const x = (width / (forecast.length - 1)) * index;
      const normalizedTemp = (day.temp - minTemp) / tempRange;
      const y = height - padding - normalizedTemp * graphHeight;
      return { x, y, temp: day.temp };
    });

    // Draw gradient area under the curve
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(199, 183, 163, 0.3)');
    gradient.addColorStop(1, 'rgba(199, 183, 163, 0.05)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding);
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.lineTo(point.x, point.y);
      } else {
        const prevPoint = points[index - 1];
        const cpX = (prevPoint.x + point.x) / 2;
        ctx.bezierCurveTo(cpX, prevPoint.y, cpX, point.y, point.x, point.y);
      }
    });
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw smooth curve line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach((point, index) => {
      if (index === 0) return;
      const prevPoint = points[index - 1];
      const cpX = (prevPoint.x + point.x) / 2;
      ctx.bezierCurveTo(cpX, prevPoint.y, cpX, point.y, point.x, point.y);
    });
    ctx.strokeStyle = '#C7B7A3';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw points
    points.forEach((point, index) => {
      const isSelected = index === selectedIndex;
      const isHovered = index === hoveredIndex;

      // Outer glow for selected/hovered
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
        const glowGradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 12);
        glowGradient.addColorStop(0, 'rgba(109, 41, 50, 0.6)');
        glowGradient.addColorStop(1, 'rgba(109, 41, 50, 0)');
        ctx.fillStyle = glowGradient;
        ctx.fill();
      }

      // Main point
      ctx.beginPath();
      ctx.arc(point.x, point.y, isSelected || isHovered ? 8 : 6, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? '#6D2932' : '#C7B7A3';
      ctx.fill();
      ctx.strokeStyle = '#E8DBC4';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Temperature label
      ctx.fillStyle = '#E8DBC4';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${point.temp}°`, point.x, point.y - 20);
    });
  }, [forecast, selectedIndex, hoveredIndex]);

  const handleDayClick = (index: number) => {
    onSelectDay(index);
  };

  if (forecast.length === 0) return null;

  return (
    <div className="week-timeline">
      <div className="days-row">
        {forecast.map((day, index) => (
          <div
            key={index}
            className={`day-item ${index === selectedIndex ? 'active' : ''}`}
            onClick={() => handleDayClick(index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span className="day-name">{day.dayName}</span>
          </div>
        ))}
      </div>
      <canvas ref={canvasRef} className="timeline-canvas" />
    </div>
  );
};

export default WeekTimeline;
