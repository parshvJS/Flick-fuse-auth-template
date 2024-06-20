import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { MoveRight } from 'lucide-react'
import { DialogHeader } from '../ui/dialog'
import { ScrollArea } from '../ui/scroll-area'
import { Button } from '../ui/button'

interface AnalyzedCardProps {
    title: string;
    result: string[];
    icon: React.ReactNode;
}

const AnalyzedCard: React.FC<AnalyzedCardProps> = ({ title, result, icon }) => {
    return (
        <div className='w-full'>
            {result &&
                <Card>
                    <CardHeader>
                        <div className='flex gap-4'>
                            {icon}
                            <p className='font-bold'>{title}</p>
                        </div>
                    </CardHeader>
                    <CardContent className='flex justify-start items-start  flex-col'>
                        <ol className='ml-3'>
                            {result.slice(0, 8).map((q: string, index) => (
                                <li className='flex gap-4' key={index}>
                                    <p>{index + 1}</p>
                                    <p>{q}</p>
                                </li>
                            ))}
                        </ol>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className='flex gap-4' variant={"ghost"}>
                                    <p>See All {result.length}</p>
                                    <MoveRight />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        <div className='flex gap-4 items-center'>
                                            {icon}
                                            <p className='font-bold'>{title}</p>
                                        </div>
                                    </DialogTitle>
                                    <DialogDescription className='inset-0 z-20'>
                                        <ScrollArea className='h-[300px]'>
                                            <ol className='ml-3'>
                                                {result.map((q: string, index) => (
                                                    <li className='flex gap-4' key={index}>
                                                        <p>{index + 1}</p>
                                                        <p>{q}</p>
                                                    </li>
                                                ))}
                                            </ol>
                                        </ScrollArea>
                                    </DialogDescription>
                                </DialogHeader>
                              
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            }
        </div>
    )
}

export default AnalyzedCard
