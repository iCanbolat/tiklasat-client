import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import LoginImage from "../../../public/signup-image.jpg";
import LoginForm from "./-components/login-form";

export const Route = createFileRoute("/login/")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <main className="w-full h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-2xl p-8 bg-white rounded-md shadow-lg">
        <h1 className="text-2xl text-center mb-3">Admin Dashboard</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative aspect-none sm:aspect-square">
            <img src={LoginImage} alt="Login Image"  />
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
