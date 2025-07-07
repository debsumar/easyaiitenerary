// src/services/api/email/emailApi.ts
import { createApi, fetchBaseQuery, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { ApiConstants } from "../../../utils/constants/api_constants";
import { sendEmailSchema, type SendEmail } from "../../../utils/validation/schema";

export const emailApi = createApi({
    reducerPath: "emailApi",
    baseQuery: fetchBaseQuery({
        baseUrl: ApiConstants.TRAVEL_API_BASE_URL, // Assuming the same base URL for email
        prepareHeaders: (headers) => {
            headers.set('ngrok-skip-browser-warning', 'true');
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['Email'],
    endpoints: (builder) => ({
        sendEmail: builder.mutation<{ message: string }, SendEmail>({
            query: (emailData) => ({
                url: ApiConstants.SEND_EMAIL_ENDPOINT,
                method: "POST",
                body: emailData,
            }),
            transformErrorResponse: (response: FetchBaseQueryError) => {
                console.error('Email API Error:', response);
                const status = 'status' in response ? response.status : 'UNKNOWN_STATUS';
                const data = 'data' in response ? response.data : 'An unexpected error occurred';
                const errorMessage = typeof data === 'string' ? data : 'An unexpected error occurred';
                return {
                    status: status,
                    data: errorMessage
                };
            },
        }),
    }),
});

export const { useSendEmailMutation } = emailApi;
