import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import TrackerScreen from './screens/TrackerScreen';
import LayoutWithNav from './components/LayoutWithNav';
import QuestDashboard from './screens/QuestDashboard'; // ✅ Import this

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <LayoutWithNav>
              <Dashboard />
            </LayoutWithNav>
          </PrivateRoute>
        }
      />
      <Route
        path="/tracker"
        element={
          <PrivateRoute>
            <LayoutWithNav>
              <TrackerScreen />
            </LayoutWithNav>
          </PrivateRoute>
        }
      />
      <Route
        path="/quests"
        element={
          <PrivateRoute>
            <LayoutWithNav>
              <QuestDashboard />
            </LayoutWithNav>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
