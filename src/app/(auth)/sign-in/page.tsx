'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import Link from "next/link";

const Login = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        },
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        console.log(data, "is here");

        const res = await signIn('credentials', {
            identifier: data.identifier,
            password: data.password,
            redirect: false
        });
        console.log(res, "is her");

        if (res?.error) {
            toast({
                title: "Login Failed",
                description: res.error,
                variant: "destructive",
            });
            setIsSubmitting(false);
        } else if (res?.url) {
            router.replace('/dashboard');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-center mb-2">Welcome To FlickFuse</h1>
                <h2 className="text-lg text-center text-gray-600 mb-6">Log In to Your Account</h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        {/* Email field */}
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Or Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Email Or Username"
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
                        <div className="mt-6 flex flex-col justify-center items-center gap-4 ">
                            <Button
                                type="submit"
                                className="w-full bg-black hover:bg-gray-600"
                            >
                                {isSubmitting ? (
                                    <div className="flex justify-center items-center">
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Please Wait...
                                    </div>
                                ) : (
                                    'Log In'
                                )}
                            </Button>
                            <div className="flex gap-2">
                                <p>Don't have Account ?</p>
                                <Link href={`/sign-up`}>
                                    <b>Sign Up</b>
                                </Link>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default Login;
