import { X } from "lucide-react";
import { StockWithCalculations } from "@shared/schema";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import StockChart from "@/components/stock-chart";
import { formatCurrency, formatPercentage } from "@/lib/date-utils";
import { useAutoRefresh } from "@/hooks/use-auto-refresh";

interface StockDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stock: StockWithCalculations | null;
}

export default function StockDrawer({ isOpen, onClose, stock }: StockDrawerProps) {
  // Get auto-refreshing relative time
  const lastUpdatedText = stock ? useAutoRefresh([stock])[0]?.lastUpdatedText || "Just now" : "";
  
  if (!stock) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-96">
          <div className="p-6 text-center h-full flex items-center justify-center">
            <div>
              <div className="text-destructive text-3xl mb-3">
                <X className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Data Not Available</h3>
              <p className="text-muted-foreground">Unable to load detailed information for this stock.</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const isPositiveChange = stock.percentageChange >= 0;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-96">
        <SheetHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SheetTitle data-testid={`text-drawer-symbol-${stock.tradingSymbol}`}>
                {stock.tradingSymbol}
              </SheetTitle>
              <span 
                className={`px-2 py-1 rounded text-sm font-semibold ${
                  isPositiveChange 
                    ? 'bg-success/10 text-success' 
                    : 'bg-destructive/10 text-destructive'
                }`}
                data-testid={`text-drawer-percentage-${stock.tradingSymbol}`}
              >
                {isPositiveChange ? '+' : ''}{formatPercentage(stock.percentageChange)}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              data-testid="button-close-drawer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {/* Chart Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Capital Market Price Chart
            </h3>
            <div className="bg-muted/30 rounded-lg p-4 h-48">
              <StockChart 
                data={stock.priceHistory} 
                data-testid={`chart-${stock.tradingSymbol}`}
              />
            </div>
          </div>

          {/* Detailed Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Detailed Information</h3>
            
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Trading Symbol</span>
                <span className="font-semibold" data-testid={`text-detail-symbol-${stock.tradingSymbol}`}>
                  {stock.tradingSymbol}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Capital Market Price</span>
                <span className="font-semibold" data-testid={`text-detail-capital-${stock.tradingSymbol}`}>
                  {formatCurrency(stock.capitalMarketLastTradedPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Futures Price</span>
                <span className="font-semibold" data-testid={`text-detail-futures-${stock.tradingSymbol}`}>
                  {formatCurrency(stock.futuresLastTradedPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Price Difference</span>
                <span 
                  className={`font-semibold ${stock.priceDifference >= 0 ? 'text-success' : 'text-destructive'}`}
                  data-testid={`text-detail-difference-${stock.tradingSymbol}`}
                >
                  {stock.priceDifference >= 0 ? '+' : ''}{formatCurrency(stock.priceDifference)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Percentage Change</span>
                <span 
                  className={`font-semibold ${isPositiveChange ? 'text-success' : 'text-destructive'}`}
                  data-testid={`text-detail-percentage-${stock.tradingSymbol}`}
                >
                  {isPositiveChange ? '+' : ''}{formatPercentage(stock.percentageChange)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Previous Close</span>
                <span className="text-muted-foreground" data-testid={`text-detail-previous-${stock.tradingSymbol}`}>
                  Not Available
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Volume</span>
                <span className="text-muted-foreground" data-testid={`text-detail-volume-${stock.tradingSymbol}`}>
                  Not Available
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="text-sm text-muted-foreground" data-testid={`text-detail-updated-${stock.tradingSymbol}`}>
                  {lastUpdatedText}
                </span>
              </div>
            </div>

            {/* Additional Market Data */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-foreground">Market Statistics</h4>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Day High</span>
                <span className="text-muted-foreground" data-testid={`text-detail-day-high-${stock.tradingSymbol}`}>
                  Not Available
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Day Low</span>
                <span className="text-muted-foreground" data-testid={`text-detail-day-low-${stock.tradingSymbol}`}>
                  Not Available
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">52W High</span>
                <span className="text-muted-foreground" data-testid={`text-detail-52w-high-${stock.tradingSymbol}`}>
                  Not Available
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">52W Low</span>
                <span className="text-muted-foreground" data-testid={`text-detail-52w-low-${stock.tradingSymbol}`}>
                  Not Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
