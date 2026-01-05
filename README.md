## 📋 Prerequisites

Before running this application, ensure you have:

### 1. WalletConnect Project ID (Required)

This application uses RainbowKit for wallet connectivity, which requires a WalletConnect Project ID:

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Sign up for a free account
3. Create a new project
4. Copy your **Project ID** from the dashboard
5. Add it to your `.env` file as `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

### 2. Ethereum Wallet with Testnet Funds

For development/testing:
- Install MetaMask or similar wallet
- Switch to **Sepolia testnet**
- Get testnet ETH from [Sepolia faucet](https://sepoliafaucet.com/)

---

## 🛠️ Installation

### Step 1: Clone the Repository

```bash
git clone git@github.com:ritiksharmarj/paradex-trading.git
cd paradex-trading
```

### Step 2: Install Dependencies

```bash
pnpm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# REQUIRED: Get this from cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# OPTIONAL: Defaults to localhost:3000 in development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Environment-Based API Selection:**
- `development` mode → Paradex Testnet (`https://api.testnet.paradex.trade/v1`)
- `production` mode → Paradex Production (`https://api.prod.paradex.trade/v1`)

### Step 4: Run Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

---

## 🎯 Usage Guide

### 1. Connect Your Wallet

- Click **"Connect Wallet"** in the top-right corner
- Select your wallet provider (MetaMask, WalletConnect, etc.)
- Approve the connection request
- **First-time users**: Sign a message to create your Paradex account
- Wait for account creation and authentication (~5-10 seconds)

**Troubleshooting:**
- ❌ Wallet not detected? → Install wallet extension and refresh page
- ❌ Connection failed? → Check that you're on Sepolia testnet (development)
- ❌ Signature rejected? → Account creation requires your signature

### 2. Select a Trading Market

- Use the **market selector dropdown** in the top-left corner
- Browse available markets: BTC-USD-PERP, ETH-USD-PERP, SOL-USD-PERP, etc.
- Click to select a market
- Market info bar will update with current price and funding rate


### 3. Place a Trade

The trading panel (right side) allows you to execute market orders:

#### Enter Position Details
1. **Position Size**: Enter the amount in base currency (e.g., 0.1 BTC)
2. **Leverage**: Adjust using slider or preset buttons (1x, 5x, 10x, 25x)
3. **Review Balance**: Check your available balance displayed below inputs

#### Validation & Guardrails
- ⚠️ **Insufficient balance** → Error shown, button disabled
- ⚠️ **Invalid size** (negative, zero, or non-numeric) → Input validation error
- ⚠️ **Wallet not connected** → Button redirects to wallet connection
- ⚠️ **Position too large** → Exceeds available balance with leverage

#### Execute Trade
1. Click **"Long"** (buy) or **"Short"** (sell)
2. Review the order details
3. **Sign the transaction** in your wallet
4. Wait for confirmation (~2-5 seconds)
5. Success notification appears
6. Positions table auto-refreshes

### 4. Monitor Active Positions

The **Positions** panel (bottom) displays all your open positions:

| Column | Description |
|--------|-------------|
| **Market** | Trading pair (e.g., BTC-USD-PERP) |
| **Size** | Position size in base currency |
| **PnL** | Unrealized profit/loss in USD |
| **Entry Price** | Average entry price in USD |

**States:**
- 🔄 **Loading**: Skeleton placeholders while fetching
- 📭 **Empty**: "No open positions" message when account has no positions
- 📊 **Active**: Table shows all positions with live PnL

Positions automatically refresh after placing trades and every 60 seconds.

---

## 🏗️ Technical Architecture

### Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16.1.1 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **Wallet** | RainbowKit v2.2 + Wagmi v3.1 + Viem v2.43 |
| **Web3** | Ethers.js v6.16, StarkNet.js v9.2, Paradex SDK v0.8 |
| **State** | React Query v5.90 (TanStack Query) |
| **Forms** | React Hook Form + Zod validation |
| **UI Components** | Radix UI primitives |
| **Notifications** | Sonner (toast messages) |
| **HTTP Client** | Axios v1.13 |
| **Code Quality** | Biome v2.2 (linting & formatting) |

### Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Main trading dashboard
│   └── globals.css          # Global styles + Tailwind
│
├── components/
│   ├── layout/              # Core layout components
│   │   ├── header.tsx       # Wallet connection + market selector
│   │   ├── market.tsx       # Market info bar (price, funding)
│   │   ├── positions.tsx    # Active positions table
│   │   └── trading-panel.tsx # Order entry form
│   └── ui/                  # Reusable UI primitives
│       ├── button.tsx       # Button component
│       ├── card.tsx         # Card layout
│       ├── dialog.tsx       # Modal dialogs
│       ├── dropdown-menu.tsx # Dropdowns
│       ├── form.tsx         # Form components
│       ├── input.tsx        # Input fields
│       ├── table.tsx        # Data tables
│       └── ...              # Other Radix UI wrappers
│
├── hooks/
│   ├── use-paradex.ts       # Paradex API hooks (queries + mutations)
│   └── use-responsive.ts    # Responsive design utilities
│
├── lib/
│   ├── paradex/             
│   │   ├── index.ts         # Account connection + key derivation
│   │   ├── api.ts           # ParadexAPI class (orders, positions, etc.)
│   │   ├── signature.ts     # StarkNet signature generation
│   │   ├── typed_data.ts    # EIP-712 style typed data structures
│   │   ├── conversions.ts   # Price/size quantum conversions
│   │   └── types.ts         # TypeScript interfaces
│   ├── wagmi.ts             # Wagmi + RainbowKit configuration
│   ├── utils.ts             # Utility functions (cn, formatters)
│   └── zod.ts               # Zod validation schemas
│
├── providers/
│   ├── action.tsx           # Global state (selected market, API instance)
│   └── index.tsx            # Provider composition (Wagmi + Query + RK)
│
└── server/
    └── api/
        ├── axios.ts         # Axios wrapper with base URLs
        └── routes.ts        # API endpoint definitions
```

### Key Design Decisions

#### 1. Hybrid Ethereum + StarkNet Architecture

**Problem**: Paradex runs on StarkNet L2, but users have Ethereum wallets.

**Solution**: Deterministic key derivation
- User signs an Ethereum message with MetaMask
- Signature is used to derive a StarkNet private key via `grindKey()` algorithm
- Generates L2 address that represents the user on Paradex
- No StarkNet wallet needed—completely seamless UX

**Implementation** ([src/lib/paradex/index.ts](src/lib/paradex/index.ts)):
```typescript
function grindKey(signature: string): string {
  // Iterates up to 10,000 times to find valid StarkNet key
  // Uses ec.starkCurve.grindKey() matching Paradex spec
  // Validates that derived address length ≤ 63 characters
}
```

#### 2. Typed Data Signing for All Requests

All authenticated requests to Paradex require StarkNet-style EIP-712 signatures:

- **Onboarding**: Signs account creation request
- **Authentication**: Signs JWT request (7-day expiration)
- **Orders**: Signs each order with price, size, market, timestamp

**Implementation** ([src/lib/paradex/signature.ts](src/lib/paradex/signature.ts)):
```typescript
generateSignature(typedData, privateKey) // Returns hex signature
```

#### 3. React Query for Data Management

**Why React Query?**
- Automatic caching (60-second stale time)
- Background refetching on window focus (disabled for trading)
- Optimistic updates and cache invalidation
- Loading and error states out of the box


#### 4. Form Validation with Zod + React Hook Form

**Benefits**:
- Type-safe validation schemas
- Real-time error feedback
- Disabled states for invalid inputs
- Single source of truth for validation logic

**Example Validation**:
```typescript
size: z.string()
  .min(1, "Size is required")
  .refine(val => !isNaN(Number(val)), "Must be a number")
  .refine(val => Number(val) > 0, "Must be positive")
```
