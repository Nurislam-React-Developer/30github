import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Route from './routes/Route';
import { ThemeProvider } from './theme/ThemeContext';
import { useTheme } from './theme/ThemeContext';
import { LoadingProvider } from './context/LoadingContext';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import InitializeStories from './components/ui/InitializeStories';

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
			<Route />
		</>
	);
};

// Keeping only one App function declaration
function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <LoadingProvider>
          <BrowserRouter>
            <InitializeStories />
            <Header />
            <Route />
            <Footer />
            <ToastContainer />
          </BrowserRouter>
        </LoadingProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
