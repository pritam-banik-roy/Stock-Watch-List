import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type SortField = "percentageChange" | "capitalPrice" | "futuresPrice";
type SortOrder = "asc" | "desc";

interface FiltersPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortField;
  onSortByChange: (field: SortField) => void;
  sortOrder: SortOrder;
  onToggleSortOrder: () => void;
}

export default function FiltersPanel({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onToggleSortOrder,
}: FiltersPanelProps) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border border-border mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by symbol..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-muted-foreground">Sort by:</label>
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="w-48" data-testid="select-sort-by">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentageChange">Percentage Change</SelectItem>
              <SelectItem value="capitalPrice">Capital Market Price</SelectItem>
              <SelectItem value="futuresPrice">Futures Price</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleSortOrder}
            className="flex items-center space-x-1"
            data-testid="button-sort-order"
          >
            {sortOrder === "desc" ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
            <span className="sr-only">
              {sortOrder === "desc" ? "Descending" : "Ascending"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
