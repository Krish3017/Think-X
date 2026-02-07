import React, { useState } from "react";
import { FaGithub, FaGoogle, FaLock, FaMicrosoft, FaUser } from "react-icons/fa";
import { HiEye, HiEyeOff, HiOutlineMail, HiUser } from "react-icons/hi";
import { MdWorkOutline } from "react-icons/md";
import { GradientBars } from "@/components/ui/GradientBars";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; agree?: string; role?: string }>({});
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { checkAuth } = useAuth();

    function validate() {
        const e: typeof errors = {};
        if (!name) e.name = "Name is required";
        else if (name.length < 2) e.name = "Name must be at least 2 characters";
        if (!email) e.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,10}$/.test(email))
            e.email = "Enter a valid email";
        if (!password) e.password = "Password is required";
        else if (password.length < 8)
            e.password = "Password must be at least 8 characters";
        if (!role) e.role = "Role is required";
        if (!agree) e.agree = "You must accept Terms & Privacy";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            console.log('SignUp: Starting registration...');
            const response = await apiService.register({ name, email, password, role });
            console.log('SignUp: Registration successful:', response);

            // Check if backend returns token directly after registration
            if (response.accessToken && response.user) {
                console.log('SignUp: Storing token and user data');
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('user', JSON.stringify(response.user));

                // Update auth context
                await checkAuth();

                // Navigate directly to dashboard for all roles
                navigate("/student/dashboard");
            } else {
                // If no token returned, redirect to signin
                console.log('SignUp: No token returned, redirecting to signin');
                navigate("/signin");
            }
        } catch (error: any) {
            console.error('SignUp: Registration failed:', error);
            setErrors({ email: error.message || 'Registration failed' });
        } finally {
            setLoading(false);
        }
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
                    Create Account
                </h1>
                <p className="text-gray-400 text-center text-sm mt-1">
                    Join DataForge today
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-3 mt-5">
                        {/* Name */}
                        <div className={`bg-[#0f0f0f] border rounded-lg px-3 h-10 flex items-center text-gray-300 focus-within:border-white transition ${errors.name ? "border-red-500" : "border-white/15"}`}>
                            <span className="mr-2 text-gray-400">
                                <HiUser />
                            </span>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (errors.name) {
                                        setErrors((prev) => ({ ...prev, name: undefined }));
                                    }
                                }}
                                className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-400"
                            />
                        </div>
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                        )}

                        {/* Email */}
                        <div className={`bg-[#0f0f0f] border rounded-lg px-3 h-10 flex items-center text-gray-300 focus-within:border-white transition ${errors.email ? "border-red-500" : "border-white/15"}`}>
                            <span className="mr-2 text-gray-400">
                                <HiOutlineMail />
                            </span>
                            <input
                                type="email"
                                name="email"
                                placeholder="johndoe26@gmail.com"
                                autoComplete="email"
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
                                autoComplete="new-password"
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
                    {/* Terms */}
                    <div className="text-xs text-gray-400 mt-4 flex gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={agree}
                                onChange={(e) => {
                                    setAgree(e.target.checked);
                                    if (errors.agree) {
                                        setErrors((prev) => ({ ...prev, agree: undefined }));
                                    }
                                }}
                                className="accent-blue-500"
                            />
                            I agree to the
                        </label>
                        <span className="text-white hover:text-blue-500 cursor-pointer">
                            <a href="/terms">Terms & Conditions</a>
                        </span>
                    </div>
                    {errors.agree && (
                        <p className="text-red-500 text-xs mt-1">{errors.agree}</p>
                    )}

                    {/* Signup Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full h-10 mt-5 rounded-lg text-white text-sm font-medium bg-[#0f0f10] border border-white/15 overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="relative z-10">
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </span>
                        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#38BDF8]/60 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full duration-[1600ms] ease-[cubic-bezier(0.45,0,0.2,1)] transition blur-sm" />
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-4">
                    <div className="h-[1px] bg-white/10 flex-1" />
                    <div className="text-center text-xs text-gray-400 leading-snug">
                        Or SignUp With
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
                    Already have an account?{" "}
                    <Link to="/signin">
                        <span className="text-white cursor-pointer hover:underline">
                            Sign in
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