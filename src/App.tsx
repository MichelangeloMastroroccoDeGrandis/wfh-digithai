import { Dashboard } from './dashboard/dashboard';
import './App.css';
import { AuthProvider } from './providers/UserAuthProvider';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './Login/login';

function App() {
  return (
    <div className='flex flex-col h-screen'>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/' element={<Navigate to='/login' />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
