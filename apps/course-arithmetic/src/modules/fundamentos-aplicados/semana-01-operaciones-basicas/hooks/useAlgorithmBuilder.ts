import { useState } from 'react';

export const useAlgorithmBuilder = () => {
    const [steps, setSteps] = useState<string[]>([]);
    return { steps, setSteps };
};
