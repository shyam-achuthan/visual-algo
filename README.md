# Algorithm Builder 🚀

A powerful, extensible React component that provides a visual, node-based interface for building algorithmic trading strategies. Think **n8n meets TradingView** - drag, drop, and connect technical analysis indicators to create sophisticated trading algorithms without writing code.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)

[Demo](#demo) • [Installation](#installation) • [Usage](#usage) • [Documentation](#documentation) • [Contributing](#contributing)

## ✨ Features

### 🎯 **Visual Workflow Builder**

- **Drag & Drop Interface** - Intuitive node-based workflow creation
- **Real-time Connections** - Connect outputs to inputs with curved SVG lines
- **Zoom & Pan Canvas** - Navigate large workflows with mouse wheel and Ctrl+drag
- **Grid Background** - Professional alignment and positioning guides
- **Auto-layout** - Smart node positioning and connection routing

### 📈 **Comprehensive Technical Analysis**

- **20+ Built-in Indicators** - Complete suite of trading indicators
- **Multi-output Nodes** - MACD provides 3 outputs, Bollinger Bands provides 3 bands
- **Configurable Parameters** - Periods, sources, thresholds all customizable
- **Real-time Configuration** - Double-click nodes to modify settings instantly
- **Industry Standards** - All indicators follow standard financial calculations

### 🔧 **Professional UX/UI**

- **Hierarchical Node Palette** - Organized by categories with search
- **Interactive + Button** - Modern floating action button with smooth animations
- **Context Menus** - Right-click for additional actions and shortcuts
- **Visual Feedback** - Hover effects, selection states, connection previews
- **Responsive Design** - Works on desktop, tablet, and mobile devices

### 🛠️ **Developer-Friendly**

- **Modular Architecture** - Easy to extend with new node types
- **JSON Workflow Export** - Serialize workflows for storage/API integration
- **React Context State** - Clean, predictable state management
- **TypeScript Support** - Full type definitions (JSX version also available)
- **Tailwind CSS** - Modern, customizable styling system

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/algorithm-builder.git
cd algorithm-builder

# Install dependencies
npm install

# Start development server
npm start
```

### Basic Usage

```jsx
import AlgorithmBuilder from "./components/AlgorithmBuilder";

function App() {
  return (
    <div className="App">
      <AlgorithmBuilder />
    </div>
  );
}

export default App;
```

### With Custom Configuration

```jsx
import AlgorithmBuilder from "./components/AlgorithmBuilder";

function TradingPlatform() {
  const handleWorkflowChange = (workflow) => {
    console.log("Workflow updated:", workflow);
    // Save to backend, localStorage, etc.
  };

  return (
    <AlgorithmBuilder
      onWorkflowChange={handleWorkflowChange}
      defaultNodes={[
        {
          id: "data-source-1",
          type: "dataSource",
          position: { x: 100, y: 100 },
          config: { symbol: "BTCUSD", timeframe: "1h" },
        },
      ]}
    />
  );
}
```

## 📊 Node Categories

### 📈 **Trend Indicators**

| Node         | Description                           | Inputs     | Outputs                           |
| ------------ | ------------------------------------- | ---------- | --------------------------------- |
| **EMA**      | Exponential Moving Average            | Price Data | EMA Values                        |
| **SMA**      | Simple Moving Average                 | Price Data | SMA Values                        |
| **MACD**     | Moving Average Convergence Divergence | Price Data | MACD Line, Signal Line, Histogram |
| **ADX**      | Average Directional Index             | OHLC Data  | ADX, DI+, DI-                     |
| **Ichimoku** | Ichimoku Cloud System                 | OHLC Data  | 5 Lines (Tenkan, Kijun, etc.)     |

### ⚡ **Momentum Oscillators**

| Node            | Description             | Inputs     | Outputs          |
| --------------- | ----------------------- | ---------- | ---------------- |
| **RSI**         | Relative Strength Index | Price Data | RSI Values       |
| **Stochastic**  | Stochastic Oscillator   | OHLC Data  | %K Line, %D Line |
| **Williams %R** | Williams Percent Range  | OHLC Data  | Williams %R      |
| **CCI**         | Commodity Channel Index | OHLC Data  | CCI Values       |

### 📦 **Volume Analysis**

| Node     | Description                   | Inputs         | Outputs     |
| -------- | ----------------------------- | -------------- | ----------- |
| **OBV**  | On-Balance Volume             | Price & Volume | OBV Values  |
| **VWAP** | Volume Weighted Average Price | OHLCV Data     | VWAP Values |

### 📏 **Volatility & Bands**

| Node                | Description        | Inputs     | Outputs                    |
| ------------------- | ------------------ | ---------- | -------------------------- |
| **Bollinger Bands** | Volatility Bands   | Price Data | Upper, Middle, Lower Bands |
| **ATR**             | Average True Range | OHLC Data  | ATR Values                 |

### 🎯 **Support & Resistance**

| Node             | Description               | Inputs    | Outputs               |
| ---------------- | ------------------------- | --------- | --------------------- |
| **Pivot Points** | Support/Resistance Levels | OHLC Data | Pivot, R1, R2, S1, S2 |

### 🚦 **Signal Processing**

| Node          | Description                | Inputs           | Outputs                      |
| ------------- | -------------------------- | ---------------- | ---------------------------- |
| **Crossover** | Line Crossover Detection   | Line 1, Line 2   | Bullish Cross, Bearish Cross |
| **Compare**   | Value Comparison           | Value 1, Value 2 | Greater, Less, Equal         |
| **Signal**    | Buy/Sell Signal Generation | Trigger          | Buy Signal, Sell Signal      |

### 📊 **Data Sources**

| Node            | Description       | Inputs | Outputs     |
| --------------- | ----------------- | ------ | ----------- |
| **Data Source** | Market Data Input | None   | Market Data |

## 🎮 How to Use

### 1. **Adding Nodes**

Click the blue **+** button in the top-left corner to open the node palette. Browse categories and click on any indicator to add it to the canvas.

### 2. **Connecting Nodes**

- **Green circles** = Output ports (right side of nodes)
- **Blue circles** = Input ports (left side of nodes)
- Click and drag from a green output port to a blue input port
- Release to create the connection

### 3. **Configuring Nodes**

- **Double-click** any node to open configuration mode
- Modify parameters like periods, sources, thresholds
- Click outside or double-click again to close configuration

### 4. **Managing Nodes**

- **Drag nodes** to reposition them on the canvas
- **Hover over nodes** to see the delete button (red ×)
- **Right-click nodes** for context menu with additional options
- **Delete connections** by clicking on the connection lines

### 5. **Canvas Navigation**

- **Mouse wheel** to zoom in/out
- **Ctrl + drag** to pan around the canvas
- **Zoom controls** in the top-right corner

## 📈 Example Workflows

### Simple Moving Average Crossover

```
Data Source (AAPL, 1h)
├── SMA (20 period) ──┐
└── SMA (50 period) ──┤
                      ├── Crossover ── Signal
```

### RSI Mean Reversion Strategy

```
Data Source (BTCUSD, 15m)
└── RSI (14 period)
    ├── Compare (< 30) ── Buy Signal
    └── Compare (> 70) ── Sell Signal
```

### Multi-Indicator Confirmation

```
Data Source (EURUSD, 4h)
├── MACD ── Crossover (MACD vs Signal) ──┐
├── RSI ── Compare (> 50) ──────────────┤
└── EMA (20) vs Price ──────────────────┤
                                        ├── Signal
```

### Bollinger Bands Squeeze

```
Data Source (SPY, 1d)
└── Bollinger Bands (20, 2.0)
    ├── Upper Band ──┐
    ├── Lower Band ──┤
    └── Middle Band ─┤
                     ├── Compare (Band Width) ── Signal
```

## 🏗️ Architecture

```
algorithm-builder/
├── src/
│   ├── components/
│   │   ├── AlgorithmBuilder.jsx     # Main component
│   │   ├── NodeComponent.jsx        # Individual draggable nodes
│   │   ├── PortComponent.jsx        # Input/output connection points
│   │   ├── ConnectionLine.jsx       # SVG connection visualization
│   │   ├── Canvas.jsx              # Zoom/pan container
│   │   └── NodePalette.jsx         # Hierarchical node selector
│   ├── context/
│   │   └── WorkflowContext.jsx     # State management
│   ├── definitions/
│   │   └── nodeDefinitions.js      # Node type definitions
│   ├── types/
│   │   └── index.ts                # TypeScript definitions
│   └── styles/
│       └── globals.css             # Global styles
├── examples/
│   ├── basic-usage.jsx
│   ├── custom-nodes.jsx
│   └── integration-example.jsx
├── docs/
│   ├── API.md
│   ├── CUSTOMIZATION.md
│   └── EXAMPLES.md
└── README.md
```

## 🔧 Extending with Custom Nodes

### Define a Custom Indicator

```javascript
const myCustomIndicator = {
  type: "myCustomIndicator",
  label: "My Custom Indicator",
  icon: "🔥",
  inputs: [
    { id: "prices", type: "input", label: "Price Data" },
    { id: "volume", type: "input", label: "Volume Data" },
  ],
  outputs: [
    { id: "signal", type: "output", label: "Signal" },
    { id: "strength", type: "output", label: "Signal Strength" },
  ],
  configFields: [
    {
      id: "period",
      type: "number",
      label: "Period",
      defaultValue: 14,
      min: 1,
      max: 100,
    },
    {
      id: "sensitivity",
      type: "select",
      label: "Sensitivity",
      options: ["Low", "Medium", "High"],
      defaultValue: "Medium",
    },
    {
      id: "threshold",
      type: "number",
      label: "Threshold",
      defaultValue: 0.5,
      step: 0.1,
    },
  ],
};

// Add to nodeDefinitions
import { nodeDefinitions } from "./definitions/nodeDefinitions";
nodeDefinitions.myCustomIndicator = myCustomIndicator;
```

### Custom Node Categories

```javascript
// Add to NodePalette categories
const customCategories = {
  ...existingCategories,
  custom: {
    label: "Custom Indicators",
    icon: "🔧",
    nodes: ["myCustomIndicator", "anotherCustomNode"],
  },
};
```

## 📡 API Reference

### AlgorithmBuilder Props

```typescript
interface AlgorithmBuilderProps {
  // Initial workflow state
  defaultWorkflow?: WorkflowData;

  // Callback when workflow changes
  onWorkflowChange?: (workflow: WorkflowData) => void;

  // Custom node definitions
  customNodes?: Record<string, NodeDefinition>;

  // Theme configuration
  theme?: "light" | "dark" | "auto";

  // Canvas settings
  canvasConfig?: {
    gridSize?: number;
    minZoom?: number;
    maxZoom?: number;
    defaultZoom?: number;
  };

  // UI customization
  showControls?: boolean;
  showDataPanel?: boolean;
  showInstructions?: boolean;

  // Event handlers
  onNodeAdd?: (node: Node) => void;
  onNodeDelete?: (nodeId: string) => void;
  onConnectionAdd?: (connection: Connection) => void;
  onConnectionDelete?: (connectionId: string) => void;
}
```

### Workflow Data Structure

```typescript
interface WorkflowData {
  nodes: Node[];
  connections: Connection[];
  metadata?: {
    created: string;
    modified: string;
    version: string;
    description?: string;
  };
}

interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  config: Record<string, any>;
  metadata?: {
    created: string;
    modified: string;
  };
}

