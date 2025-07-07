// src/components/ui/Footers.tsx
import React from 'react';
import { Bot, Brain, Code, Cpu, Palette, Zap } from 'lucide-react';

export const PoweredByFooter: React.FC = () => {
    const technologies = [
        {
            name: 'React TS',
            icon: <Code className="w-5 h-5" />,
            color: 'text-[#61DAFB]', // React's signature cyan
            bgColor: 'bg-[#61DAFB]/10 border-[#61DAFB]/20',
            hoverColor: 'hover:bg-[#61DAFB]/20 hover:border-[#61DAFB]/40'
        },
        {
            name: 'Tailwind',
            icon: <Palette className="w-5 h-5" />,
            color: 'text-[#06B6D4]', // Tailwind's teal
            bgColor: 'bg-[#06B6D4]/10 border-[#06B6D4]/20',
            hoverColor: 'hover:bg-[#06B6D4]/20 hover:border-[#06B6D4]/40'
        },
        {
            name: 'LangGraph',
            icon: <Zap className="w-5 h-5" />,
            color: 'text-[#FF6B35]', // Vibrant orange
            bgColor: 'bg-[#FF6B35]/10 border-[#FF6B35]/20',
            hoverColor: 'hover:bg-[#FF6B35]/20 hover:border-[#FF6B35]/40'
        },
        {
            name: 'LangChain',
            icon: <Brain className="w-5 h-5" />,
            color: 'text-[#1C64F2]', // Professional blue
            bgColor: 'bg-[#1C64F2]/10 border-[#1C64F2]/20',
            hoverColor: 'hover:bg-[#1C64F2]/20 hover:border-[#1C64F2]/40'
        },
        {
            name: 'OpenAI',
            icon: <Cpu className="w-5 h-5" />,
            color: 'text-[#10A37F]', // OpenAI's signature green
            bgColor: 'bg-[#10A37F]/10 border-[#10A37F]/20',
            hoverColor: 'hover:bg-[#10A37F]/20 hover:border-[#10A37F]/40'
        },
        {
            name: 'Groq',
            icon: <Bot className="w-5 h-5" />,
            color: 'text-[#F97316]', // Distinctive orange
            bgColor: 'bg-[#F97316]/10 border-[#F97316]/20',
            hoverColor: 'hover:bg-[#F97316]/20 hover:border-[#F97316]/40'
        }
    ];

    return (
        <footer className="bg-gradient-to-r from-slate-50 to-gray-100 dark:from-gray-900 dark:to-slate-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Powered By
                        </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
                        Cutting-edge technologies working together
                    </p>

                    {/* Technologies Grid */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {technologies.map((tech, index) => (
                            <div
                                key={index}
                                className={`group flex items-center space-x-3 px-5 py-3 rounded-xl ${tech.bgColor} border transition-all duration-300 ${tech.hoverColor} hover:scale-105 hover:shadow-lg cursor-pointer`}
                            >
                                <div className={`${tech.color} transition-transform duration-300 group-hover:scale-110`}>
                                    {tech.icon}
                                </div>
                                <span className={`font-semibold text-sm ${tech.color} transition-all duration-300`}>
                                    {tech.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Feature Highlights */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
                        <div className="flex items-center justify-center space-x-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">AI-Powered Planning</h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Advanced language models for intelligent recommendations</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center space-x-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Lightning Fast</h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Modern web stack for optimal performance</p>
                            </div>
                        </div>
                    </div>

                    {/* Copyright with enhanced styling */}
                    <div className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-pulse"></div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                © {new Date().getFullYear()} <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold">EasyAI Itinerary</span>
                            </p>
                            <div className="w-2 h-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Crafted with <span className="text-red-500 animate-pulse">❤️</span> for travelers worldwide
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};