"use client";

import Link from "next/link";
import { signup } from "@/lib/actions/signup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useActionState, useState } from "react";

const initialState = {
  validationErrors: {
    errors: [],
  },
};

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, initialState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Card className="w-md">
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>Enter your email below to sign up</CardDescription>
        <p className="text-sm text-destructive">
          {state?.validationErrors?.errors}
        </p>
        <CardAction>
          <Button asChild variant="link">
            <Link href="/login">Login</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="flex flex-col gap-6 mb-6">
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="email">Email</Label>
                <p className="text-sm text-destructive">
                  {state?.validationErrors?.properties?.email?.errors}
                </p>
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="password">Password</Label>
                <p className="text-sm text-destructive">
                  {state?.validationErrors?.properties?.password?.errors}
                </p>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={pending}>
              Sign up
            </Button>
            <Button variant="outline" className="w-full">
              Sign up with Google
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