interface Connection {
  id: string;
  from: { nodeId: string; port: string };
  to: { nodeId: string; port: string };
}
```

### Context API

```typescript
const {
  workflow,
  updateNode,
  addNode,
  removeNode,
  addConnection,
  removeConnection,
  scale,
  setScale,
  offset,
  setOffset,
} = useWorkflow();
```

## 🎨 Styling & Theming

### Custom CSS Variables

```css
:root {
  --algorithm-builder-primary: #3b82f6;
  --algorithm-builder-secondary: #64748b;
  --algorithm-builder-success: #10b981;
  --algorithm-builder-danger: #ef4444;
  --algorithm-builder-warning: #f59e0b;

  --algorithm-builder-bg-primary: #ffffff;
  --algorithm-builder-bg-secondary: #f8fafc;
  --algorithm-builder-border: #e2e8f0;

  --algorithm-builder-text-primary: #1e293b;
  --algorithm-builder-text-secondary: #64748b;
  --algorithm-builder-text-muted: #94a3b8;
}

/* Dark theme */
[data-theme="dark"] {
  --algorithm-builder-bg-primary: #1e293b;
  --algorithm-builder-bg-secondary: #334155;
  --algorithm-builder-border: #475569;

  --algorithm-builder-text-primary: #f1f5f9;
  --algorithm-builder-text-secondary: #cbd5e1;
  --algorithm-builder-text-muted: #94a3b8;
}
```

### Component Styling

```css
/* Custom node styles */
.algorithm-builder-node {
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
}

