// src/components/ui/Loaders.tsx
import React, { useEffect, useState } from 'react';
import { MapPin, Plane, Calendar, Mail, Globe, Heart, Sparkles } from 'lucide-react';

// Simple spinner loader
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; color?: string }> = ({
    size = 'md',
    color = 'text-indigo-600 dark:text-indigo-400'
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className={`${sizeClasses[size]} ${color} animate-spin theme-transition`}>
            <div className="w-full h-full border-2 border-current border-t-transparent rounded-full"></div>
        </div>
    );
};
// Travel planning specific loader

export const TravelPlanningLoader: React.FC<{
    sendAsEmail?: boolean;
    emailAddresses?: string;
}> = ({ sendAsEmail, emailAddresses }) => {
    const [visibleSteps, setVisibleSteps] = useState(0);

    useEffect(() => {
        const intervals = [1000, 2000, 3000, 4000];
        intervals.forEach((delay, index) => {
            setTimeout(() => setVisibleSteps(index + 1), delay);
        });
    }, []);

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50/95 via-indigo-50/95 to-purple-50/95 dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 backdrop-blur-sm flex items-center justify-center z-50">
            {/* Floating background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>

                {/* Floating icons */}
                <div className="absolute top-20 left-20 opacity-10 dark:opacity-5">
                    <Sparkles
                        className="w-6 h-6 text-yellow-500 animate-spin"
                        style={{ animationDuration: '3s' }}
                    />
                </div>
                <div className="absolute top-32 right-32 opacity-10 dark:opacity-5">
                    <Globe className="w-8 h-8 text-blue-500 animate-bounce" style={{ animationDelay: '2s' }} />
                </div>
                <div className="absolute bottom-32 left-16 opacity-10 dark:opacity-5">
                    <Heart className="w-5 h-5 text-red-500 animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
            </div>

            {/* Main loader container */}
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-12 max-w-md mx-4 text-center">
                {/* Animated border gradient */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-sm animate-pulse"></div>

                {/* Content */}
                <div className="relative z-10">
                    {/* Main icon animation */}
                    <div className="relative mb-8">
                        {/* Central rotating ring */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div
                                className="w-32 h-32 rounded-full border-4 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin"
                                style={{
                                    maskImage: 'conic-gradient(transparent 0deg, black 45deg, black 315deg, transparent 360deg)',
                                    WebkitMaskImage: 'conic-gradient(transparent 0deg, black 45deg, black 315deg, transparent 360deg)'
                                }}
                            ></div>
                        </div>

                        {/* Orbiting icons */}
                        <div className="relative w-32 h-32 mx-auto">
                            {/* MapPin - orbiting */}
                            <div
                                className="absolute inset-0 animate-spin"
                                style={{ animationDuration: '8s' }}
                            >
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-gradient-to-br from-red-500 to-pink-500 p-3 rounded-full shadow-lg animate-bounce">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Plane - counter-orbiting */}
                            <div
                                className="absolute inset-0 animate-spin"
                                style={{
                                    animationDuration: '6s',
                                    animationDirection: 'reverse'
                                }}
                            >
                                <div className="absolute top-1/2 -right-2 transform -translate-y-1/2">
                                    <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-3 rounded-full shadow-lg animate-pulse">
                                        <Plane className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Calendar - different orbit */}
                            <div
                                className="absolute inset-0 animate-spin"
                                style={{
                                    animationDuration: '10s',
                                    animationDirection: 'reverse'
                                }}
                            >
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-full shadow-lg animate-bounce" style={{ animationDelay: '0.5s' }}>
                                        <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Center glow */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30 animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Title with typing animation effect */}
                    <div className="mb-4">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
                            Creating Your Perfect Trip
                        </h3>
                        <div className="flex items-center justify-center space-x-1">
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                            <span className="inline-block w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                            <span className="inline-block w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        Our AI is analyzing destinations, costs, and creating your personalized itinerary
                    </p>

                    {/* Email notification */}
                    {sendAsEmail && emailAddresses && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                            <div className="flex items-center justify-center space-x-2 text-sm text-blue-700 dark:text-blue-300">
                                <div className="relative">
                                    <Mail className="w-4 h-4" />
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                </div>
                                <span>Sending to: <span className="font-medium">{emailAddresses}</span></span>
                            </div>
                        </div>
                    )}

                    {/* Enhanced progress bar */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Analyzing destinations</span>
                            <span className="animate-pulse">●●●</span>
                        </div>

                        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                                style={{
                                    width: `${Math.min(visibleSteps * 25, 100)}%`,
                                    animation: 'pulse 2s ease-in-out infinite'
                                }}
                            ></div>
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-pulse"
                                style={{ animationDuration: '1.5s' }}
                            ></div>
                        </div>

                        <div className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">
                            This usually takes 10-15 seconds...
                        </div>
                    </div>

                    {/* Processing steps */}
                    <div className="mt-6 space-y-2">
                        {[
                            { step: "Analyzing preferences", icon: "🎯" },
                            { step: "Finding best destinations", icon: "🌍" },
                            { step: "Calculating costs", icon: "💰" },
                            { step: "Creating itinerary", icon: "📋" }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className={`flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 transition-all duration-500 ${visibleSteps > index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                                    }`}
                            >
                                <span className="text-base">{item.icon}</span>
                                <span>{item.step}</span>
                                <div className="flex space-x-1 ml-auto">
                                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// // Travel planning specific loader
// export const TravelPlanningLoader: React.FC<{ sendAsEmail?: boolean; emailAddresses?: string; }> = ({ sendAsEmail, emailAddresses }) => {
//     return (
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-100 dark:border-gray-700 theme-transition">
//             <div className="flex justify-center space-x-4 mb-6">
//                 <div className="animate-bounce" style={{ animationDelay: '0ms' }}>
//                     <MapPin className="w-8 h-8 text-indigo-600 dark:text-indigo-400 theme-transition" />
//                 </div>
//                 <div className="animate-bounce" style={{ animationDelay: '150ms' }}>
//                     <Plane className="w-8 h-8 text-blue-600 dark:text-blue-400 theme-transition" />
//                 </div>
//                 <div className="animate-bounce" style={{ animationDelay: '300ms' }}>
//                     <Calendar className="w-8 h-8 text-green-600 dark:text-green-400 theme-transition" />
//                 </div>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 theme-transition">Creating Your Perfect Trip</h3>
//             <p className="text-gray-600 dark:text-gray-300 mb-4 theme-transition">Our AI is analyzing destinations, costs, and creating your personalized itinerary...</p>
//             {sendAsEmail && (
//                 <div className="flex items-center justify-center space-x-2 text-sm text-indigo-600 dark:text-indigo-400 mt-2">
//                     <Mail className="w-4 h-4" />
//                     <span>We'll also send this to: {emailAddresses}</span>
//                 </div>
//             )}
//             <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 theme-transition mt-4">
//                 <div className="bg-indigo-600 dark:bg-indigo-400 h-2 rounded-full animate-pulse theme-transition" style={{ width: '70%' }}></div>
//             </div>
//         </div>
//     );
// };



export default {
    Spinner,
    TravelPlanningLoader,
};