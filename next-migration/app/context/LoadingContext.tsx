'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

type LoadingContextType = {
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType>({
	isLoading: false,
	setIsLoading: () => {},
});

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<LoadingContext.Provider value={{ isLoading, setIsLoading }}>
			{children}
		</LoadingContext.Provider>
	);
};

export const useLoading = () => useContext(LoadingContext);
