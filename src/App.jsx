import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import NewsPage from './pages/NewsPage';
import QuickAccessPage from './pages/QuickAccessPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<NewsPage />} />
        <Route path="quick-access" element={<QuickAccessPage />} />
      </Route>
    </Routes>
  );
}