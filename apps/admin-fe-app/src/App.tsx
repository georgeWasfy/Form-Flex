import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, useEffect, useState } from 'react';
import DefaultLayout from './layouts/DefaultLayout';
import { QueryClient, QueryClientProvider } from 'react-query';
import RequestListing from './pages/requests/RequestListing';
import ErrorPage from './components/ErrorPage';
import 'react-toastify/dist/ReactToastify.css';
import FormBuilder from './components/FormBuilder/FormBuilder';
import FormPreview from './components/FormBuilder/FormPreview';
import DesignerContextProvider from './components/FormBuilder/Context/DesignerContext';
import ListListing from './pages/lists/ListListing';

function App() {
  // Check user set theme mode...
  const isDefaultDark = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;

  // Create theme mode state...
  const [theme, setTheme] = useState(isDefaultDark ? 'dark' : 'light');

  const switchTheme = (theme: string) => {
    setTheme(theme);
  };

  const router = createBrowserRouter([
    {
      path: '/',
      element: <DefaultLayout switchTheme={switchTheme} />,
      errorElement: <ErrorPage />,
      children: [
        { path: '/requests', element: <RequestListing /> },
        {
          path: '/requests/:requestKey/form-builder',
          element: <FormBuilder />,
        },
        { path: '/lists', element: <ListListing /> },
      ],
    },
  ]);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // default: true
      },
    },
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme || '');
  }, [theme]);
  return (
    <div className="App" data-theme={theme}>
      <Suspense>
        <QueryClientProvider client={queryClient}>
          <DesignerContextProvider>
            <RouterProvider router={router} />
          </DesignerContextProvider>
        </QueryClientProvider>
      </Suspense>
    </div>
  );
}

export default App;
