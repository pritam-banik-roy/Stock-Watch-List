import { type Stock, type InsertStock, type StockPriceHistory, type InsertStockPriceHistory } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllStocks(): Promise<Stock[]>;
  getStock(id: number): Promise<Stock | undefined>;
  getStockBySymbol(symbol: string): Promise<Stock | undefined>;
  createStock(stock: InsertStock): Promise<Stock>;
  updateStock(id: number, stock: Partial<Stock>): Promise<Stock | undefined>;
  deleteStock(id: number): Promise<boolean>;
  getStockPriceHistory(stockId: number, limit?: number): Promise<StockPriceHistory[]>;
  addStockPriceHistory(priceHistory: InsertStockPriceHistory): Promise<StockPriceHistory>;
  refreshStockData(): Promise<Stock[]>;
}

export class MemStorage implements IStorage {
  private stocks: Map<number, Stock>;
  private priceHistory: Map<number, StockPriceHistory[]>;

  constructor() {
    this.stocks = new Map();
    this.priceHistory = new Map();
    this.initializeWithSampleData();
  }

  private initializeWithSampleData() {
    const sampleStocks: Stock[] = [
      {
        id: 1,
        tradingSymbol: "RELIANCE",
        capitalMarketLastTradedPrice: 2915.45,
        futuresLastTradedPrice: 2921.10,
        percentageChange: 0.84,
        lastUpdatedTimestamp: new Date("2025-09-05T06:40:00Z"),
      },
      {
        id: 2,
        tradingSymbol: "TCS",
        capitalMarketLastTradedPrice: 3712.20,
        futuresLastTradedPrice: 3715.75,
        percentageChange: -0.45,
        lastUpdatedTimestamp: new Date("2025-09-05T06:42:00Z"),
      },
    ];

    sampleStocks.forEach(stock => {
      this.stocks.set(stock.id, stock);
      
      // Generate sample price history (30 points)
      const history: StockPriceHistory[] = [];
      for (let i = 29; i >= 0; i--) {
        const timestamp = new Date();
        timestamp.setMinutes(timestamp.getMinutes() - i * 5); // 5-minute intervals
        const priceVariation = (Math.random() - 0.5) * 20; // ±10 price variation
        const price = stock.capitalMarketLastTradedPrice + priceVariation;
        
        history.push({
          id: randomUUID(),
          stockId: stock.id,
          price,
          timestamp,
        });
      }
      this.priceHistory.set(stock.id, history);
    });
  }

  async getAllStocks(): Promise<Stock[]> {
    return Array.from(this.stocks.values());
  }

  async getStock(id: number): Promise<Stock | undefined> {
    return this.stocks.get(id);
  }

  async getStockBySymbol(symbol: string): Promise<Stock | undefined> {
    return Array.from(this.stocks.values()).find(stock => stock.tradingSymbol === symbol);
  }

  async createStock(insertStock: InsertStock): Promise<Stock> {
    const id = Date.now(); // Simple integer ID generation
    const stock: Stock = {
      ...insertStock,
      id,
      lastUpdatedTimestamp: new Date(),
    };
    this.stocks.set(id, stock);
    this.priceHistory.set(id, []);
    return stock;
  }

  async updateStock(id: number, stockUpdate: Partial<Stock>): Promise<Stock | undefined> {
    const existingStock = this.stocks.get(id);
    if (!existingStock) return undefined;

    const updatedStock: Stock = {
      ...existingStock,
      ...stockUpdate,
      lastUpdatedTimestamp: new Date(),
    };
    this.stocks.set(id, updatedStock);
    return updatedStock;
  }

  async deleteStock(id: number): Promise<boolean> {
    const deleted = this.stocks.delete(id);
    this.priceHistory.delete(id);
    return deleted;
  }

  async getStockPriceHistory(stockId: number, limit: number = 30): Promise<StockPriceHistory[]> {
    const history = this.priceHistory.get(stockId) || [];
    return history.slice(-limit);
  }

  async addStockPriceHistory(priceHistory: InsertStockPriceHistory): Promise<StockPriceHistory> {
    const id = randomUUID();
    const newEntry: StockPriceHistory = {
      ...priceHistory,
      id,
      timestamp: new Date(),
    };
    
    const existingHistory = this.priceHistory.get(priceHistory.stockId) || [];
    existingHistory.push(newEntry);
    this.priceHistory.set(priceHistory.stockId, existingHistory);
    
    return newEntry;
  }

  async refreshStockData(): Promise<Stock[]> {
    // Simulate price updates
    const stocks = Array.from(this.stocks.values());
    
    for (const stock of stocks) {
      // Random price fluctuation (±2%)
      const capitalVariation = (Math.random() - 0.5) * 0.04 * stock.capitalMarketLastTradedPrice;
      const futuresVariation = (Math.random() - 0.5) * 0.04 * stock.futuresLastTradedPrice;
      const percentageVariation = (Math.random() - 0.5) * 2; // ±1% change
      
      const updatedStock: Stock = {
        ...stock,
        capitalMarketLastTradedPrice: Math.max(0, stock.capitalMarketLastTradedPrice + capitalVariation),
        futuresLastTradedPrice: Math.max(0, stock.futuresLastTradedPrice + futuresVariation),
        percentageChange: stock.percentageChange + percentageVariation,
        lastUpdatedTimestamp: new Date(),
      };
      
      this.stocks.set(stock.id, updatedStock);
      
      // Add new price history point
      await this.addStockPriceHistory({
        stockId: stock.id,
        price: updatedStock.capitalMarketLastTradedPrice,
      });
    }
    
    return this.getAllStocks();
  }
}

export const storage = new MemStorage();
