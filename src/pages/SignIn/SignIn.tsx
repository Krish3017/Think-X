import React, { useState } from "react";
import { FaGithub, FaGoogle, FaLock, FaMicrosoft, FaUser } from "react-icons/fa";
import { HiEye, HiEyeOff, HiOutlineMail } from "react-icons/hi";
import { MdWorkOutline } from "react-icons/md";
import { GradientBars } from "@/components/ui/GradientBars";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestGuard } from "@/hooks/useAuthGuard";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; role?: string }>({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { loading: authLoading } = useGuestGuard();

    function validate() {
        const e: typeof errors = {};
        if (!email) e.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,10}$/.test(email))
            e.email = "Enter a valid email";
        if (!password) e.password = "Password is required";
        else if (password.length < 8)
            e.password = "Password must be at least 8 characters";
        if (!role) e.role = "Role is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await login(email, password, role);
            navigate("/dashboard");
        } catch (error: any) {
            setErrors({ password: error.message || 'Login failed' });
        } finally {
            setLoading(false);
        }
    }

    if (authLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center relative">
            <GradientBars />
            <div className="bg-[#0c0c0c] border border-white/10 rounded-xl p-6 w-[360px] shadow-2xl z-10 relative">
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-[#141414] border border-white/10 flex items-center justify-center">
                        <span className="text-white/80 text-2xl">
                            <FaUser />
                        </span>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-white text-center">
                    Welcome Back
                </h1>
                <p className="text-gray-400 text-center text-sm mt-1">
                    Sign in to continue
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-3 mt-5">
                        {/* Email */}
                        <div className={`bg-[#0f0f0f] border rounded-lg px-3 h-10 flex items-center text-gray-300 focus-within:border-white transition ${errors.email ? "border-red-500" : "border-white/15"}`}>
                            <span className="mr-2 text-gray-400">
                                <HiOutlineMail />
                            </span>
                            <input
                                type="email"
                                name="email"
                                autoComplete="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) {
                                        setErrors((prev) => ({ ...prev, email: undefined }));
                                    }
                                }}
                                className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-400"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}

                        {/* Password */}
                        <div className={`bg-[#0f0f0f] border rounded-lg px-3 h-10 flex items-center text-gray-300 focus-within:border-white transition ${errors.password ? "border-red-500" : "border-white/15"}`}>
                            <span className="mr-2 text-gray-400">
                                <FaLock />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) {
                                        setErrors((prev) => ({ ...prev, password: undefined }));
                                    }
                                }}
                                className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-400"
                            />
                            <span className="text-gray-400 cursor-pointer ml-2" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <HiEyeOff /> : <HiEye />}
                            </span>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}

                        {/* Role */}
                        <div className={`bg-[#0f0f0f] border rounded-lg px-3 h-10 flex items-center text-gray-300 focus-within:border-white transition ${errors.role ? "border-red-500" : "border-white/15"}`}>
                            <span className="mr-2 text-gray-400">
                                <MdWorkOutline />
                            </span>
                            <select
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    if (errors.role) {
                                        setErrors((prev) => ({ ...prev, role: undefined }));
                                    }
                                }}
                                className="bg-transparent outline-none w-full text-sm text-white cursor-pointer"
                            >
                                <option value="student" className="bg-[#0f0f0f]">Student</option>
                                <option value="admin" className="bg-[#0f0f0f]">Admin</option>
                                <option value="placement_cell" className="bg-[#0f0f0f]">Placement Cell</option>
                            </select>
                        </div>
                        {errors.role && (
                            <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                        )}
                    </div>

                    {/* Options */}
                    <div className="flex justify-between items-center text-xs text-gray-400 mt-5">
                        <label className="flex items-center gap-1 cursor-pointer">
                            <input type="checkbox" className="accent-blue-500" />
                            Remember me
                        </label>
                        <button type="button" className="hover:text-white">
                            Forgot password?
                        </button>
                    </div>

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="relative group w-full h-10 rounded-lg mt-5 text-white bg-[#0f0f10] text-sm font-medium border-white/15 border transition-all overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="relative z-10">
                            {loading ? 'Signing In...' : 'Sign In'}
                        </span>
                        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#38BDF8]/60 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full duration-[1600ms] ease-[cubic-bezier(0.45,0,0.2,1)] transition blur-sm" />
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-4">
                    <div className="h-[1px] bg-white/10 flex-1" />
                    <div className="text-center text-xs text-gray-400 leading-snug">
                        Or SignIn With
                    </div>
                    <div className="h-[1px] bg-white/10 flex-1" />
                </div>

                {/* Social Buttons */}
                <div className="flex justify-center gap-4">
                    <GlossButton><FaGoogle /></GlossButton>
                    <GlossButton><FaGithub /></GlossButton>
                    <GlossButton><FaMicrosoft /></GlossButton>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-400 text-xs mt-6">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup">
                        <span className="text-white cursor-pointer hover:underline">
                            Sign up
                        </span>
                    </Link>
                </p>
            </div>
        </div>
    );
}

function GlossButton({ children }: { children: React.ReactNode }) {
    return (
        <button className="group relative w-16 h-10 text-lg text-white bg-[#0f0f0f] border border-white/15 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-300">
            <span className="relative z-10 opacity-80 group-hover:opacity-100 transition">
                {children}
            </span>
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#38BDF8]/60 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full duration-[1600ms] ease-[cubic-bezier(0.45,0,0.2,1)] transition blur-sm" />
        </button>
    );
}