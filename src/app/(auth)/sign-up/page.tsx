'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'

import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { signUpSchema } from "@/schemas/signUpSchema"

import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"


function page() {
    const [username, setUsername] = useState('') // for username state
    const [usernameInfo, setUsernameInfo] = useState('Enter Username !') // for any info related to username available or not
    const [usernameAvail, setUsernameAvail] = useState(false) // flag shows username available or not
    const [isCheckingUsername, setIsCheckingUsername] = useState(false); // loading state for username 
    const [isSubmiting, setIsSubmiting] = useState(false) // loading state for form

    // debouncing state
    const debouncedUsername = useDebounceCallback(setUsername, 500)

    // toast hook
    const { toast } = useToast()

    // next router
    const router = useRouter()

    // form
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    // check to backend that username is exist or not | change state based on it
    useEffect(() => {
        const checkUsernameUnique = async () => {
            setIsCheckingUsername(true)
            setUsernameInfo('')

            try {
                console.log(username);
                const res = await axios.get(`/api/checkUsernameUnique?username=${username}`)
                let message = res.data.message
                console.log(res.data);

                setUsernameInfo(message)
                setUsernameAvail(res.data.success)
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                setUsernameInfo(
                    axiosError.response?.data.message || "can't use This Username !"
                )
                setUsernameAvail(false)
            } finally {
                setIsCheckingUsername(false)
            }

        }
        checkUsernameUnique()
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmiting(true)

        try {
            const res = await axios.post<ApiResponse>(`/api/sign-up`, data)
            if (res.data.success) {
                toast({
                    title: "Sign in successfully !",
                    description: res.data.message
                })
                router.replace(`/verify/${username}`)
            }
            else if (!res.data.success) {
                toast({
                    title: "Sign in Unsuccessfully !",
                    description: res.data.message
                })
            }

        } catch (error) {
            console.log("catch ! can't sign up ")
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message || "sign Up fail !"

            toast({
                title: "Sign Up Fail !",
                description: errorMessage
            })
        }
        finally {
            setIsSubmiting(false)
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-2">Welcome To FlickFuse</h1>
            <h2 className="text-lg text-center text-gray-600 mb-6">Create Your Account</h2>
    
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Username field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Username"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debouncedUsername(e.target.value);
                          }}
                          className="border-gray-300"
                        />
                      </FormControl>
                      {isCheckingUsername ? (
                        <div className="flex items-center mt-2 text-gray-500">
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Checking username...
                        </div>
                      ) : (
                        <p className={`mt-2 text-sm ${usernameAvail ? "text-green-600": "text-gray-500" }`}>{usernameInfo}</p>
                      )}
                      <FormDescription>This will be your unique username.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
    
                {/* Email field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          {...field}
                          className="border-gray-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
    
                {/* Password field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                          className="border-gray-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
    
                {/* Submit button */}
                <div className="mt-6">
                  <Button type="submit" >
                    {isSubmiting ? (
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Please Wait...
                      </div>
                    ) : 'Sign In'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      );
    };


export default page