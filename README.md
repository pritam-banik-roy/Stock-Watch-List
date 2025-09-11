# Stock Watchlist Lite

A modern, responsive stock market tracking application built with React and TypeScript. The app displays real-time stock data with capital and futures prices, percentage changes, and interactive candlestick charts.

## How to Run the Project

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation & Setup

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```
   This command starts both the Express backend server and Vite frontend development server on port 5000.

3. **Access the Application**
   - Open your browser and navigate to `http://localhost:5000`
   - The application will automatically refresh when you make changes to the code

### Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── lib/           # Utilities and configuration
│   │   └── contexts/      # React contexts (theme provider)
├── server/                # Backend Express application
│   ├── routes.ts          # API route definitions
│   └── storage.ts         # In-memory data storage
├── shared/                # Shared TypeScript schemas
└── package.json
```

## Clarifying Questions & Assumptions

Before starting development, I would have asked these clarifying questions:

### 1. **Data Source & Real-time Updates**
   - *Question*: "Do you need integration with a real stock market API, or is simulated data sufficient for this demo?"
   - *Assumption*: Used simulated data with realistic price fluctuations and auto-refresh every 30 seconds to demonstrate real-time functionality.

### 2. **Chart Complexity & Technical Analysis**
   - *Question*: "What level of chart sophistication is needed? Basic line charts or full candlestick charts with technical indicators?"
   - *Assumption*: Implemented professional candlestick (OHLC) charts as they provide more comprehensive financial data visualization.

### 3. **User Persistence & Authentication**
   - *Question*: "Should user preferences (like theme, sorting, watchlist customization) persist between sessions, and do you need user accounts?"
   - *Assumption*: Implemented basic localStorage persistence for theme preferences only, no user authentication system.

### 4. **Mobile Responsiveness & Accessibility**
   - *Question*: "What devices should be supported, and are there specific accessibility requirements (WCAG compliance level)?"
   - *Assumption*: Built mobile-first responsive design with basic accessibility features using semantic HTML and ARIA attributes.

### 5. **Scalability & Performance**
   - *Question*: "How many stocks should the system handle simultaneously, and what are the performance requirements?"
   - *Assumption*: Optimized for small to medium datasets (10-100 stocks) with client-side filtering and sorting for best user experience.

## Features Implemented

### Core Functionality
-  **6-Stock Grid Layout**: Responsive card-based grid displaying 6 stocks per row on desktop
-  **Real-time Data Updates**: Automatic refresh every 30 seconds with loading indicators
- **Price Toggle Views**: Switch between capital market prices and futures prices
-  **Search & Filter**: Real-time search by stock symbol or name
-  **Advanced Sorting**: Sort by percentage change, capital price, or futures price (ascending/descending)

### Data Visualization
-  **Candlestick Charts**: Professional OHLC (Open, High, Low, Close) charts in detail drawer
- **Color-coded Indicators**: Green for bullish movements, red for bearish movements
-  **Interactive Stock Cards**: Hover effects and click-to-expand functionality
-  **Price History**: 30-point historical data with 5-minute intervals

### User Experience
-  **Dark/Light Theme**: Complete theme system with system preference detection
-  **Loading States**: Skeleton loaders and spinners during data fetching
-  **Error Handling**: Comprehensive error states with retry mechanisms
-  **Responsive Design**: Mobile-first approach with breakpoint optimization
-  **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML

### Technical Features
-  **Type Safety**: Full TypeScript implementation with shared schemas
-  **State Management**: TanStack Query for server state and caching
-  **Modern UI Components**: Radix UI primitives with shadcn/ui design system
-  **Hot Module Replacement**: Development experience with instant updates

## Known Tradeoffs & Next Steps

### Current Limitations

1. **Simulated Data**
   - *Tradeoff*: Using mock data instead of real market feeds
   - *Next Step*: Integrate with financial APIs (Alpha Vantage, Yahoo Finance, or IEX Cloud)

2. **In-Memory Storage**
   - *Tradeoff*: Data doesn't persist between server restarts
   - *Next Step*: Implement PostgreSQL database with proper schema migrations

3. **Client-Side Processing**
   - *Tradeoff*: All filtering/sorting happens in browser, may not scale to thousands of stocks
   - *Next Step*: Implement server-side pagination and filtering with database queries

4. **Limited Chart Features**
   - *Tradeoff*: Basic candlestick charts without technical indicators
   - *Next Step*: Add moving averages, volume indicators, and drawing tools

### Potential Improvements

1. **Performance Optimizations**
   - Implement virtual scrolling for large stock lists
   - Add service worker for offline functionality
   - Optimize chart rendering with WebGL or canvas

2. **Enhanced Features**
   - User accounts with personalized watchlists
   - Price alerts and notifications
   - Portfolio tracking and performance analytics
   - Export data to CSV/PDF reports

3. **Advanced Functionality**
   - WebSocket connections for true real-time updates
   - Multiple timeframe charts (1min, 5min, 1hour, 1day)
   - Technical analysis indicators and overlays
   - Compare multiple stocks on one chart

4. **Production Readiness**
   - Comprehensive test coverage (unit, integration, e2e)
   - CI/CD pipeline with automated deployments
   - Monitoring and error tracking (Sentry, DataDog)
   - Rate limiting and API security measures

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **State Management**: TanStack Query (React Query)
- **UI Components**: Radix UI, shadcn/ui, Lucide React
- **Development**: Hot Module Replacement, ESLint, TypeScript strict mode
- **Build**: Vite for frontend, esbuild for backend production builds

---

