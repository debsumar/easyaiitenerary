// src/pages/travel/TravelPlanDisplay.tsx
import React from 'react';
import { ArrowLeft, MapPin, Calendar, DollarSign, Hotel, Utensils, Car, Camera, Sun, Activity } from 'lucide-react';
import { TravelSectionType, getSectionType, type TravelSectionTypeValue } from '../../utils/constants/app_constants';
import type { TravelResponse } from '../../utils/validation/schema';

interface TravelPlanDisplayProps {
    data: TravelResponse;
    onNewSearch: () => void;
}

interface SectionIconConfig {
    icon: React.ReactNode;
    bgColor: string;
    iconColor: string;
    darkBgColor: string;
    darkIconColor: string;
}

const TravelPlanDisplay: React.FC<TravelPlanDisplayProps> = ({ data, onNewSearch }) => {
    // Parse the markdown-like content into sections
    const parseContent = (content: string): string[] => {
        const sections = content.split('---').filter(section => section.trim());
        return sections.map(section => section.trim());
    };

    const parseTableContent = (content: string): { headers: string[]; rows: string[][] } | null => {
        const lines = content.split('\n').filter(line => line.trim());
        const tableLines = lines.filter(line => line.includes('|'));

        if (tableLines.length < 2) return null;

        const headers = tableLines[0].split('|').map(h => h.trim()).filter(h => h);
        const rows = tableLines.slice(2).map(row =>
            row.split('|').map(cell => cell.trim()).filter(cell => cell)
        );

        return { headers, rows };
    };

    // Get section configuration based on type - using constants from app_constants.ts
    const getSectionConfig = (title: string): SectionIconConfig => {
        const sectionType = getSectionType(title);

        const configs: Record<TravelSectionTypeValue, SectionIconConfig> = {
            [TravelSectionType.ITINERARY]: {
                icon: <Calendar className="w-6 h-6" />,
                bgColor: "bg-blue-50",
                iconColor: "text-blue-600",
                darkBgColor: "dark:bg-blue-900/20",
                darkIconColor: "dark:text-blue-400"
            },
            [TravelSectionType.HOTELS]: {
                icon: <Hotel className="w-6 h-6" />,
                bgColor: "bg-purple-50",
                iconColor: "text-purple-600",
                darkBgColor: "dark:bg-purple-900/20",
                darkIconColor: "dark:text-purple-400"
            },
            [TravelSectionType.RESTAURANTS]: {
                icon: <Utensils className="w-6 h-6" />,
                bgColor: "bg-green-50",
                iconColor: "text-green-600",
                darkBgColor: "dark:bg-green-900/20",
                darkIconColor: "dark:text-green-400"
            },
            [TravelSectionType.BUDGET]: {
                icon: <DollarSign className="w-6 h-6" />,
                bgColor: "bg-yellow-50",
                iconColor: "text-yellow-600",
                darkBgColor: "dark:bg-yellow-900/20",
                darkIconColor: "dark:text-yellow-400"
            },
            [TravelSectionType.TRANSPORTATION]: {
                icon: <Car className="w-6 h-6" />,
                bgColor: "bg-indigo-50",
                iconColor: "text-indigo-600",
                darkBgColor: "dark:bg-indigo-900/20",
                darkIconColor: "dark:text-indigo-400"
            },
            [TravelSectionType.ATTRACTIONS]: {
                icon: <Camera className="w-6 h-6" />,
                bgColor: "bg-red-50",
                iconColor: "text-red-600",
                darkBgColor: "dark:bg-red-900/20",
                darkIconColor: "dark:text-red-400"
            },
            [TravelSectionType.WEATHER]: {
                icon: <Sun className="w-6 h-6" />,
                bgColor: "bg-orange-50",
                iconColor: "text-orange-600",
                darkBgColor: "dark:bg-orange-900/20",
                darkIconColor: "dark:text-orange-400"
            },
            [TravelSectionType.ACTIVITIES]: {
                icon: <Activity className="w-6 h-6" />,
                bgColor: "bg-pink-50",
                iconColor: "text-pink-600",
                darkBgColor: "dark:bg-pink-900/20",
                darkIconColor: "dark:text-pink-400"
            }
        };

        return configs[sectionType];
    };

    const renderSection = (section: string, index: number) => {
        const lines = section.split('\n').filter(line => line.trim());
        if (lines.length === 0) return null;

        const title = lines[0].replace(/#+\s*\*?\*?/, '').trim();
        const content = lines.slice(1).join('\n');

        // Get section configuration using constants
        const { icon, bgColor, iconColor, darkBgColor, darkIconColor } = getSectionConfig(title);

        // Check if content contains a table
        const tableData = parseTableContent(content);

        return (
            <div key={index} className={`${bgColor} ${darkBgColor} rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-200`}>
                <div className="flex items-center space-x-3 mb-4">
                    <div className={`${iconColor} ${darkIconColor} ${bgColor} ${darkBgColor} p-2 rounded-lg transition-colors duration-200`}>
                        {icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{title}</h3>
                </div>

                {tableData ? (
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    {tableData.headers.map((header, i) => (
                                        <th key={i} className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                {tableData.rows.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        {row.map((cell, j) => (
                                            <td key={j} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                        {content.split('\n').map((line, i) => {
                            const trimmedLine = line.trim();

                            if (trimmedLine.startsWith('- ')) {
                                return (
                                    <div key={i} className="flex items-start space-x-2 mb-2">
                                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0 transition-colors duration-200"></div>
                                        <p className="text-gray-700 dark:text-gray-300 transition-colors duration-200">{trimmedLine.replace('- ', '')}</p>
                                    </div>
                                );
                            } else if (trimmedLine.match(/^\d+\./)) {
                                const number = trimmedLine.match(/^\d+/)?.[0];
                                const text = trimmedLine.replace(/^\d+\.\s*/, '');
                                return (
                                    <div key={i} className="flex items-start space-x-3 mb-3">
                                        <div className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-semibold px-2 py-1 rounded-full min-w-[24px] text-center transition-colors duration-200">
                                            {number}
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 flex-1 transition-colors duration-200">{text}</p>
                                    </div>
                                );
                            } else if (trimmedLine) {
                                return (
                                    <p key={i} className="text-gray-700 dark:text-gray-300 mb-2 leading-relaxed transition-colors duration-200">
                                        {trimmedLine}
                                    </p>
                                );
                            }
                            return null;
                        })}
                    </div>
                )}
            </div>
        );
    };

    const sections = parseContent(data.answer);

    return (
        <div className="space-y-8">
            {/* Header with back button */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onNewSearch}
                    className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-lg px-3 py-2 duration-200"
                    aria-label="Plan another trip"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Plan Another Trip</span>
                </button>

                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 transition-colors duration-200">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">Your Personalized Travel Plan</span>
                </div>
            </div>

            {/* Travel Plan Content */}
            <div className="space-y-6">
                {sections.length > 0 ? (
                    sections.map((section, index) => renderSection(section, index))
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-200">
                            <MapPin className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">No Travel Plan Found</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-200">We couldn't parse your travel plan. Please try generating a new one.</p>
                        <button
                            onClick={onNewSearch}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors duration-200"
                        >
                            Generate New Plan
                        </button>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 duration-200"
                        aria-label="Save this travel plan"
                    >
                        Save This Plan
                    </button>
                    <button
                        className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 duration-200"
                        aria-label="Share this travel plan"
                    >
                        Share Plan
                    </button>
                    <button
                        onClick={onNewSearch}
                        className="px-6 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 duration-200"
                        aria-label="Create a new travel plan"
                    >
                        Create New Plan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TravelPlanDisplay;