import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  Zap,
  Shield,
  Cpu,
  Globe,
  Layout,
  ArrowRight,
  CheckCircle2,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function Home() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-blue-400" />,
      title: "Real-time Insights",
      description: "Get instant analytics and performance tracking for all your data streams."
    },
    {
      icon: <Shield className="w-6 h-6 text-violet-400" />,
      title: "Enterprise Security",
      description: "Bank-grade encryption and advanced security protocols to keep your data safe."
    },
    {
      icon: <Cpu className="w-6 h-6 text-indigo-400" />,
      title: "AI Integration",
      description: "Leverage state-of-the-art AI models to automate and optimize your workflows."
    },
    {
      icon: <Globe className="w-6 h-6 text-emerald-400" />,
      title: "Global Scalability",
      description: "Scale your infrastructure globally with our distributed cloud network."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] pointer-events-none opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] bg-violet-600 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
                <CheckCircle2 className="w-4 h-4" />
                <span>Now in Beta - v2.0 is live</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8">
                Empowering Intelligence <br />
                <span className="text-gradient">with HireLens</span>
              </h1>

              <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-12">
                HireLens is the next-generation platform for data professionals.
                Build, scale, and optimize your intelligence infrastructure with
                unprecedented speed and security.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center space-x-2 shadow-xl shadow-blue-500/20 transition-all"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <div className="px-8 py-4 glass hover:bg-white/10 rounded-xl font-semibold cursor-pointer transition-all">
                  Watch Demo
                </div>
              </div>

              {/* Stats/Social Proof */}
              <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto py-8 border-y border-white/5">
                {[
                  { label: "Active Users", value: "50k+" },
                  { label: "Data Points", value: "1.2B" },
                  { label: "Uptime", value: "99.99%" },
                  { label: "Enterprise", value: "200+" }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Precision-Engineered Features</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Everything you need to build and manage state-of-the-art intelligence
                systems, all in one cohesive platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl glass hover:border-white/20 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden p-12 lg:p-20 text-center border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
              <div className="relative z-10">
                <h2 className="text-3xl lg:text-5xl font-bold mb-8">Ready to transform your workflow?</h2>
                <p className="text-gray-400 mb-12 text-lg max-w-xl mx-auto">
                  Join thousands of teams already building the future with HireLens.
                  Start your journey today.
                </p>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-white text-black rounded-xl font-bold shadow-2xl hover:bg-gray-200 transition-colors"
                  >
                    Start Building Now
                  </motion.button>
                </Link>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent)] pointer-events-none" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-20 bg-black/50 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 lg:gap-8">
            <div className="col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-8">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <Layout className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">HireLens</span>
              </Link>
              <p className="text-gray-500 text-sm max-w-xs mb-8">
                Building the infrastructure for tomorrow's intelligence.
                Sourced by professionals, powered by innovation.
              </p>
              <div className="flex space-x-5">
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Github className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            <div className="col-span-1">
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-white cursor-pointer transition-colors">Features</li>
                <li className="hover:text-white cursor-pointer transition-colors">Solutions</li>
                <li className="hover:text-white cursor-pointer transition-colors">Pricing</li>
                <li className="hover:text-white cursor-pointer transition-colors">Updates</li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="text-white font-semibold mb-6">Resources</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-white cursor-pointer transition-colors">Documentation</li>
                <li className="hover:text-white cursor-pointer transition-colors">API Reference</li>
                <li className="hover:text-white cursor-pointer transition-colors">Guides</li>
                <li className="hover:text-white cursor-pointer transition-colors">Community</li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-white cursor-pointer transition-colors">About</li>
                <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
                <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-white cursor-pointer transition-colors">Privacy</li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="text-white font-semibold mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
                <li className="hover:text-white cursor-pointer transition-colors">Status</li>
              </ul>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs text-center md:text-left">
              © 2026 HireLens Inc. All rights reserved. Built with precision for the future.
            </p>
            <div className="flex space-x-6 text-xs text-gray-500">
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Cookie Settings</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
