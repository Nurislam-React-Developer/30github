'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { LoadingProvider } from './context/LoadingContext';
import { store } from './store/store';
import { ThemeProvider } from './theme/ThemeContext';

export function Providers({ children }: { children: ReactNode }) {
	// Handle client-side rendering for Next.js
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<Provider store={store}>
			<ThemeProvider>
				<LoadingProvider>{children}</LoadingProvider>
			</ThemeProvider>
		</Provider>
	);
}
