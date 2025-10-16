import { Amplify } from 'aws-amplify';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { parseAmplifyConfig } from 'aws-amplify/utils';
import App from './App.tsx';
import outputs from '../amplify_outputs.json';
import { fetchDishes } from './clients/api/data.ts';

const amplifyConfig = parseAmplifyConfig(outputs);

Amplify.configure(
    {
        ...amplifyConfig,
    },
)

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)

window.onload = async () => {
    try {
        const result = await fetchDishes();
        const { dish, errors } = result;
        console.log("Fetched dish on load:", dish, errors);
    } catch (error) {
        console.error("Error fetching dishes on load:", error);
    }
}