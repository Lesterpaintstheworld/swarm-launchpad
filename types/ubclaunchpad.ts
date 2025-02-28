/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/ubclaunchpad.json`.
 */
export type Ubclaunchpad = {
  "address": "4dWhc3nkP4WeQkv7ws4dAxp6sNTBLCuzhTGTf1FynDcf",
  "metadata": {
    "name": "ubclaunchpad",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "buyListing",
      "discriminator": [
        115,
        149,
        42,
        108,
        44,
        49,
        140,
        153
      ],
      "accounts": [
        {
          "name": "shareListing",
          "writable": true
        },
        {
          "name": "buyerShareholder",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  104,
                  97,
                  114,
                  101,
                  104,
                  111,
                  108,
                  100,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "buyer"
              }
            ]
          }
        },
        {
          "name": "sellerShareholder",
          "writable": true
        },
        {
          "name": "tokenMintAccount",
          "writable": true
        },
        {
          "name": "buyerTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "buyer"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "tokenMintAccount"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "sellerAccount",
          "writable": true
        },
        {
          "name": "sellerTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "sellerAccount"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "tokenMintAccount"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "custodialAccount",
          "writable": true
        },
        {
          "name": "custodialTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "custodialAccount"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "tokenMintAccount"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "pool"
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "transactionFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "buyListingWithLamports",
      "discriminator": [
        75,
        208,
        219,
        236,
        36,
        115,
        51,
        248
      ],
      "accounts": [
        {
          "name": "shareListing",
          "writable": true
        },
        {
          "name": "buyerShareholder",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  104,
                  97,
                  114,
                  101,
                  104,
                  111,
                  108,
                  100,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "buyer"
              }
            ]
          }
        },
        {
          "name": "sellerShareholder",
          "writable": true
        },
        {
          "name": "sellerAccount",
          "writable": true
        },
        {
          "name": "custodialAccount",
          "writable": true
        },
        {
          "name": "pool"
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "transactionFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelListing",
      "discriminator": [
        41,
        183,
        50,
        232,
        230,
        233,
        157,
        70
      ],
      "accounts": [
        {
          "name": "shareListing",
          "writable": true
        },
        {
          "name": "shareholder",
          "writable": true
        },
        {
          "name": "pool"
        },
        {
          "name": "seller",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "createListing",
      "discriminator": [
        18,
        168,
        45,
        24,
        191,
        31,
        117,
        54
      ],
      "accounts": [
        {
          "name": "shareholder",
          "writable": true
        },
        {
          "name": "shareListing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "seller"
              },
              {
                "kind": "arg",
                "path": "listingId"
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true
        },
        {
          "name": "seller",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "listingId",
          "type": "string"
        },
        {
          "name": "numberOfShares",
          "type": "u64"
        },
        {
          "name": "pricePerShare",
          "type": "u64"
        },
        {
          "name": "desiredToken",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "freezePool",
      "discriminator": [
        211,
        216,
        1,
        216,
        54,
        191,
        102,
        150
      ],
      "accounts": [
        {
          "name": "pool",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "state",
          "type": "bool"
        }
      ]
    },
    {
      "name": "increaseSupply",
      "discriminator": [
        101,
        124,
        135,
        249,
        83,
        99,
        110,
        136
      ],
      "accounts": [
        {
          "name": "pool",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "numberOfShares",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "arg",
                "path": "poolName"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "poolName",
          "type": "string"
        },
        {
          "name": "totalShares",
          "type": "u64"
        },
        {
          "name": "feeRatio",
          "type": "u64"
        },
        {
          "name": "computeMint",
          "type": "pubkey"
        },
        {
          "name": "ubcMint",
          "type": "pubkey"
        },
        {
          "name": "custodialAccount",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "purchaseShares",
      "discriminator": [
        171,
        132,
        3,
        224,
        99,
        69,
        214,
        250
      ],
      "accounts": [
        {
          "name": "pool",
          "writable": true
        },
        {
          "name": "shareholder",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  104,
                  97,
                  114,
                  101,
                  104,
                  111,
                  108,
                  100,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "buyer"
              }
            ]
          }
        },
        {
          "name": "computeMintAccount",
          "writable": true
        },
        {
          "name": "ubcMintAccount",
          "writable": true
        },
        {
          "name": "senderComputeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "buyer"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "computeMintAccount"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "senderUbcAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "buyer"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "ubcMintAccount"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "custodialAccount"
        },
        {
          "name": "custodialComputeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "custodialAccount"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "computeMintAccount"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "custodialUbcAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "custodialAccount"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "ubcMintAccount"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "numberOfShares",
          "type": "u64"
        },
        {
          "name": "calculatedCost",
          "type": "u64"
        }
      ]
    },
    {
      "name": "removePool",
      "discriminator": [
        132,
        42,
        53,
        138,
        28,
        220,
        170,
        55
      ],
      "accounts": [
        {
          "name": "pool",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "setCustodialAccount",
      "discriminator": [
        244,
        121,
        199,
        7,
        101,
        146,
        152,
        68
      ],
      "accounts": [
        {
          "name": "pool",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "custodialAccount",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "setFeeRatio",
      "discriminator": [
        213,
        25,
        1,
        91,
        57,
        80,
        247,
        30
      ],
      "accounts": [
        {
          "name": "pool",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "feeRatio",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setMints",
      "discriminator": [
        176,
        123,
        110,
        25,
        240,
        234,
        43,
        231
      ],
      "accounts": [
        {
          "name": "pool",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "ubcMint",
          "type": "pubkey"
        },
        {
          "name": "computeMint",
          "type": "pubkey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "pool",
      "discriminator": [
        241,
        154,
        109,
        4,
        17,
        177,
        109,
        188
      ]
    },
    {
      "name": "shareListing",
      "discriminator": [
        38,
        219,
        182,
        80,
        137,
        29,
        254,
        143
      ]
    },
    {
      "name": "shareholder",
      "discriminator": [
        93,
        254,
        55,
        138,
        251,
        186,
        195,
        3
      ]
    }
  ],
  "events": [
    {
      "name": "buyListingEvent",
      "discriminator": [
        16,
        85,
        211,
        187,
        76,
        25,
        176,
        81
      ]
    },
    {
      "name": "purchaseSharesEvent",
      "discriminator": [
        238,
        83,
        223,
        45,
        131,
        222,
        119,
        78
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidAuthority",
      "msg": "Invalid Authority"
    },
    {
      "code": 6001,
      "name": "poolFrozen",
      "msg": "Pool is frozen"
    },
    {
      "code": 6002,
      "name": "insufficientShares",
      "msg": "Insufficient shares available"
    },
    {
      "code": 6003,
      "name": "maxWhitelistedTokensReached",
      "msg": "Maximum number of whitelisted tokens reached"
    },
    {
      "code": 6004,
      "name": "invalidPaymentAmount",
      "msg": "Invalid payment amount"
    },
    {
      "code": 6005,
      "name": "invalidTokenAccountOwner",
      "msg": "Invalid token account owner"
    },
    {
      "code": 6006,
      "name": "invalidToken",
      "msg": "Invalid token"
    },
    {
      "code": 6007,
      "name": "invalidPaymentToken",
      "msg": "Invalid payment token"
    },
    {
      "code": 6008,
      "name": "invalidFeeToken",
      "msg": "Invalid fee token"
    },
    {
      "code": 6009,
      "name": "invalidAmount",
      "msg": "Invalid amount for operation"
    },
    {
      "code": 6010,
      "name": "listingNotActive",
      "msg": "Listing is not active"
    },
    {
      "code": 6011,
      "name": "cannotPurchaseOwnListing",
      "msg": "Cannot purchase your own listing"
    },
    {
      "code": 6012,
      "name": "invalidPool",
      "msg": "Invalid pool for operation"
    },
    {
      "code": 6013,
      "name": "invalidPoolNameLength",
      "msg": "Pool name exceeds maximum length"
    },
    {
      "code": 6014,
      "name": "mathError",
      "msg": "Math operation failed"
    },
    {
      "code": 6015,
      "name": "tooManyShares",
      "msg": "Too many shares, limit 1000"
    },
    {
      "code": 6016,
      "name": "tokenNotWhitelisted",
      "msg": "Token not in whitelist"
    },
    {
      "code": 6017,
      "name": "shareholderInitialisationFailed",
      "msg": "Could not initialise new shareholder account"
    },
    {
      "code": 6018,
      "name": "invalidListingAccount",
      "msg": "Invalid listing account"
    }
  ],
  "types": [
    {
      "name": "buyListingEvent",
      "docs": [
        "Events"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "listingId",
            "type": "string"
          },
          {
            "name": "transactionType",
            "type": "string"
          },
          {
            "name": "buyer",
            "type": "pubkey"
          },
          {
            "name": "seller",
            "type": "pubkey"
          },
          {
            "name": "pool",
            "type": "pubkey"
          },
          {
            "name": "token",
            "type": "pubkey"
          },
          {
            "name": "numberOfShares",
            "type": "u64"
          },
          {
            "name": "pricePerShare",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "fee",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "adminAuthority",
            "type": "pubkey"
          },
          {
            "name": "totalShares",
            "type": "u64"
          },
          {
            "name": "availableShares",
            "type": "u64"
          },
          {
            "name": "isFrozen",
            "type": "bool"
          },
          {
            "name": "ubcMint",
            "type": "pubkey"
          },
          {
            "name": "computeMint",
            "type": "pubkey"
          },
          {
            "name": "feeRatio",
            "type": "u64"
          },
          {
            "name": "custodialAccount",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "purchaseSharesEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "transactionType",
            "type": "string"
          },
          {
            "name": "buyer",
            "type": "pubkey"
          },
          {
            "name": "pool",
            "type": "pubkey"
          },
          {
            "name": "numberOfShares",
            "type": "u64"
          },
          {
            "name": "pricePerShare",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "fee",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "shareListing",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pool",
            "type": "pubkey"
          },
          {
            "name": "seller",
            "type": "pubkey"
          },
          {
            "name": "shareholder",
            "type": "pubkey"
          },
          {
            "name": "numberOfShares",
            "type": "u64"
          },
          {
            "name": "pricePerShare",
            "type": "u64"
          },
          {
            "name": "desiredToken",
            "type": "pubkey"
          },
          {
            "name": "listingId",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "shareholder",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pool",
            "type": "pubkey"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "shares",
            "type": "u64"
          },
          {
            "name": "availableShares",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "upgradeAuthority",
      "type": "string",
      "value": "\"DKc63ukZvHo1vfQMYWxk27EconWJ5tMjYrEaFmhpejZf\""
    }
  ]
};
