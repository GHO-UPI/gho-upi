'use client'

import './globals.css';
import axios from 'axios';
import * as React from 'react'
import { useState, useEffect } from 'react';
import { useAccount, useContractWrite, useContractRead, useWaitForTransaction } from 'wagmi'
import Image from 'next/image';
import RazorpayButton from '@/components/ui/razorpay';
import CheckoutButton from '@/components/ui/checkout';
import GhoTokenABI from '.././GhoTokenABI.json'
import { ethers } from 'ethers';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"



const ghoTokenAddress = "0x7c6D6B74733C0b2cBa4993d80ab1574cca20fEd9";


let SuppliedToken = 0;

function RepayModal({ maxAmount, onClose, onRepay }) {
  const [inputAmount, setInputAmount] = useState(0);

  const handleChange = (e) => setInputAmount(Math.max(0, Math.min(maxAmount*0.012, Number(e.target.value))));

  const handleSubmit = () => {
    const ghoAmount = inputAmount; // Calculate the GHO amount to be repaid
    onRepay(ghoAmount); // Pass the calculated GHO amount
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Repay Tokens</h2>
        <div className="input-container">
          <input
            type="number"
            value={inputAmount}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={inputAmount <= 0 || inputAmount > maxAmount}
          className="repay-button"
        >
          Repay
        </button>
      </div>
    </div>
  );
}

function SupplyModal({ maxAmount, onClose, onSupply }) {
  const [inputAmount, setInputAmount] = useState(0);

  const handleChange = (e) => setInputAmount(Math.max(0, Math.min(maxAmount, Number(e.target.value))));

  const handleSubmit = () => {
    const ghoAmount = inputAmount * 0.012; // Calculate the GHO amount
    onSupply(ghoAmount); // Pass the calculated GHO amount
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Supply Tokens</h2>
        <div className="input-container">
  
          <input
            type="number"
            value={inputAmount}
            onChange={handleChange}
            className="input-field"
          />
        
        </div>
        <button
          onClick={handleSubmit}
          disabled={inputAmount <= 0 || inputAmount > maxAmount}
          className="supply-button"
        >
         Supply
        </button>
      </div>
    </div>
  );
}



