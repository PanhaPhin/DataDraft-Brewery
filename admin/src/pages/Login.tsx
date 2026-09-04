import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

import logo from "../images/2026-08-30 11.52.33.jpg";
import background1 from "../images/allbeer.jpg";
import background2 from "../images/2026-08-30 12.16.04.jpg";
import background3 from "../images/2026-08-30 12.15.54.jpg";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/lib/validation";
import { motion, AnimatePresence } from "motion/react";
import useAuthStore from "@/store/useAuthStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FormData = z.infer<typeof loginSchema>;

const backgrounds = [background1, background2, background3];

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentBackground, setCurrentBackground] = useState(0);

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Change background every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground((prev) => (prev + 1) % backgrounds.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Real login: calls the API through the auth store,
  // only navigates on success, shows an error otherwise
  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      await login({ email: data.email, password: data.password });

      toast.success("Welcome to the dashboard");
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to login:", error);
      toast.error("Invalid email or password");
      // stays on the login page — does NOT navigate
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* ================= BACKGROUND ================= */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentBackground}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgrounds[currentBackground]})`,
          }}
        />
      </AnimatePresence>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* ================= LOGIN ================= */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="w-full max-w-md"
        >
          <Card className="w-full rounded-2xl border border-white/30 bg-white/95 shadow-2xl backdrop-blur-md">
            {/* ================= HEADER ================= */}
            <CardHeader className="space-y-3 text-center">
              <CardTitle className="text-3xl font-bold text-gray-800">
                Admin Dashboard
              </CardTitle>

              <CardDescription className="text-gray-500">
                Enter your credentials to sign in
              </CardDescription>
            </CardHeader>

            {/* ================= CONTENT ================= */}
            <CardContent>
              {/* Logo */}
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.7,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                }}
                className="mb-6 flex justify-center"
              >
                <img
                  src={logo}
                  alt="Admin Logo"
                  className="h-24 w-24 rounded-full object-cover shadow-lg"
                />
              </motion.div>

              {/* Form */}
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    {...form.register("email")}
                  />

                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>

                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    {...form.register("password")}
                  />

                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Login Button */}
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>

              {/* Register Link */}
              <p className="mt-5 text-center text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-gray-800 underline-offset-4 hover:underline"
                >
                  Register
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}