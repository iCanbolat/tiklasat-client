"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { KeyRound, Loader2, User } from "lucide-react";

import { signinSchema } from "./validation-schema";
import { Link } from "@tanstack/react-router";
import FormSuccess from "./form-success";
import FormError from "./form-error";

const LoginForm = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const formLogin = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmitLogin(values: z.infer<typeof signinSchema>) {}

  return (
    <Form {...formLogin}>
      <form
        onSubmit={formLogin.handleSubmit(onSubmitLogin)}
        className="h-full m-2"
      >
        <FormSuccess message={successMessage} />
        <FormError message={errorMessage} />
        {!(successMessage || errorMessage) && <div className="p-4"></div>}

        <div className="h-[51%] flex flex-col justify-center space-y-1.5">
          <div className="flex flex-col h-14">
            <FormField
              control={formLogin.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      left={<User strokeWidth={2.2} />}
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col h-14">
            <FormField
              control={formLogin.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      left={<KeyRound strokeWidth={2.75} />}
                      type="password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-col text-center space-y-2">
          <div>
            <Link to="/" className="hover:underline text-sm">
              Forgot your password?
            </Link>
          </div>
          <Button
            type="submit"
            disabled={formLogin.formState.isSubmitting}
            size={"lg"}
            className="rounded-full"
          >
            {formLogin.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
