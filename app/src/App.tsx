import './App.css';
import React, { useEffect, useMemo, useState } from 'react'
import {
    Connection,
    SystemProgram,
    Transaction,
    clusterApiUrl,
    TransactionInstruction,
    PublicKey,
    RpcResponseAndContext,
    SignatureResult
} from '@solana/web3.js';
import * as lo from '@solana/buffer-layout';
import BN from "bn.js"

import * as anchor from '@project-serum/anchor';
import { Idl, Program } from '@project-serum/anchor';
import AnchorWallet from './anchor/AnchorWallet';
import idl from './anchor/crypton_test.json'

import Header from './components/Header';
import Main from './components/Main'
import Wallet from '@project-serum/sol-wallet-adapter';
import { Buffer } from 'buffer'
import pool from './poolWallet/poolWallet.json'

function App() {
    const network = clusterApiUrl('devnet');     
    let providerUrl = process.env.REACT_APP_PROVIDER_URL;
    const provider = new anchor.AnchorProvider(new Connection(network), AnchorWallet.local(), { skipPreflight: false })
    anchor.setProvider(provider)
    const anchorProgram = new Program(idl as Idl, String(process.env.REACT_APP_PROGRAM_ID), provider);
    const poolWalletPubkey = new PublicKey(String(process.env.REACT_APP_POOL_WALLET))

    
    const connection = useMemo(() => new Connection(network), [network]);   
    const wallet = useMemo(() => new Wallet(providerUrl, network), [network, providerUrl]);
    
    const [balance, setBalance] = useState<number>(0)
    const [transactionConfirm, setTransactionConfirm] = useState<RpcResponseAndContext<SignatureResult>>()
    const [isConnection, setConnection] = useState<boolean>(false)
    const [isOwner, setOwner] = useState<boolean>(false)
    const [isLoading, setLoading] = useState<boolean>(false)

    wallet.on('connect', publicKey => {                   
        setConnection(true)
        if(JSON.stringify(wallet.publicKey) === JSON.stringify(new PublicKey(String(process.env.REACT_APP_OWNER)))){
            setOwner(true)
        }
        console.log('Connected to ' + publicKey.toBase58())
    });
    wallet.on('disconnect', () => {                        
        setConnection(false)
        setOwner(false)
        console.log('Disconnected')
    }); 

    const prepareTransaction = async(from: PublicKey, to: PublicKey, lamportsAmount: number): Promise<Transaction> => {
        let tx = new Transaction()        
        tx.feePayer = from
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
        const fee = await connection.getFeeForMessage(tx.compileMessage(), 'confirmed')
        const amount = lamportsAmount * Number(process.env.REACT_APP_LAMPORTS) - fee.value
        console.log('amount', amount)

        const ix = await anchorProgram.instruction.transfer(new BN(amount), {
            accounts: {
                from, to,
              systemProgram: anchor.web3.SystemProgram.programId
            },} as any);
        
        tx.add(ix)

      
        return tx
    }

    const sendDonation = async(lamportsAmount: number) => {
        // withdrawDonations()
        console.log("sendDonation called")
        
        if (wallet.publicKey) {
            setLoading(true)
            const tx = await prepareTransaction(wallet.publicKey, poolWalletPubkey, lamportsAmount)
            let signed = await wallet.signTransaction(tx)
            await broadcastSignedTransaction(signed)
        }
    }

    const withdrawDonations = async() => {
        console.log("withdrawDonations called")
        if (wallet.publicKey) {
            setLoading(true)
            const tx = await prepareTransaction(poolWalletPubkey, wallet.publicKey, balance)
            await broadcastSignedWithdrawTransaction(tx)
        }
    }
    const broadcastSignedWithdrawTransaction = async(tx:any) => { 
        let signature = await anchor.web3.sendAndConfirmTransaction(
            connection,
            tx,
            [anchor.web3.Keypair.fromSecretKey(new Uint8Array(pool as Array<number>))]
        )
        console.log("Submitted transaction " + signature + ", awaiting confirmation")
        const response = await connection.confirmTransaction(signature)
        console.log("Transaction " + signature + " confirmed")
        setTransactionConfirm(response)
        setLoading(false)
    }

    const broadcastSignedTransaction = async(signed:any) => {
        let signature = await anchor.web3.sendAndConfirmRawTransaction(connection, signed.serialize())
        console.log("Submitted transaction " + signature + ", awaiting confirmation")
        const response = await connection.confirmTransaction(signature)
        console.log("Transaction " + signature + " confirmed")
        setTransactionConfirm(response)
        setLoading(false)
    }
    


    const onClickHandler = async() => {
        if(wallet.connected) {
            await wallet.disconnect();            
            sessionStorage.clear()
        } else {
            await wallet.connect();
        }
        
    }

    useEffect(() => {        
        const getBalance = async() => {         
            if(!wallet.publicKey) return 
            let responseBalance:number
            if(isOwner) {
                responseBalance = await connection.getBalance(new PublicKey(String(process.env.REACT_APP_POOL_WALLET)))
            } else {
                responseBalance = await connection.getBalance(wallet.publicKey)
            }
            setBalance(responseBalance/1000000000)
        }
        getBalance()
       
    },[wallet.connected, transactionConfirm])


    
    return (
        <div className="App">
            <Header onClick = {onClickHandler} wallet={wallet}/>
            <Main
                onClick={onClickHandler}
                wallet={wallet}
                balance={balance}
                isOwner={isOwner}
                sendDonation={sendDonation}
                withdrawDonations={withdrawDonations}
                isLoading={isLoading}
            />
        </div>
    );
}

export default App;