.algorithm-builder-node:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Custom connection styles */
.algorithm-builder-connection {
  stroke-width: 2;
  fill: none;
  transition: stroke 0.2s ease-in-out;
}

.algorithm-builder-connection:hover {
  stroke-width: 3;
}
```

## 🌐 Browser Support

| Browser | Version | Status          |
| ------- | ------- | --------------- |
| Chrome  | 80+     | ✅ Full Support |
| Firefox | 75+     | ✅ Full Support |
| Safari  | 13+     | ✅ Full Support |
| Edge    | 80+     | ✅ Full Support |
| Opera   | 67+     | ✅ Full Support |

## 📱 Mobile Support

- **Touch Support** - Full touch interaction for mobile devices
- **Responsive Design** - Adapts to different screen sizes
- **Gesture Controls** - Pinch to zoom, pan with touch
- **Mobile-Optimized UI** - Larger touch targets, simplified interactions

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

### Test Structure

```
tests/
├── unit/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── integration/
│   ├── workflow-creation.test.js
│   ├── node-connections.test.js
│   └── data-export.test.js
└── e2e/
    ├── user-workflows.spec.js
    └── performance.spec.js
```

## 🚀 Performance

### Optimizations

- **Virtual Canvas** - Only renders visible nodes
- **Connection Pooling** - Reuses SVG path elements
- **Debounced Updates** - Optimizes real-time interactions
- **Lazy Loading** - Loads node definitions on demand
- **Memory Management** - Proper cleanup of event listeners

### Benchmarks

- **1000+ nodes** - Smooth interaction maintained
- **10,000+ connections** - Efficient rendering
- **60 FPS** - Smooth animations and interactions
- **< 100ms** - Response time for all interactions

## 🔧 Configuration

### Environment Variables

```bash
# .env file
REACT_APP_ALGORITHM_BUILDER_THEME=light
REACT_APP_ALGORITHM_BUILDER_DEBUG=false
REACT_APP_ALGORITHM_BUILDER_MAX_NODES=1000
REACT_APP_ALGORITHM_BUILDER_AUTO_SAVE=true
```

### Build Configuration

```javascript
// webpack.config.js
module.exports = {
  // ... other config
  resolve: {
    alias: {
      "@algorithm-builder": path.resolve(__dirname, "src/components"),
    },
  },
};
```

## 📚 Examples

### Basic Trading Strategy

```jsx
import React from "react";
import AlgorithmBuilder from "@algorithm-builder/AlgorithmBuilder";

