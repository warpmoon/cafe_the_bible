import {
  BrowserRouter as Router,
  Navigate,
  Routes,
  Route,
} from "react-router-dom";
import AppLayout from "./components/Layout/AppLayout";
import HomePage from "./pages/HomePage";
import TodayPage from "./pages/TodayPage/TodayPage";
import ReadingPage from "./pages/ReadingPage/ReadingPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import BookmarkPage from "./pages/BookmarkPage/BookmarkPage";
import MapPage from "./pages/MapPage/MapPage";
import ReferencePeoplePage from "./pages/ReferencePeoplePage/ReferencePeoplePage";
import ReferenceFestivalsPage from "./pages/ReferenceFestivalsPage/ReferenceFestivalsPage";

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/today" element={<TodayPage />} />
          <Route path="/read" element={<ReadingPage />} />
          <Route path="/read/:bookId" element={<ReadingPage />} />
          <Route path="/read/:bookId/:chapter" element={<ReadingPage />} />
          <Route path="/read/:bookId/:chapter/:verse" element={<ReadingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/bookmarks" element={<BookmarkPage />} />
          <Route path="/map" element={<Navigate to="/reference/map" replace />} />
          <Route path="/reference" element={<Navigate to="/reference/map" replace />} />
          <Route path="/reference/map" element={<MapPage />} />
          <Route path="/reference/people" element={<ReferencePeoplePage />} />
          <Route path="/reference/festivals" element={<ReferenceFestivalsPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
