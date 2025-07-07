// src/services/api/travel/travelApi.ts
import { createApi, fetchBaseQuery, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { ApiConstants } from "../../../utils/constants/api_constants";
import { travelResponseSchema, type TravelQuery, type TravelResponse } from "../../../utils/validation/schema";

// Travel API definition with Zod validation
export const travelApi = createApi({
    reducerPath: "travelApi",
    baseQuery: fetchBaseQuery({
        baseUrl: ApiConstants.TRAVEL_API_BASE_URL,
        prepareHeaders: (headers) => {
            // Add ngrok bypass header to avoid browser warning
            headers.set('ngrok-skip-browser-warning', 'true');
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['TravelPlan'],
    endpoints: (builder) => ({
        getTravelPlan: builder.mutation<TravelResponse, TravelQuery>({
            query: (travelQuery) => {
                return {
                    url: ApiConstants.TRAVEL_QUERY_ENDPOINT,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true"
                    },
                    body: JSON.stringify({
                        ...travelQuery,
                        question: travelQuery.question + " Don't use *,#@,%,^,&,() characters in the response. make headings bold and use bullet points for lists."
                    }),
                };
            },
            transformResponse: (response: TravelResponse): TravelResponse => {
                // Validate the response with Zod
                const validation = travelResponseSchema.safeParse(response);
                if (!validation.success) {
                    console.error("API Response Validation Error:", validation.error.flatten());
                    throw new Error('Invalid response structure from server');
                }
                return validation.data;
            },
            transformErrorResponse: (response: FetchBaseQueryError) => { // Use FetchBaseQueryError type
                console.error('Travel API Error:', response);

                // Access status and data based on FetchBaseQueryError structure
                const status = 'status' in response ? response.status : 'UNKNOWN_STATUS';
                const data = 'data' in response ? response.data : 'An unexpected error occurred';

                const errorMessage = typeof data === 'string'
                    ? data
                    : 'An unexpected error occurred';


                return {
                    status: status,
                    data: errorMessage
                };
            },
            invalidatesTags: ['TravelPlan'],
        }),
    }),
});

// Export the hook
export const { useGetTravelPlanMutation } = travelApi;
