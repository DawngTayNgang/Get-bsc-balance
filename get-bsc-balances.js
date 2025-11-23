const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// ================== CONFIG ==================
const BSC_RPC =
  process.env.BSC_RPC || "https://bsc-dataseed.binance.org/";

// BSC wallet address to check
const WALLET_ADDRESS = process.env.WALLET_ADDRESS || "0x779ea720586d1AA4e0867dC221F7e35c18e79cD9";

// Multicall3 address on BSC mainnet
const MULTICALL_ADDRESS =
  "0xca11bde05977b3631167028862be2a173976ca11";
// ============================================

// Minimal ABI for ERC20 and Multicall3
const erc20Abi = [
  "function balanceOf(address) view returns (uint256)",
];

const multicallAbi = [
  "function tryAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) public view returns (tuple(bool success, bytes returnData)[] memory returnData)",
];

async function main() {
  if (!ethers.isAddress(WALLET_ADDRESS)) {
    throw new Error(
      "WALLET_ADDRESS is invalid, edit in code or set WALLET_ADDRESS environment variable",
    );
  }

  console.log("Connecting to BSC RPC...");
  const provider = new ethers.JsonRpcProvider(BSC_RPC);
  
  // Test connection
  try {
    await provider.getNetwork();
    console.log("✅ Connected to BSC successfully");
  } catch (error) {
    throw new Error(`❌ Failed to connect to BSC RPC: ${error.message}`);
  }

  const multicall = new ethers.Contract(
    MULTICALL_ADDRESS,
    multicallAbi,
    provider,
  );

  const tokensPath = path.join(__dirname, "verified-tokens.json");
  let tokens;
  
  try {
    tokens = JSON.parse(fs.readFileSync(tokensPath, "utf8"));
    console.log(`📋 Loaded ${tokens.length} tokens from verified-tokens.json`);
  } catch (error) {
    throw new Error(`❌ Failed to read token list: ${error.message}`);
  }

  const iface = new ethers.Interface(erc20Abi);

  const tokensErc20 = tokens.filter(
    (t) =>
      t.address &&
      t.address.toLowerCase() !==
        "0x0000000000000000000000000000000000000000",
  );

  const calls = tokensErc20.map((t) => ({
    target: t.address,
    callData: iface.encodeFunctionData("balanceOf", [WALLET_ADDRESS]),
  }));

  console.log(`Calling Multicall for ${calls.length} tokens...`);

  let results;
  try {
    results = await multicall.tryAggregate(false, calls);
    console.log("✅ Multicall completed successfully");
  } catch (error) {
    throw new Error(`❌ Multicall failed: ${error.message}`);
  }

  const nonZero = [];

  for (let i = 0; i < tokensErc20.length; i++) {
    const token = tokensErc20[i];
    const { success, returnData } = results[i];

    if (!success || !returnData || returnData === "0x") continue;

    try {
      const [balanceBN] = iface.decodeFunctionResult("balanceOf", returnData);

      const decimals = token.decimals ?? 18;
      const human = Number(ethers.formatUnits(balanceBN, decimals));

      if (human > 0) {
        nonZero.push({
          symbol: token.symbol,
          name: token.name,
          address: token.address,
          decimals,
          balance: human,
        });
      }
    } catch (error) {
      console.warn(`⚠️  Failed to decode balance for ${token.symbol}: ${error.message}`);
      continue;
    }
  }

  console.log("Tokens with balance > 0:");
  console.table(nonZero);

  const bnbBalance = await provider.getBalance(WALLET_ADDRESS);
  console.log("BNB:", Number(ethers.formatEther(bnbBalance)));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
