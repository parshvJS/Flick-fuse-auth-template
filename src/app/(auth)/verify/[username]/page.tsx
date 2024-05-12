'use client'
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'


import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function Page() {
  const [isSubmiting, setIsSubmiting] = useState(false)

  const router = useRouter()
  const params = useParams<{ username: string }>()
  const { toast } = useToast()

  // form
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: ""
    }
  })

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      setIsSubmiting(true)
      const res = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code
      })
      if (!res.data.success) {
        toast({
          title: "Can't Verify Your Account!",
          description: res.data.message,
          variant: "destructive"
          // 
        })
      }

      toast({
        title: "Succesfully Verify Your Account!",
        description: res.data.message
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message
      toast({
        title: "Can't Verify Your Account!",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsSubmiting(false)
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-2">Welcome To FlickFuse</h1>
        <h2 className="text-lg text-center text-gray-600 mb-6">Enter Your Verification Code</h2>
        <p className="text-center text-gray-600 mb-6">
          Please check your email for the verification code weve sent you.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Verification code field */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Code"
                      {...field}
                      className="border-gray-300 text-center"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit button */}
            <div className="mt-6">
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-600"
              >
                {isSubmiting ? (
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Verifying...
                  </div>
                ) : (
                  'Verify Code'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Page