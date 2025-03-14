'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import TetrisLoader from '../components/ui/TetrisLoader';

type LoadingContextType = {
	isLoading: boolean;
	showLoader: () => void;
	hideLoader: () => void;
};

const LoadingContext = createContext<LoadingContextType>({
	isLoading: false,
	showLoader: () => {},
	hideLoader: () => {},
});

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
	const [isLoading, setIsLoading] = useState(false);

	const showLoader = () => setIsLoading(true);
	const hideLoader = () => setIsLoading(false);

	return (
		<LoadingContext.Provider value={{ isLoading, showLoader, hideLoader }}>
			{isLoading && (
				<div className='fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50'>
					<TetrisLoader />
				</div>
			)}
			{children}
		</LoadingContext.Provider>
	);
};

export const useLoading = () => useContext(LoadingContext);
