import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div 
      className="h-screen flex flex-col overflow-hidden bg-surface-200 dark:bg-dark-50 text-surface-900 dark:text-dark-900"
      style={{
        backgroundImage: 'url(https://apper.io/images/launch-and-scale.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;