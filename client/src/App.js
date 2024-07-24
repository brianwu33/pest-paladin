import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MyDetectionsPage from './pages/MyDetectionsPage';
import MyAnalyticsPage from './pages/MyAnalyticsPage';
import LiveFeedPage from './pages/LiveFeedPage';
import Profile from './pages/Profile';

const App =() => {
  // set up routes to all other pages
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-detections" element={<MyDetectionsPage />} />
        <Route path="/my-analytics" element={<MyAnalyticsPage />} />
        <Route path="/live-feed" element={<LiveFeedPage />} />
        <Route path="/profile" element={<Profile />} />
    </Routes>
    </Router>
  );
}

export default App;
