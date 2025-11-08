export const PAYMENT_CONTRACT_ABI = [
  {
    "type": "function",
    "name": "init",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "deposit",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "withdraw",
    "inputs": [
      {
        "name": "amount",
        "type": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "sendFuncionarios",
    "inputs": [
      {
        "name": "recipients",
        "type": "address[]"
      },
      {
        "name": "amounts",
        "type": "uint256[]"
      },
      {
        "name": "due_date_unix",
        "type": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "sendTransaction",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {
        "name": "account",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getFuncionarios",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "components": [
          {
            "name": "recipients",
            "type": "address[]"
          },
          {
            "name": "amounts",
            "type": "uint256[]"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isPending",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDueDate",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getOwner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTotalSupply",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTotalBatches",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTotalPayments",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getQueuedCount",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getQueuedTotal",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDashboardStats",
    "inputs": [],
    "outputs": [
      {
        "name": "queuedCount",
        "type": "uint256"
      },
      {
        "name": "queuedTotal",
        "type": "uint256"
      },
      {
        "name": "totalPayments",
        "type": "uint256"
      },
      {
        "name": "totalBatches",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  }
] as const;

export const PAYMENT_CONTRACT_ADDRESS = "0xA25704939B92a528fB10c72aCE63adeEeC9DDd85" as `0x${string}`;
