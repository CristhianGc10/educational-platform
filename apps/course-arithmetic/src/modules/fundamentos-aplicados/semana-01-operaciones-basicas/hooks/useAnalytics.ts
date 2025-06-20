export const useAnalytics = () => {
    const track = (event: string) => {
        console.log('track', event);
    };
    return { track };
};
