import { Amplify } from 'aws-amplify';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { parseAmplifyConfig } from 'aws-amplify/utils';
import App from './App.tsx';
import outputs from '../amplify_outputs.json';

const amplifyConfig = parseAmplifyConfig(outputs);

Amplify.configure(
    {
        ...amplifyConfig,
        API: {
            ...amplifyConfig.API,
            REST: outputs.custom.API, // Required for custom REST APIs
        },
    },
    {
        API: {
            REST: {
                retryStrategy: {
                    strategy: 'no-retry',
                }
            }
        }
    }
)

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)

window.onload = async () => {
    try {
        const lambdaUrl = outputs.custom.API.dishService.endpoint;
        console.log("Calling Lambda URL:", lambdaUrl);
        const response = await fetch(lambdaUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Lambda Response:", data);
    } catch (error) {
        console.error("Error calling Lambda function:", error);
    }
}