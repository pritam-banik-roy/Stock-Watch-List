import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { type StockWithCalculations } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all stocks with calculations
  app.get("/api/stocks", async (req, res) => {
    try {
      const stocks = await storage.getAllStocks();
      
      const stocksWithCalculations: StockWithCalculations[] = await Promise.all(
        stocks.map(async (stock) => {
          const priceHistory = await storage.getStockPriceHistory(stock.id);
          const priceDifference = stock.futuresLastTradedPrice - stock.capitalMarketLastTradedPrice;
          
          return {
            ...stock,
            priceDifference,
            priceHistory,
          };
        })
      );
      
      res.json(stocksWithCalculations);
    } catch (error) {
      console.error("Error fetching stocks:", error);
      res.status(500).json({ message: "Failed to fetch stocks" });
    }
  });

  // Get single stock with calculations
  app.get("/api/stocks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const stockId = parseInt(id, 10);
      if (isNaN(stockId)) {
        return res.status(400).json({ message: "Invalid stock ID" });
      }
      const stock = await storage.getStock(stockId);
      
      if (!stock) {
        return res.status(404).json({ message: "Stock not found" });
      }
      
      const priceHistory = await storage.getStockPriceHistory(stock.id);
      const priceDifference = stock.futuresLastTradedPrice - stock.capitalMarketLastTradedPrice;
      
      const stockWithCalculations: StockWithCalculations = {
        ...stock,
        priceDifference,
        priceHistory,
      };
      
      res.json(stockWithCalculations);
    } catch (error) {
      console.error("Error fetching stock:", error);
      res.status(500).json({ message: "Failed to fetch stock" });
    }
  });

  // Refresh stock data
  app.post("/api/stocks/refresh", async (req, res) => {
    try {
      // Simulate random errors (10% chance)
      if (Math.random() < 0.1) {
        throw new Error("Simulated network error");
      }
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const refreshedStocks = await storage.refreshStockData();
      
      const stocksWithCalculations: StockWithCalculations[] = await Promise.all(
        refreshedStocks.map(async (stock) => {
          const priceHistory = await storage.getStockPriceHistory(stock.id);
          const priceDifference = stock.futuresLastTradedPrice - stock.capitalMarketLastTradedPrice;
          
          return {
            ...stock,
            priceDifference,
            priceHistory,
          };
        })
      );
      
      res.json(stocksWithCalculations);
    } catch (error) {
      console.error("Error refreshing stocks:", error);
      res.status(500).json({ message: "Failed to refresh stock data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
