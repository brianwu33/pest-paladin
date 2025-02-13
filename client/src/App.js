import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Home from './pages/Home';
// import MyDetectionsPage from './pages/MyDetectionsPage';
// import MyDetectionDetailPage from './pages/MyDetectionDetailPage';
// import MyAnalyticsPage from './pages/MyAnalyticsPage';
// import LiveFeedPage from './pages/LiveFeedPage';
// import Profile from './pages/Profile';
import Login from './pages/Login'

// const App =() => {
//   // set up routes to all other pages
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/my-detections" element={<MyDetectionsPage />} />
//         <Route path="/my-detection/:id" element={<MyDetectionDetailPage />} />
//         <Route path="/my-analytics" element={<MyAnalyticsPage />} />
//         <Route path="/live-feed" element={<LiveFeedPage />} />
//         <Route path="/profile" element={<Profile />} />
//     </Routes>
//     </Router>
//   );
// }

// const App = () => {
//   return <div className="bg-green-500 text-white p-4">Tailwind Works! 🎉</div>;
// }

const App = () => {
  return <Login />;
}


export default App;
