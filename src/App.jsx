import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Routes from './routes/Route';
import { ThemeProvider } from './theme/ThemeContext';
import { useTheme } from './theme/ThemeContext';
import { LoadingProvider } from './context/LoadingContext';

const AppContent = () => {
	const { darkMode } = useTheme();

	return (
		<>
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme={darkMode ? 'dark' : 'light'}
				limit={3}
			/>
			<Routes />
		</>
	);
};

const App = () => {
	return (
		<ThemeProvider>
			<LoadingProvider>
				<AppContent />
			</LoadingProvider>
		</ThemeProvider>
	);
};

export default App;
