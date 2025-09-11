import { useState } from "react";
import { StockWithCalculations } from "@shared/schema";
import { Switch } from "@/components/ui/switch";
import { formatCurrency, formatPercentage } from "@/lib/date-utils";
import { useAutoRefresh } from "@/hooks/use-auto-refresh";

interface StockCardProps {
  stock: StockWithCalculations;
  onClick: () => void;
}

export default function StockCard({ stock, onClick }: StockCardProps) {
  const [toggleView, setToggleView] = useState(false);
  
  // Get auto-refreshing relative time
  const lastUpdatedText = useAutoRefresh([stock])[0]?.lastUpdatedText || "Just now";
  
  const isPositiveChange = stock.percentageChange >= 0;
  const displayDifference = toggleView 
    ? stock.capitalMarketLastTradedPrice - stock.futuresLastTradedPrice  // View B: Capital - Futures
    : stock.priceDifference;                   // View A: Futures - Capital
  
  const isDifferencePositive = displayDifference >= 0;

  return (
    <div 
      className="bg-card rounded-lg shadow-sm border border-border p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
      data-testid={`card-stock-${stock.tradingSymbol}`}
    >
      {/* Header with Symbol and Toggle */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg text-foreground" data-testid={`text-symbol-${stock.tradingSymbol}`}>
          {stock.tradingSymbol}
        </h3>
        <div className="flex items-center">
          <Switch
            checked={toggleView}
            onCheckedChange={(checked) => {
              setToggleView(checked);
              // Prevent card click when clicking toggle
              event?.stopPropagation();
            }}
            data-testid={`toggle-view-${stock.tradingSymbol}`}
          />
        </div>
      </div>

      {/* Price Information */}
      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Capital Market</span>
          <span className="font-semibold" data-testid={`text-capital-price-${stock.tradingSymbol}`}>
            {formatCurrency(stock.capitalMarketLastTradedPrice)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Futures</span>
          <span className="font-semibold" data-testid={`text-futures-price-${stock.tradingSymbol}`}>
            {formatCurrency(stock.futuresLastTradedPrice)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Difference</span>
          <span 
            className={`font-semibold ${isDifferencePositive ? 'text-success' : 'text-destructive'}`}
            data-testid={`text-difference-${stock.tradingSymbol}`}
          >
            {isDifferencePositive ? '+' : ''}{formatCurrency(displayDifference)}
          </span>
        </div>
      </div>

      {/* Percentage Change */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">Change</span>
        <span 
          className={`px-2 py-1 rounded text-sm font-semibold ${
            isPositiveChange 
              ? 'bg-success/10 text-success' 
              : 'bg-destructive/10 text-destructive'
          }`}
          data-testid={`text-percentage-change-${stock.tradingSymbol}`}
        >
          {isPositiveChange ? '+' : ''}{formatPercentage(stock.percentageChange)}
        </span>
      </div>

      {/* Last Updated */}
      <div 
        className="text-xs text-muted-foreground" 
        data-testid={`text-last-updated-${stock.tradingSymbol}`}
      >
        {lastUpdatedText}
      </div>
    </div>
  );
}
