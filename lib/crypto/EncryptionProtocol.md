# 🔐 Frontend-Backend Encryption Protocol

This document outlines the encryption protocol used to securely exchange data between the frontend and backend of the **Content Vault** system. It is designed with privacy and tamper-resistance in mind, while maintaining simplicity and compatibility for Web3 applications.

---

## ✨ Objectives

- Ensure sensitive data (such as CIDs to IPFS content) is protected in transit.
- Prevent front-running attacks by validating client legitimacy.
- Avoid requiring user signatures or secrets in cleartext.
- Provide secure yet modular cryptographic operations.

---

## 🌐 Context

This protocol is used for secure file uploads to IPFS via a backend (e.g., Render-hosted NestJS server). Frontend users request IPFS uploads, and the backend encrypts the resulting CID before sending it back to the frontend for on-chain submission.

---

## ⚖️ Roles & Responsibilities

| Role         | Responsibility                                           |
| ------------ | -------------------------------------------------------- |
| **Frontend** | Generates and stores credentials. Sends data to backend. |
| **Backend**  | Verifies credentials. Uploads file. Encrypts CID.        |
| **Supabase** | Stores user-specific credentials with RLS protection.    |

---

## 📁 Stored Secrets (per user)

| Field           | Description                               | Generated Where |
| --------------- | ----------------------------------------- | --------------- |
| `password`      | High-entropy 32-byte hex string           | Frontend        |
| `salt`          | 16-byte random hex string                 | Frontend        |
| `response_salt` | 16-byte random hex string (for responses) | Backend         |

Stored in Supabase table `user_secrets` protected by RLS.

---

## ⚔️ Request Flow (Frontend ➡️ Backend)

1. **Generate Secrets**

   - `password` and `salt` generated in the frontend.
   - Stored in Supabase.

2. **Validate Identity**

   - Frontend computes: `hashDerivedKey = PBKDF2(password, salt)`
   - Sends request with:
     ```json
     {
       "walletAddress": "0x...",
       "hashedDerivedKey": "...",
       "file": <multipart binary>
     }
     ```

3. **Backend Verification**

   - Retrieves stored `password` and `salt`.
   - Recomputes hash and verifies.

4. **IPFS Upload**

   - File is uploaded to IPFS via Pinata.
   - Response contains raw CID.

5. **Encrypt CID**

   - Backend retrieves `response_salt` or generates one.
   - Derives key using `PBKDF2(password, response_salt)`.
   - Encrypts CID with `AES-GCM`.
   - Encodes `cidEncrypted` as a hex string for compatibility with smart contract payloads.

6. **Return Encrypted Payload**

   ```json
   {
     "cidEncrypted": "0x...",
     "timestamp": "2025-04-15T14:32:00Z"
   }
   ```

---

## 🛫 Response Flow (Backend ➡️ Frontend)

1. Frontend retrieves `response_salt` from Supabase.
2. Reconstructs key: `PBKDF2(password, response_salt)`
3. Decrypts `cidEncrypted`
4. Encodes metadata as a hex string
5. Submits **encrypted CID and hex-encoded metadata** to the smart contract

> 🔒 **Note:** The encrypted CID is what gets submitted on-chain. Only frontends with access to the vault and knowledge of the password + `response_salt` can decrypt it.

---

## 🧩 Diagram

```
┌────────────┐         ┌────────────┐         ┌──────────────┐
│  Frontend  │         │  Backend   │         │  Supabase    │
└────┬───────┘         └────────┬───┘         └─────┬────────┘
     │ Generate password & salt │                   │
     ├─────────────────────────>│                   │
     │                         ├───────────────────>│ (store)
     │                         │                    │
     │ hashDerivedKey = PBKDF2 │                    │
     ├────────────────────────>│                    │
     │                         │  check credentials │
     │                         ├───────────────────>│ (fetch + verify)
     │                         │                    │
     │         Upload File     │                    │
     ├────────────────────────>│                    │
     │                         │      Get CID       │
     │                         │<───────────────────┤
     │                         │  Encrypt CID       │
     │                         │ with PBKDF2(pass,response_salt)
     │                         │                    │
     │  Receive Encrypted CID  │                    │
     │◄────────────────────────┤                    │
     │                         │                    │
     │ Decrypt and Encode Hex  │                    │
     │ Submit TX to Smart Contract                  │
```

---

## 🔐 Cryptographic Notes

- **Encryption:** AES-GCM with 256-bit keys
- **Key Derivation:** PBKDF2 with SHA-256 and 100,000 iterations
- **Randomness:** Salt and IV generated with `crypto.getRandomValues`
- **CID Encoding:** Encrypted CID is encoded as a hex string
- **Metadata Encoding:** Metadata is encoded to hex before on-chain submission

---

## 🚫 Security Considerations

- `password` and salts are never exposed in transmission.
- Reused passwords with unique salts allow different hashes per operation.
- RLS in Supabase prevents unauthorized access to secrets.
- Smart contracts never see decrypted CIDs or plaintext metadata — only encrypted and hex-encoded data is stored on-chain.

---

## ✨ Future Improvements

- Optional user-controlled passwords
- Support for signing metadata for enhanced authenticity
- IPFS gateway resolution privacy via relay or ZK-friendly encoding

---

For questions or contributions, open an issue or PR in the GitHub repository.
