import { useMemo } from "react";
import { StockPriceHistory } from "@shared/schema";

interface StockChartProps {
  data: StockPriceHistory[];
  "data-testid"?: string;
}

export default function StockChart({ data, "data-testid": testId }: StockChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;
    
    // Take last 30 points and sort by timestamp
    const sortedData = [...data]
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-30);
    
    if (sortedData.length === 0) return null;

    const prices = sortedData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1; // Avoid division by zero
    
    const width = 300;
    const height = 150;
    const padding = 20;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Generate points for the polyline
    const points = sortedData.map((point, index) => {
      const x = padding + (index / (sortedData.length - 1)) * chartWidth;
      const y = padding + (1 - (point.price - minPrice) / priceRange) * chartHeight;
      return `${x},${y}`;
    }).join(' ');
    
    // Generate time labels
    const firstTime = new Date(sortedData[0].timestamp);
    const lastTime = new Date(sortedData[sortedData.length - 1].timestamp);
    const middleTime = new Date(firstTime.getTime() + (lastTime.getTime() - firstTime.getTime()) / 2);
    
    return {
      points,
      startTime: firstTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      middleTime: middleTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      endTime: lastTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      minPrice: minPrice.toFixed(2),
      maxPrice: maxPrice.toFixed(2),
    };
  }, [data]);

  if (!chartData) {
    return (
      <div className="w-full h-full flex items-center justify-center border border-border rounded" data-testid={testId}>
        <p className="text-muted-foreground">No chart data available</p>
      </div>
    );
  }

  return (
    <svg 
      width="100%" 
      height="100%" 
      viewBox="0 0 300 150" 
      className="border border-border rounded"
      data-testid={testId}
    >
      {/* Chart line */}
      <polyline 
        points={chartData.points}
        className="stroke-primary fill-none"
        strokeWidth="2"
      />
      
      {/* Time labels */}
      <text x="20" y="145" className="text-xs fill-muted-foreground">
        {chartData.startTime}
      </text>
      <text x="150" y="145" className="text-xs fill-muted-foreground" textAnchor="middle">
        {chartData.middleTime}
      </text>
      <text x="280" y="145" className="text-xs fill-muted-foreground" textAnchor="end">
        {chartData.endTime}
      </text>
      
      {/* Price labels */}
      <text x="10" y="25" className="text-xs fill-muted-foreground">
        ₹{chartData.maxPrice}
      </text>
      <text x="10" y="135" className="text-xs fill-muted-foreground">
        ₹{chartData.minPrice}
      </text>
    </svg>
  );
}
