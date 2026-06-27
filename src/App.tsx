import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ArticleAnalysisPage from './pages/ArticleAnalysisPage';
import ArticleResultPage from './pages/ArticleResultPage';
import ImageAnalysisPage from './pages/ImageAnalysisPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';

const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/link-analyzer" element={<Navigate to="/" replace />} />
    <Route path="/analyze-article" element={<ArticleAnalysisPage />} />
    <Route path="/article-result" element={<ArticleResultPage />} />
    <Route path="/analyze-image" element={<ImageAnalysisPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignUpPage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/news" element={<NewsPage />} />
    <Route path="/news/:id" element={<NewsDetailPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
