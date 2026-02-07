import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Layout, LogIn, UserPlus, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md border-b border-white/10" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link to="/" className="flex items-center group cursor-pointer">
                        <img
                            src="/HireLensLogo.png"
                            alt="HireLens"
                            className="
                            w-auto
                            h-28 md:h-32 lg:h-36
                            object-cover
                            group-hover:scale-110
                            transition-transform duration-300
                        "
                        />
                    </Link>


                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Home</Link>
                        <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Features</a>
                        <a href="#about" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">About</a>

                        {isAuthenticated ? (
                            <Link to="/dashboard">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium border border-white/10 transition-all"
                                >
                                    Dashboard
                                </motion.button>
                            </Link>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/signin">
                                    <button className="text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center space-x-1">
                                        <LogIn className="w-4 h-4" />
                                        <span>Sign In</span>
                                    </button>
                                </Link>
                                <Link to="/signup">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center space-x-1 shadow-lg shadow-blue-500/20"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        <span>Get Started</span>
                                    </motion.button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-400 hover:text-white p-2"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 p-4 space-y-4"
                >
                    <Link to="/" className="block text-gray-300 hover:text-white text-base font-medium">Home</Link>
                    <a href="#features" className="block text-gray-300 hover:text-white text-base font-medium">Features</a>
                    <a href="#about" className="block text-gray-300 hover:text-white text-base font-medium">About</a>
                    <div className="pt-4 border-t border-white/10 flex flex-col space-y-4">
                        <Link to="/signin" className="text-gray-300 hover:text-white text-base font-medium">Sign In</Link>
                        <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-base font-medium text-center">Get Started</Link>
                    </div>
                </motion.div>
            )}
        </nav>
    );
}
