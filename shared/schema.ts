import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stocks = pgTable("stocks", {
  id: integer("id").primaryKey(),
  tradingSymbol: text("trading_symbol").notNull().unique(),
  capitalMarketLastTradedPrice: real("capital_market_last_traded_price").notNull(),
  futuresLastTradedPrice: real("futures_last_traded_price").notNull(),
  percentageChange: real("percentage_change").notNull(),
  lastUpdatedTimestamp: timestamp("last_updated_timestamp").notNull(),
});

export const stockPriceHistory = pgTable("stock_price_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stockId: integer("stock_id").notNull().references(() => stocks.id),
  price: real("price").notNull(),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
});

export const insertStockSchema = createInsertSchema(stocks).omit({
  id: true,
  lastUpdatedTimestamp: true,
});

export const insertStockPriceHistorySchema = createInsertSchema(stockPriceHistory).omit({
  id: true,
  timestamp: true,
});

export type InsertStock = z.infer<typeof insertStockSchema>;
export type Stock = typeof stocks.$inferSelect;
export type InsertStockPriceHistory = z.infer<typeof insertStockPriceHistorySchema>;
export type StockPriceHistory = typeof stockPriceHistory.$inferSelect;

// Computed types for frontend
export type StockWithCalculations = Stock & {
  priceDifference: number;
  priceHistory: StockPriceHistory[];
};
