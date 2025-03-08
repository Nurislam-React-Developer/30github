import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Route from './routes/Route';
import { ThemeProvider } from './theme/ThemeContext';
import { LoadingProvider } from './context/LoadingContext';
import InitializeStories from './components/ui/InitializeStories';

function App() {
  return (
      <ThemeProvider>
        <LoadingProvider>
          <InitializeStories />
          <Route />
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
            limit={3}
          />
        </LoadingProvider>
      </ThemeProvider>
  );
}

export default App;
