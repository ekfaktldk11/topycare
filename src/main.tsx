import { Amplify } from 'aws-amplify';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { parseAmplifyConfig } from 'aws-amplify/utils';
import outputs from '../amplify_outputs.json';
// fetchDishes import를 configure 이후로 이동하거나 동적 import 사용

const amplifyConfig = parseAmplifyConfig(outputs);

Amplify.configure(
    {
        ...amplifyConfig,
    },
);

// configure 이후에 import
import('./App.tsx').then(({ default: App }) => {
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <App />
        </StrictMode>,
    );
});