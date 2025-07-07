// src/pages/travel/TravelPlannerHome.tsx
import React, { useState, useEffect } from 'react';
import { Send, MapPin, ArrowRight, AlertCircle, Mail, CheckCircle, X, Utensils, Calendar, DollarSign, Hotel } from 'lucide-react';
import { useGetTravelPlanMutation } from '../../services/api/travel/travelApi';
import { useSendEmailMutation } from '../../services/api/email/emailApi';
import { EXAMPLE_TRAVEL_QUESTIONS, DEFAULT_EMAIL_BODY } from '../../utils/constants/app_constants';
import TravelPlanDisplay from './TravelPlanDisplay';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { travelQuerySchema, sendEmailSchema } from '../../utils/validation/schema';
import { PoweredByFooter } from '../../components/ui/Footers';
import { TravelPlanningLoader } from '../../components/ui/Loaders';

interface ValidationError {
    field: string;
    message: string;
}

interface ApiError {
    status: string | number;
    data: string;
}

// Email notification component
const EmailNotification: React.FC<{
    type: 'success' | 'error';
    message: string;
    onClose: () => void;
}> = ({ type, message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Auto-hide after 5 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    return (

        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            } border rounded-lg p-4 shadow-lg transition-all duration-300`}>
            <div className="flex items-start space-x-3">
                {type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                )}
                <div className="flex-1">
                    <p className={`text-sm font-medium ${type === 'success'
                        ? 'text-green-900 dark:text-green-300'
                        : 'text-red-900 dark:text-red-300'
                        }`}>
                        {type === 'success' ? 'Email Sent!' : 'Email Failed'}
                    </p>
                    <p className={`text-xs mt-1 ${type === 'success'
                        ? 'text-green-700 dark:text-green-400'
                        : 'text-red-700 dark:text-red-400'
                        }`}>
                        {message}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className={`${type === 'success'
                        ? 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300'
                        : 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300'
                        } transition-colors`}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

const TravelPlannerHome: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [sendAsEmail, setSendAsEmail] = useState(false);

    // Email form fields
    const [emailAddresses, setEmailAddresses] = useState('user@example.com'); // Comma-separated emails
    const [emailSubject, setEmailSubject] = useState('Your AI-Generated Travel Plan');
    const [emailBody, setEmailBody] = useState('');

    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
    const [emailNotification, setEmailNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const [getTravelPlan, { data, error, isLoading, reset }] = useGetTravelPlanMutation();
    const [sendEmail, { isLoading: isSendingEmail }] = useSendEmailMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationErrors([]);

        const validationResult = travelQuerySchema.safeParse({ question: question.trim() });

        if (!validationResult.success) {
            const formattedErrors = validationResult.error.errors.map((err) => ({
                field: err.path[0].toString(),
                message: err.message,
            }));
            setValidationErrors(formattedErrors);
            return;
        }

        // Validate email fields if email checkbox is checked
        if (sendAsEmail) {
            const emailValidationResult = sendEmailSchema.safeParse({
                email: emailAddresses.split(',').map(e => e.trim()).filter(Boolean),
                subject: emailSubject,
                body: 'dummy content' // Body is not validated here, but is required by the schema
            });

            if (!emailValidationResult.success) {
                const formattedErrors = emailValidationResult.error.errors.map((err) => ({
                    field: err.path[0].toString(),
                    message: err.message,
                }));
                setValidationErrors(formattedErrors);
                return;
            }
        }

        try {
            // Step 1: Get travel plan (this is the primary action)
            const travelPlanData = await getTravelPlan({
                question: validationResult.data.question,
            }).unwrap();

            // Step 2: If email checkbox is selected, send email in the background
            if (sendAsEmail && travelPlanData) {
                console.log('📧 Sending email in background...');

                // Parse comma-separated email addresses
                const emails = emailAddresses
                    .split(',')
                    .map(email => email.trim())
                    .filter(email => email.length > 0);

                                const userMessage = emailBody.trim();
                const finalEmailBody = userMessage ? userMessage : DEFAULT_EMAIL_BODY;

                // Don't await this - let it run in background
                sendEmail({
                    email: emails,
                    subject: emailSubject || `Your AI-Generated Travel Plan - ${question.split(' ').slice(0, 5).join(' ')}...`,
                    body: finalEmailBody,
                })
                    .unwrap()
                    .then(() => {
                        console.log('📧 Email sent successfully');
                        setEmailNotification({
                            type: 'success',
                            message: `Travel plan sent to ${emails.join(', ')}`
                        });
                    })
                    .catch((emailError) => {
                        console.error('📧 Email send failed:', emailError);
                        setEmailNotification({
                            type: 'error',
                            message: 'Failed to send email. Please try again.'
                        });
                    });
            }

            // User immediately sees the travel plan regardless of email status
        } catch (err) {
            console.error('Error getting travel plan:', err);
            const apiError = err as ApiError;
            if (apiError.status === 'VALIDATION_ERROR') {
                setValidationErrors([{ field: 'question', message: apiError.data }]);
            }
        }
    };

    const handleExampleClick = (exampleQuestion: string) => {
        setQuestion(exampleQuestion);
        setValidationErrors([]);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuestion(value);

        if (validationErrors.length > 0 && value.trim()) {
            setValidationErrors([]);
        }
    };

    const handleEmailToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSendAsEmail(e.target.checked);
    };

    const handleReset = () => {
        setQuestion('');
        setSendAsEmail(false);
        setEmailAddresses('user@example.com');
        setEmailSubject('Your AI-Generated Travel Plan');
        setEmailBody('');
        setValidationErrors([]);
        setEmailNotification(null);
        reset();
    };

    const hasValidationErrors = validationErrors.length > 0;
    const questionError = validationErrors.find(err => err.field === 'question');
    const emailError = validationErrors.find(err => err.field === 'email');
    const subjectError = validationErrors.find(err => err.field === 'subject');

    if (isLoading) {
        return <TravelPlanningLoader sendAsEmail={sendAsEmail} emailAddresses={emailAddresses}
        // isSendingEmail={isSendingEmail}
        />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
            {/* Email Notification */}
            {emailNotification && (
                <EmailNotification
                    type={emailNotification.type}
                    message={emailNotification.message}
                    onClose={() => setEmailNotification(null)}
                />
            )}

            {/* Header */}
            <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center transition-colors duration-200">
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">EasyAI Itinerary</h1>
                        </div>
                        <ThemeToggle size="md" />
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!data ? (
                    <>
                        {/* Features Grid */}
                        <div className="grid md:grid-cols-4 gap-6 mb-12">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                                <Calendar className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4 transition-colors duration-200" />
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">Smart Itineraries</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-200">Optimized day-by-day plans based on your preferences</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                                <Hotel className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4 transition-colors duration-200" />
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">Hotel Recommendations</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-200">Curated accommodations for every budget</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                                <Utensils className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4 transition-colors duration-200" />
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">Local Cuisine</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-200">Discover authentic restaurants and local specialties</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                                <DollarSign className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4 transition-colors duration-200" />
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">Budget Planning</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-200">Detailed cost breakdowns and budget estimates</p>
                            </div>
                        </div>
                        {/* Form Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="travel-question" className="block text-lg font-medium text-gray-900 dark:text-white mb-3 transition-colors duration-200">
                                        Where would you like to go?
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="travel-question"
                                            type="text"
                                            value={question}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Plan a 7-day romantic trip to Italy"
                                            className={`w-full px-6 py-4 pr-16 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200
                                                bg-white dark:bg-gray-700 
                                                text-gray-900 dark:text-white 
                                                placeholder-gray-500 dark:placeholder-gray-400
                                                ${questionError
                                                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                    : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'
                                                }`}
                                            disabled={isLoading}
                                            aria-invalid={hasValidationErrors}
                                            aria-describedby={questionError ? 'question-error' : undefined}
                                        />
                                        <button
                                            type="submit"
                                            disabled={isLoading || !question.trim()}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white p-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {questionError && (
                                        <div id="question-error" className="mt-2 flex items-center space-x-2 text-red-600 dark:text-red-400 transition-colors duration-200">
                                            <AlertCircle className="w-4 h-4" />
                                            <span className="text-sm">{questionError.message}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Email Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 transition-colors duration-200">
                                        <div className="flex items-center space-x-3">
                                            <input
                                                id="send-as-email"
                                                type="checkbox"
                                                checked={sendAsEmail}
                                                onChange={handleEmailToggle}
                                                disabled={isLoading}
                                                className="w-5 h-5 text-indigo-600 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                            <label
                                                htmlFor="send-as-email"
                                                className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer transition-colors duration-200"
                                            >
                                                <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                <span>Send travel plan to email</span>
                                            </label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {isSendingEmail && (
                                                <div className="flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400">
                                                    <div className="w-3 h-3 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Sending...</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Email Form Fields - Show when checkbox is checked */}
                                    {sendAsEmail && (
                                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4 transition-all duration-200">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Email Details</h4>

                                            {/* Email Addresses */}
                                            <div>
                                                <label htmlFor="email-addresses" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Email Address(es)
                                                </label>
                                                <input
                                                    id="email-addresses"
                                                    type="text"
                                                    value={emailAddresses}
                                                    onChange={(e) => setEmailAddresses(e.target.value)}
                                                    placeholder="email@example.com, another@example.com"
                                                    className={`w-full px-3 py-2 border rounded-lg
                                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                                             placeholder-gray-500 dark:placeholder-gray-400
                                                             focus:ring-2 focus:border-transparent
                                                             transition-colors duration-200
                                                             ${emailError
                                                            ? 'border-red-300 dark:border-red-600 focus:ring-500'
                                                            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'
                                                        }`}
                                                    disabled={isLoading}
                                                    aria-invalid={emailError ? true : false}
                                                    aria-describedby={emailError ? 'email-error' : undefined}
                                                />
                                                {emailError && (
                                                    <div id="email-error" className="mt-1 flex items-center space-x-2 text-red-600 dark:text-red-400 transition-colors duration-200">
                                                        <AlertCircle className="w-4 h-4" />
                                                        <span className="text-sm">{emailError.message}</span>
                                                    </div>
                                                )}
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    Separate multiple emails with commas
                                                </p>
                                            </div>

                                            {/* Email Subject */}
                                            <div>
                                                <label htmlFor="email-subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Subject
                                                </label>
                                                <input
                                                    id="email-subject"
                                                    type="text"
                                                    value={emailSubject}
                                                    onChange={(e) => setEmailSubject(e.target.value)}
                                                    placeholder="Your AI-Generated Travel Plan"
                                                    className={`w-full px-3 py-2 border rounded-lg
                                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                                             placeholder-gray-500 dark:placeholder-gray-400
                                                             focus:ring-2 focus:border-transparent
                                                             transition-colors duration-200
                                                             ${subjectError
                                                            ? 'border-red-300 dark:border-red-600 focus:ring-500'
                                                            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'
                                                        }`}
                                                    disabled={isLoading}
                                                    aria-invalid={subjectError ? true : false}
                                                    aria-describedby={subjectError ? 'subject-error' : undefined}
                                                />
                                                {subjectError && (
                                                    <div id="subject-error" className="mt-1 flex items-center space-x-2 text-red-600 dark:text-red-400 transition-colors duration-200">
                                                        <AlertCircle className="w-4 h-4" />
                                                        <span className="text-sm">{subjectError.message}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Email Body */}
                                            <div>
                                                <label htmlFor="email-body" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Custom Message (Optional)
                                                </label>
                                                <textarea
                                                    id="email-body"
                                                    value={emailBody}
                                                    onChange={(e) => setEmailBody(e.target.value)}
                                                    placeholder="Add a custom message"
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                                             placeholder-gray-500 dark:placeholder-gray-400
                                                             focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                                             transition-colors duration-200 resize-vertical"
                                                    disabled={isLoading}
                                                />
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    Add a custom message to your email (optional)
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </form>

                            {/* Example Questions */}
                            <div className="mt-6">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors duration-200">Try these examples:</p>
                                <div className="flex flex-wrap gap-2">
                                    {EXAMPLE_TRAVEL_QUESTIONS.map((example, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleExampleClick(example)}
                                            disabled={isLoading}
                                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span>{example}</span>
                                            <ArrowRight className="w-3 h-3" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Error State */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center transition-colors duration-200">
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-2 transition-colors duration-200">Something went wrong</h3>
                                <p className="text-red-700 dark:text-red-400 transition-colors duration-200">
                                    {error && typeof error === 'object' && 'data' in error
                                        ? String((error as ApiError).data)
                                        : 'We couldn\'t generate your travel plan. Please try again.'
                                    }
                                </p>
                                <button
                                    onClick={handleReset}
                                    className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <TravelPlanDisplay
                        data={data}
                        onNewSearch={handleReset}
                    />
                )}
            </div>

            {/* Powered By Footer */}
            <PoweredByFooter />
        </div>
    );
};


export default TravelPlannerHome;