const BasicStrategy = () => {
  const defaultWorkflow = {
    nodes: [
      {
        id: "data-1",
        type: "dataSource",
        position: { x: 100, y: 100 },
        config: { symbol: "AAPL", timeframe: "1d" },
      },
      {
        id: "sma-fast",
        type: "sma",
        position: { x: 300, y: 80 },
        config: { period: 10 },
      },
      {
        id: "sma-slow",
        type: "sma",
        position: { x: 300, y: 150 },
        config: { period: 30 },
      },
      {
        id: "crossover-1",
        type: "crossover",
        position: { x: 500, y: 115 },
        config: {},
      },
      {
        id: "signal-1",
        type: "signal",
        position: { x: 700, y: 115 },
        config: { signalType: "Both" },
      },
    ],
    connections: [
      {
        id: "c1",
        from: { nodeId: "data-1", port: "data" },
        to: { nodeId: "sma-fast", port: "prices" },
      },
      {
        id: "c2",
        from: { nodeId: "data-1", port: "data" },
        to: { nodeId: "sma-slow", port: "prices" },
      },
      {
        id: "c3",
        from: { nodeId: "sma-fast", port: "sma" },
        to: { nodeId: "crossover-1", port: "line1" },
      },
      {
        id: "c4",
        from: { nodeId: "sma-slow", port: "sma" },
        to: { nodeId: "crossover-1", port: "line2" },
      },
      {
        id: "c5",
        from: { nodeId: "crossover-1", port: "bullish" },
        to: { nodeId: "signal-1", port: "trigger" },
      },
    ],
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <AlgorithmBuilder defaultWorkflow={defaultWorkflow} />
    </div>
  );
};

