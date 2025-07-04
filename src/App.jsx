import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react';
import Layout from './Layout';
import { routes, routeArray } from './config/routes';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    
    // Only use dark mode if explicitly saved as 'dark'
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    } else {
      // Default to light mode for new users and any other case
      setIsDarkMode(false);
    }
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {routeArray.map(route => (
            <Route
              key={route.id}
              path={route.path}
              element={<route.component />}
            />
          ))}
          <Route path="*" element={<div className="flex items-center justify-center h-full"><div className="text-center"><h1 className="text-4xl font-bold text-gray-800">404</h1><p className="text-gray-600 mt-2">Page not found</p></div></div>} />
        </Route>
      </Routes>
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
        theme={isDarkMode ? "dark" : "light"}
        className="z-[9999]"
      />
    </BrowserRouter>
  );
}

export default App;