function Page() 
{

  const { address } = useAccount();
  const { write: mintGhoToken } = useContractWrite({
    address: ghoTokenAddress,
    abi: GhoTokenABI,
    functionName: 'mint',
    args: [address, ethers.parseUnits('10', 18)], // Mint 10 GHO tokens
  });
  const { write: burnGhoToken } = useContractWrite({
    address: ghoTokenAddress,
    abi: GhoTokenABI,
    functionName: 'burn',
    args: [ethers.parseUnits('1.26', 18)], // Burn 10 GHO tokens
  });
  const { data: facilitatorBucketData } = useContractRead({
    address: ghoTokenAddress,
    abi: GhoTokenABI,
    functionName: 'getFacilitatorBucket',
    args: [address], // User's wallet address
    watch: true, // Optional: set to true to keep data updated
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showRepayModal, setShowRepayModal] = useState(false);

  useEffect(() => {
    if (!address) return;

    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:3001/payments');
        if (response.data && response.data.items) {
          const total = response.data.items.reduce((sum, item) => sum + item.amount, 0);
          setTotalAmount(total / 100); // Convert amount from paise to rupees
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
  }, [address]);

  const handleSupply = async (ghoAmount) => {
    SuppliedToken += ghoAmount;
    setShowModal(false);

    if (!address) {
      console.error('Wallet not connected');
      return;
    }

    try {
      const tx = await mintGhoToken({
        args: [address, ethers.parseUnits(ghoAmount.toString(), 18)]
      });
      await tx.wait();
      console.log(`${ghoAmount} GHO tokens minted to`, address);
    } catch (error) {
      console.error('Error minting GHO tokens:', error);
    }
  };

  const handleBorrowClick = async () => {
    if (!address) {
      console.error('Wallet not connected');
      return;
    }

    try {
      const tx = await mintGhoToken();
      await tx.wait();
      console.log('10 GHO tokens minted to', address);
    } catch (error) {
      console.error('Error minting GHO tokens:', error);
    }
  };

  const handleRepay = async (ghoAmount) => {
    // Logic to repay GHO tokens
    if (!address) {
      console.error('Wallet not connected');
      return;
    }

    try {
      const tx = await burnGhoToken({
        args: [ethers.parseUnits(ghoAmount.toString(), 18)]
      });
      await tx.wait();
      console.log(`${ghoAmount} GHO tokens burned from`, address);
    } catch (error) {
      console.error('Error burning GHO tokens:', error);
    }

    setShowRepayModal(false);
  };

  const suppliedTokenAmount = facilitatorBucketData 
    ? parseFloat(ethers.formatUnits(facilitatorBucketData[1], 18)) 
    : 0; 

  return (
    <div>
      {!address ? (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <img
            src="https://i.ibb.co/B33GSr1/logo-removebg-preview.png"
            alt="GHO"
            className="mt-[-20vh]" width={300}
          />
          <p className="font-bold text-center text-2xl mt-4">Connect your wallet to proceed</p>
          <p className="text-center text-xl mt-4">Avail our UPI to GHO token Borrowing services</p>
        </div>
      ) : (
        
        <div style={{ padding: '200px', display: 'flex', justifyContent: 'space-between' }} className="overflow-y-auto max-h-[94vh] nft-scroll">
      
          {/* Left side */}
  
          <div style={{ width: '50%' }}> 
          <Card>
                <CardHeader>
                  <CardTitle className="text-xl">INR Token Balance</CardTitle>
                  {/* <CardDescription className="pt-2">
                    <Badge variant="outline" className="rounded-sm">Borrow power used 99%</Badge>
                  </CardDescription> */}
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[175px]">Asset</TableHead>
                        <TableHead className="text-center w-[170px]">Available</TableHead>
                      
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3 mt-2">
                            <Avatar> 
                              <AvatarImage src="https://i.pinimg.com/originals/95/d3/63/95d363ceee293a0ed2398f293b536db1.png" alt="INR"/>
                              <AvatarFallback>INR</AvatarFallback>
                            </Avatar>
                            <Label>INR Token</Label>
                          </div>
                        </TableCell>
                        <TableCell className="text-center"> { (totalAmount - (suppliedTokenAmount/0.012)).toFixed(2) }
</TableCell>
                       
                        <TableCell className="text-right">
                        <Button onClick={() => setShowModal(true)}>Trade</Button>
      {showModal && (
        <SupplyModal
          maxAmount={totalAmount - SuppliedToken}
          onClose={() => setShowModal(false)}
          onSupply={handleSupply}
        />
      )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-xl">Buy INR Tokens</CardTitle>
              </CardHeader>
              <CardContent className='pl-16 pr-16'>
                <RazorpayButton/>
              </CardContent>
            </Card>
          </div>
          {/* Right side */}
          <div style={{ width: '50%', paddingLeft: '15px' }}>
            {/* Content for the right side */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">GHO Token Balance</CardTitle>
                  
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[175px]">Asset</TableHead>
                        <TableHead className="text-center w-[170px]">Debt</TableHead>
                       
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3 mt-2">
                            <Avatar> 
                              <AvatarImage src="https://app.aave.com/icons/tokens/gho.svg" alt="GHO"/>
                              <AvatarFallback>GHO</AvatarFallback>
                            </Avatar>
                            <Label>GHO</Label>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{ ((suppliedTokenAmount)).toFixed(2) }</TableCell>
                        
                        <TableCell className="text-right">
                        <Button onClick={() => setShowRepayModal(true)}>Return</Button>
    {showRepayModal && (
      <RepayModal
        maxAmount={suppliedTokenAmount / 0.012}
        onClose={() => setShowRepayModal(false)}
        onRepay={handleRepay}
      />
    )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-xl">Checkout</CardTitle>
              
              </CardHeader>
              <CardContent>
               <Button variant="destructive">Convert to FIAT</Button>
                             </CardContent>
            </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Page;
