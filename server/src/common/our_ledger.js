module.exports = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "_key",
        "type": "bytes32"
      }
    ],
    "name": "getConfirmKey",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "remoteKey",
        "type": "bytes32"
      },
      {
        "name": "confirmKey",
        "type": "bytes32"
      }
    ],
    "name": "getTotalPeopleDeath",
    "outputs": [
      {
        "components": [
          {
            "name": "key",
            "type": "bytes32"
          },
          {
            "name": "myListConfirm",
            "type": "bytes32[]"
          }
        ],
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "remoteKey",
        "type": "bytes32"
      }
    ],
    "name": "removeConfirmKey",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "remoteKey",
        "type": "bytes32"
      },
      {
        "name": "confirmKey",
        "type": "bytes32"
      }
    ],
    "name": "addConfirmKey",
    "outputs": [
      {
        "components": [
          {
            "name": "key",
            "type": "bytes32"
          },
          {
            "name": "myListConfirm",
            "type": "bytes32[]"
          }
        ],
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_newOwner",
        "type": "address"
      }
    ],
    "name": "owner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_newOwner",
        "type": "address"
      },
      {
        "name": "confirmKey",
        "type": "bytes32"
      }
    ],
    "name": "changeOwner",
    "outputs": [
      {
        "components": [
          {
            "name": "key",
            "type": "bytes32"
          },
          {
            "name": "myListConfirm",
            "type": "bytes32[]"
          }
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_key",
        "type": "bytes32"
      }
    ],
    "name": "findPeopleData",
    "outputs": [
      {
        "components": [
          {
            "name": "peopleAddress",
            "type": "address"
          },
          {
            "name": "key",
            "type": "bytes32"
          },
          {
            "name": "confirmKey",
            "type": "bytes32"
          },
          {
            "name": "data",
            "type": "bytes32"
          }
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_accountDeath",
        "type": "address"
      },
      {
        "name": "_key",
        "type": "bytes32"
      },
      {
        "name": "_confirmKey",
        "type": "bytes32"
      },
      {
        "name": "_data",
        "type": "bytes32"
      }
    ],
    "name": "havePeopleDeath",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
