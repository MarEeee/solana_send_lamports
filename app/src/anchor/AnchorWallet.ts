import { Wallet } from "@project-serum/anchor";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
const PRIVATE_PAYER = [131,180,15,11,181,146,197,164,2,233,78,151,246,219,144,158,228,9,243,86,48,129,44,92,189,121,74,57,38,57,2,21,167,107,103,212,198,208,72,175,69,40,166,148,150,196,80,83,61,54,175,148,61,92,200,251,63,143,56,246,134,191,235,204]

export default class AnchorWallet implements Wallet {
    constructor(readonly payer: Keypair) {}
    
    static local(): AnchorWallet {
        const payer = new Uint8Array(PRIVATE_PAYER);
        return new AnchorWallet(Keypair.fromSecretKey(payer))
    }

    async signTransaction(tx: Transaction): Promise<Transaction> {
        return (window as any).solana.signTransaction(this.payer);
    }
    
    async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
        return txs.map(t => (window as any).solana.signTransaction(this.payer));
    }

    get publicKey(): PublicKey {
        return this.payer.publicKey;
    }
}