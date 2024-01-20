'use client'

import axios from 'axios';
import * as React from 'react'
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi'
import Image from 'next/image';
import RazorpayButton from '@/components/ui/razorpay';
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


function Page() {
  const { address } = useAccount();
  const [totalAmount, setTotalAmount] = useState(0);

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
  
  

  return (
    <div>
      {!address ? (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <img
            src="gho.jpeg"
            alt="GHO"
            className="mt-[-20vh]"
          />
          <p className="font-bold text-center text-2xl mt-4">Please, connect your wallet</p>
          <p className="text-center text-xl mt-4">Please connect your wallet to see your NFT collaterals and borrowings</p>
        </div>
      ) : (
        <div style={{ padding: '200px', display: 'flex', justifyContent: 'space-between' }} className="overflow-y-auto max-h-[94vh] nft-scroll">
          {/* Left side */}
          <div style={{ width: '50%' }}> 
          <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-xl">Assets to Supply</CardTitle>
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
                        <TableHead className="text-center w-[170px]">APY</TableHead>
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
                        <TableCell className="text-center"> {totalAmount.toFixed(2)}</TableCell>
                        <TableCell className="text-center">6.66 %</TableCell>
                        <TableCell className="text-right">
                          <Button>Borrow</Button>
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
                  <CardTitle className="text-xl">Your borrows</CardTitle>
                  <CardDescription className="pt-2">
                    <Badge variant="outline" className="rounded-sm">Borrow power used 99%</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[175px]">Asset</TableHead>
                        <TableHead className="text-center w-[170px]">Debt</TableHead>
                        <TableHead className="text-center w-[170px]">APY</TableHead>
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
                        <TableCell className="text-center">0.1134539</TableCell>
                        <TableCell className="text-center">2.02 %</TableCell>
                        <TableCell className="text-right">
                          <Button>Repay</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-xl">Assets to borrow</CardTitle>
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
                        <TableHead className="text-center w-[170px]">APY</TableHead>
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
                        <TableCell className="text-center">633.60</TableCell>
                        <TableCell className="text-center">2.02 %</TableCell>
                        <TableCell className="text-right">
                          <Button>Borrow</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
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
