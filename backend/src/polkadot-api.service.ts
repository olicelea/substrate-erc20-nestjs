import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import { Abi, PromiseContract } from '@polkadot/api-contract';
import metadata from "./metadata.json";

const SUBSTRATE_URL = 'ws://127.0.0.1:9944'
export const ERC20 = '5DhP1rd5AEZCeZY77Zttbt293rX6tX4QnqEajEMd5i1QKsnB'

// accounts list to easily intercact with the API
export const ACCOUNTS = {
  ALICE: {
    address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    pair: undefined,
  },
  BOB:  {
    address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
    pair: undefined,
  },
  CHARLIE:  {
    address: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
    pair: undefined,
  },
  DAVE:  {
    address: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
    pair: undefined,
  },
  EVE:  {
    address: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw',
    pair: undefined,
  },
}

@Injectable()
export class PolkadotApiService implements OnModuleInit {
  api: ApiPromise;
  abi: Abi;
  apiContract: PromiseContract;

  async onModuleInit() {
    Logger.log('Connecting to substrate chain...');
    const wsProvider = new WsProvider(SUBSTRATE_URL);
    this.api = await ApiPromise.create({
      provider: wsProvider,
      types: {
        "Address": "AccountId",
        "LookupSource": "AccountId"
      }
    });

    const abiJSONobj = (<any>metadata);
    this.abi = new Abi(this.api.registry, abiJSONobj);
    this.apiContract = new PromiseContract(this.api, this.abi, ERC20);

    await this.api.isReady;

    const keyring = new Keyring({ type: 'sr25519' });
    ACCOUNTS.ALICE.pair =  keyring.addFromUri('//Alice', { name: 'Alice default' });
    ACCOUNTS.BOB.pair =  keyring.addFromUri('//Bob', { name: 'Bob default' });
    ACCOUNTS.CHARLIE.pair =  keyring.addFromUri('//Charlie', { name: 'Charlie default' });
    ACCOUNTS.DAVE.pair =  keyring.addFromUri('//Dave', { name: 'Dave default' });
    ACCOUNTS.EVE.pair =  keyring.addFromUri('//Eve', { name: 'Eve default' });
  }
}