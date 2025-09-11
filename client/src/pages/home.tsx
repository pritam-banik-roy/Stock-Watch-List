import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { StockWithCalculations } from "@shared/schema";
import { ChartLine, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import StockCard from "@/components/stock-card";
import StockDrawer from "@/components/stock-drawer";
import FiltersPanel from "@/components/filters-panel";
import LoadingSkeleton from "@/components/loading-skeleton";
import { useAutoRefresh } from "@/hooks/use-auto-refresh";

type SortField = "percentageChange" | "capitalPrice" | "futuresPrice";
type SortOrder = "asc" | "desc";

export default function Home() {
  const [selectedStock, setSelectedStock] = useState<StockWithCalculations | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("percentageChange");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const { toast } = useToast();

  const {
    data: stocks = [],
    isLoading,
    error,
    refetch,
  } = useQuery<StockWithCalculations[]>({
    queryKey: ["/api/stocks"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/stocks/refresh", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to refresh data");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stocks"] });
      toast({
        title: "Data Refreshed",
        description: "Stock data has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Refresh Failed",
        description: error.message || "Unable to refresh stock data. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Auto-refresh timestamps
  useAutoRefresh(stocks);

  // Filter and sort stocks
  const filteredAndSortedStocks = useMemo(() => {
    let filtered = stocks.filter(stock =>
      stock.tradingSymbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue: number, bValue: number;
      
      switch (sortBy) {
        case "percentageChange":
          aValue = a.percentageChange;
          bValue = b.percentageChange;
          break;
        case "capitalPrice":
          aValue = a.capitalMarketLastTradedPrice;
          bValue = b.capitalMarketLastTradedPrice;
          break;
        case "futuresPrice":
          aValue = a.futuresLastTradedPrice;
          bValue = b.futuresLastTradedPrice;
          break;
        default:
          return 0;
      }

      const comparison = aValue - bValue;
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [stocks, searchQuery, sortBy, sortOrder]);

  const handleCardClick = (stock: StockWithCalculations) => {
    setSelectedStock(stock);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedStock(null);
  };

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card shadow-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ChartLine className="text-primary text-2xl" />
                <h1 className="text-2xl font-bold text-foreground">Stock Watchlist Lite</h1>
              </div>
              <Button 
                onClick={() => refetch()} 
                className="flex items-center space-x-2"
                data-testid="button-refresh"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retry</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-card rounded-lg shadow-sm border border-border p-8 text-center">
            <div className="text-destructive text-4xl mb-4">
              <ChartLine className="mx-auto h-16 w-16" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Unable to Load Data</h3>
            <p className="text-muted-foreground mb-4">
              There was an error fetching stock data. Please try again.
            </p>
            <Button 
              onClick={() => refetch()} 
              data-testid="button-retry"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChartLine className="text-primary text-2xl" />
              <h1 className="text-2xl font-bold text-foreground">Stock Watchlist Lite</h1>
            </div>
            <Button 
              onClick={handleRefresh}
              disabled={refreshMutation.isPending}
              className="flex items-center space-x-2"
              data-testid="button-refresh"
            >
              <RefreshCw className={`h-4 w-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FiltersPanel
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onToggleSortOrder={toggleSortOrder}
        />

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {filteredAndSortedStocks.map((stock) => (
              <StockCard
                key={stock.id}
                stock={stock}
                onClick={() => handleCardClick(stock)}
              />
            ))}
            {filteredAndSortedStocks.length === 0 && !isLoading && (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No stocks found matching your search criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <StockDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        stock={selectedStock}
      />
    </div>
  );
}
