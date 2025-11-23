# BSC Token Balance Checker

A fast and efficient Node.js tool to check token balances on BNB Smart Chain (BSC) using Multicall3 for batch operations.

## 🚀 Features

- **Fast Batch Processing**: Uses Multicall3 to check multiple token balances in a single blockchain call
- **Comprehensive Token Support**: Checks balances for 500+ verified tokens on BSC
- **Native BNB Support**: Displays both ERC-20 tokens and native BNB balance
- **Zero Balance Filtering**: Only shows tokens with positive balances
- **Easy Configuration**: Simple setup with environment variables or direct code editing

## 📋 What This Tool Does

This tool connects to the BNB Smart Chain and:

1. **Reads your wallet address** from configuration
2. **Loads a comprehensive token list** from `verified-tokens.json` (500+ tokens)
3. **Batch queries token balances** using Multicall3 for efficiency
4. **Displays results** in a clean table format showing only tokens with balance > 0
5. **Shows native BNB balance** separately

## 🛠️ Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- NPM package manager

### Installation

1. **Clone or download this project**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure your wallet address** (choose one method):

   **Method 1: Using .env file (Recommended)**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env file with your wallet address
   nano .env
   ```
   
   **Method 2: Environment Variable**
   ```bash
   export WALLET_ADDRESS=0xYourWalletAddressHere
   ```

   **Method 3: Edit the code directly**
   Open `get-bsc-balances.js` and modify:
   ```js
   const WALLET_ADDRESS = "0xYourWalletAddressHere";
   ```

4. **Run the script:**
   ```bash
   node get-bsc-balances.js
   ```

### Example Output

```
Calling Multicall for 500+ tokens...
Tokens with balance > 0:
┌─────────┬──────────┬──────────────────────────────────────────────┬──────────┬─────────────┐
│ (index) │  symbol  │                   address                    │ decimals │   balance   │
├─────────┼──────────┼──────────────────────────────────────────────┼──────────┼─────────────┤
│    0    │  'USDT'  │ '0x55d398326f99059fF775485246999027B3197955' │    18    │    150.5    │
│    1    │  'CAKE'  │ '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82' │    18    │    25.75    │
└─────────┴──────────┴──────────────────────────────────────────────┴──────────┴─────────────┘
BNB: 0.125
```

## ⚙️ Advanced Configuration

### Custom RPC Endpoint

By default, the tool uses Binance's public RPC. You can change it in multiple ways:

**Method 1: Edit .env file**
```bash
# All working RPCs are listed with descriptive names:
# BSC_RPC_FASTEST=https://bsc-dataseed1.binance.org/     (640ms)
# BSC_RPC_PUBLICNODE=https://bsc.publicnode.com          (650ms)  
# BSC_RPC_BINANCE=https://bsc-dataseed.binance.org/      (701ms)

# Change the BSC_RPC line to use any of them:
BSC_RPC=https://bsc.publicnode.com
```

**Method 2: Environment Variable**
```bash
export BSC_RPC=https://your-custom-bsc-rpc-endpoint
```

**Available working RPC endpoints:**
- `https://bsc-dataseed1.binance.org/` (fastest - 640ms)
- `https://bsc.publicnode.com` (650ms)
- `https://bsc-dataseed.binance.org/` (701ms - default)
- `https://bsc-dataseed2.binance.org/`
- `https://bsc-dataseed3.binance.org/`
- `https://bsc-dataseed4.binance.org/`

### Token List

The `verified-tokens.json` file contains 500+ verified tokens on BSC. The script automatically:
- Skips native BNB (handled separately)
- Processes all ERC-20 tokens in the list
- Filters out zero balances

## 🔧 Technical Details

- **Blockchain**: BNB Smart Chain (BSC) Mainnet
- **Library**: ethers.js v6
- **Batch Processing**: Multicall3 contract (`0xca11bde05977b3631167028862be2a173976ca11`)
- **Token Standard**: ERC-20 compatible tokens
- **Performance**: Single blockchain call for all token balances

## 🤝 Contributing

Feel free to:
- Add more tokens to `verified-tokens.json`
- Improve error handling
- Add export functionality (CSV, JSON)
- Support multiple wallet addresses

## 📝 License

This project is open source and available under the MIT License.
