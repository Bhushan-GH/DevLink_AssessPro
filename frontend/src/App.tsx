// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import  CollectionView  from './pages/CollectionView';
import { useUserStore } from './store/userStore';
const App: React.FC = () => {
  const user = useUserStore((state) => state.user);  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/collection"
          element={user ? <CollectionView />:<Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

