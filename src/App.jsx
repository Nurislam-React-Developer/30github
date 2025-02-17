import React from 'react';
import { ToastContainer } from 'react-toastify';
import Routes from './routes/Route';
import { ThemeProvider } from './theme/ThemeContext';

const App = () => {
	return (
		<ThemeProvider>
			<ToastContainer />
			<Routes />
		</ThemeProvider>
	);
};

export default App;
