import { useState } from 'react';

export const useProgressTracking = () => {
    const [progress, setProgress] = useState(0);
    return { progress, setProgress };
};
