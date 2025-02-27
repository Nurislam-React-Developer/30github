import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Routes from './routes/Route';
import { ThemeProvider } from './theme/ThemeContext';
import { useTheme } from './theme/ThemeContext';

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
			<AppContent />
		</ThemeProvider>
	);
};

export default App;