export default BasicStrategy;
```

### Advanced Multi-Timeframe Strategy

```jsx
import React, { useState } from "react";
import AlgorithmBuilder from "@algorithm-builder/AlgorithmBuilder";

const AdvancedStrategy = () => {
  const [workflow, setWorkflow] = useState(null);

  const handleWorkflowChange = (newWorkflow) => {
    setWorkflow(newWorkflow);
    // Save to backend
    saveWorkflow(newWorkflow);
  };

  const saveWorkflow = async (workflow) => {
    try {
      await fetch("/api/strategies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workflow),
      });
    } catch (error) {
      console.error("Failed to save workflow:", error);
    }
  };

  return (
    <div className="strategy-builder">
      <header className="strategy-header">
        <h1>Advanced Strategy Builder</h1>
        <div className="strategy-actions">
          <button onClick={() => exportWorkflow(workflow)}>
            Export Strategy
          </button>
          <button onClick={() => backtest(workflow)}>Run Backtest</button>
        </div>
      </header>

      <div className="strategy-canvas">
        <AlgorithmBuilder
          onWorkflowChange={handleWorkflowChange}
          theme="dark"
          showControls={true}
          showDataPanel={true}
        />
      </div>
    </div>
  );
};
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/yourusername/algorithm-builder.git
cd algorithm-builder

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests in watch mode
npm run test:watch
```

### Contribution Guidelines

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Check code style
npm run lint

# Fix code style
npm run lint:fix

# Format code
npm run format
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Algorithm Builder

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- **Inspired by [n8n](https://n8n.io/)** - Workflow automation platform
- **Node design influenced by [Node-RED](https://nodered.org/)** - Visual programming tool
- **Technical indicators** based on industry standards and [TA-Lib](https://ta-lib.org/)
- **UI/UX patterns** from modern no-code platforms
- **Community contributions** from algorithmic trading developers

## 📞 Support

- **Documentation**: [docs.algorithm-builder.com](https://docs.algorithm-builder.com)
- **Discord Community**: [Join our Discord](https://discord.gg/algorithm-builder)
- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/algorithm-builder/issues)
- **Email Support**: support@algorithm-builder.com

## 🗺️ Roadmap

### v2.0.0 (Q2 2024)

- [ ] **Real-time Data Integration** - Live market data feeds
- [ ] **Backtesting Engine** - Built-in strategy testing
- [ ] **Strategy Marketplace** - Share and discover strategies
- [ ] **Mobile App** - Native iOS/Android applications

### v2.1.0 (Q3 2024)

- [ ] **AI Assistant** - Strategy suggestions and optimization
- [ ] **Advanced Charting** - Integrated price charts
- [ ] **Risk Management** - Position sizing and risk controls
- [ ] **Paper Trading** - Simulated live trading

### v2.2.0 (Q4 2024)

- [ ] **Multi-Asset Support** - Stocks, crypto, forex, commodities
- [ ] **Portfolio Management** - Multi-strategy portfolios
- [ ] **Social Features** - Strategy sharing and collaboration
- [ ] **Enterprise Features** - Team management and permissions

---

**⭐ Star this repo if you found it helpful!**

Built with ❤️ for the algorithmic trading community.

[⬆ Back to top](#algorithm-builder-)
