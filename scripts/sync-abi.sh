#!/bin/bash

# Path to Vault's foundry project
CONTRACTS_PATH="../content-vault-contracts"

# Path to Vault ABI output
VAULT_JSON="$CONTRACTS_PATH/out/Vault.sol/Vault.json"

# Destination in frontend
DEST_ABI_DIR="./lib/contracts/abis"
DEST_ABI_FILE="$DEST_ABI_DIR/Vault.json"

# Ensure output folder exists
mkdir -p "$DEST_ABI_DIR"

# Extract the ABI using jq
jq '.abi' "$VAULT_JSON" > "$DEST_ABI_FILE"

echo "✅ Vault ABI synced to $DEST_ABI_FILE"
