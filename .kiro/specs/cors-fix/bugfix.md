# Bugfix Requirements Document

## Introduction

OPTIONS preflight requests to the AjoSave backend (deployed on Vercel at https://ajosave-backend.vercel.app) return HTTP 500 with "Something went wrong!" and no `Access-Control-Allow-Origin` header. This blocks all cross-origin API calls from the frontend (https://ajosave-gby5ey6l9-otikanelsons-projects.vercel.app) and the mobile app. The root cause is that the CORS middleware throws an `Error` for disallowed origins, which the `globalErrorHandler` treats as a non-operational error and converts to a generic 500 — stripping any CORS headers before the response is sent.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a browser sends an OPTIONS preflight request to any `/api/*` endpoint THEN the system returns HTTP 500 with body `{"success":false,"message":"Something went wrong!"}` instead of a CORS preflight response

1.2 WHEN the CORS middleware rejects an origin by calling `callback(new Error(...))` THEN the system passes that error to `globalErrorHandler`, which wraps it as a generic 500 `AppError` because `error.isOperational` is not set

1.3 WHEN the `globalErrorHandler` sends the 500 response THEN the system does not include the `Access-Control-Allow-Origin` header, causing the browser to block the subsequent request with a CORS policy error

1.4 WHEN any API call (login, getCurrentUser, etc.) is made from the frontend or mobile app THEN the system fails with a CORS policy error because the preflight was rejected

### Expected Behavior (Correct)

2.1 WHEN a browser sends an OPTIONS preflight request from an allowed origin THEN the system SHALL respond with HTTP 204/200 and include `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, and `Access-Control-Allow-Headers` headers

2.2 WHEN the CORS middleware rejects a disallowed origin THEN the system SHALL respond with HTTP 403 and still include appropriate CORS error headers, without triggering the generic 500 error handler

2.3 WHEN the `globalErrorHandler` processes a CORS rejection error THEN the system SHALL recognize it as an operational error and return an appropriate 4xx status code with CORS headers intact

2.4 WHEN any API call is made from the configured allowed origins (frontend and mobile app) THEN the system SHALL include `Access-Control-Allow-Origin` in the response and complete the request successfully

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a request is made from an origin not in the allowed list THEN the system SHALL CONTINUE TO reject the request with an appropriate error response

3.2 WHEN a non-OPTIONS request (GET, POST, PUT, DELETE) is made from an allowed origin THEN the system SHALL CONTINUE TO process the request normally and include CORS headers in the response

3.3 WHEN an unhandled server error occurs (database failure, unhandled exception, etc.) THEN the system SHALL CONTINUE TO return HTTP 500 with the generic error response

3.4 WHEN a request is made without an `Origin` header (mobile apps, Postman, curl) THEN the system SHALL CONTINUE TO process the request without CORS restrictions

3.5 WHEN the health check endpoints (`/` or `/api/health`) are called THEN the system SHALL CONTINUE TO respond with HTTP 200 regardless of origin
