// src/utils/validation/schema.ts
import { z } from 'zod';

// Travel API Schemas
export const travelQuerySchema = z.object({
    question: z.string()
        .min(10, 'Please provide more details about your travel plans (at least 10 characters)')
        .max(500, 'Please keep your question under 500 characters')
        .refine(
            (val) => val.toLowerCase().includes('trip') ||
                val.toLowerCase().includes('travel') ||
                val.toLowerCase().includes('vacation') ||
                val.toLowerCase().includes('plan') ||
                val.toLowerCase().includes('visit'),
            'Please include travel-related keywords in your question'
        )
});

export const travelResponseSchema = z.object({
    answer: z.string().min(1, 'Response cannot be empty')
});

// Email Schema
export const sendEmailSchema = z.object({
    email: z.array(z.string().email('Invalid email address')),
    subject: z.string().min(1, 'Subject cannot be empty'),
    body: z.string().min(1, 'Body cannot be empty'),
});

// API Constants Schema
export const apiConstantsSchema = z.object({
    DUMMY_JSON_BASE_URL: z.string().url('Invalid dummy JSON base URL'),
    TRAVEL_API_BASE_URL: z.string().url('Invalid travel API base URL'),
    TRAVEL_QUERY_ENDPOINT: z.string().startsWith('/', 'Endpoint must start with /'),
    SEND_EMAIL_ENDPOINT: z.string().startsWith('/', 'Endpoint must start with /')
});

// Form Validation Schema
export const travelFormSchema = z.object({
    destination: z.string().optional(),
    budget: z.number().positive('Budget must be positive').optional(),
    duration: z.number().positive('Duration must be positive').optional(),
    travelType: z.enum(['leisure', 'business', 'adventure', 'romantic', 'family']).optional(),
    question: travelQuerySchema.shape.question
});

// Types derived from schemas
export type TravelQuery = z.infer<typeof travelQuerySchema>;
export type TravelResponse = z.infer<typeof travelResponseSchema>;
export type SendEmail = z.infer<typeof sendEmailSchema>;
export type TravelForm = z.infer<typeof travelFormSchema>;

// Validation helper functions
export const validateTravelQuery = (query: unknown) => {
    return travelQuerySchema.safeParse(query);
};

export const validateTravelResponse = (response: unknown) => {
    return travelResponseSchema.safeParse(response);
};

export const validateSendEmail = (data: unknown) => {
    return sendEmailSchema.safeParse(data);
};

export const validateTravelForm = (form: unknown) => {
    return travelFormSchema.safeParse(form);
};

export const validateApiConstants = (constants: unknown) => {
    return apiConstantsSchema.safeParse(constants);
};