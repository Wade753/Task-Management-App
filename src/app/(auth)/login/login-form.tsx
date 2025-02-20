"use client";

import * as React from "react";
import { useState, useEffect } from "react"; // Adaugă useState și useEffect
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { startTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Adaugă useSearchParams
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

const LoginFormContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (success) {
      setSuccessMessage("Password successfully changed!");
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000); // Ascunde mesajul după 5 secunde

      return () => clearTimeout(timer); // Curăță timer-ul când componenta este demontată
    }
  }, [success]);

  function onSubmit(data: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const res = await signIn("credentials", data);

      console.log("res => ", res);

      // if (res?.error) {
      //   form.setError("email", {
      //     type: "manual",
      //     message: "Invalid email or password",
      //   });
      // } else {
      //   router.push("/dashboard");
      // }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        {/* Mesaj de succes */}
        {successMessage && (
          <div className="mb-4 rounded-md border border-green-400 bg-green-100 px-4 py-2 text-green-700">
            {successMessage}
          </div>
        )}
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Sign in to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-sm text-gray-500">
          Don&apos;t have an account?
          <Link href="/register" className="ml-1 text-blue-500">
            Register
          </Link>
        </CardFooter>
        <CardFooter className="text-sm text-gray-500">
          Forgot Password?
          <Link href="/forgot-password" className="ml-1 text-blue-500">
            Reset Password
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
const LoginForm = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <LoginFormContent />
    </React.Suspense>
  );
};

export { LoginForm };
