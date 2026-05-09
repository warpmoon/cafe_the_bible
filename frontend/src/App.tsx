import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import AppLayout from "./components/Layout/AppLayout";
import HomePage from "./pages/HomePage";
import TodayPage from "./pages/TodayPage/TodayPage";
import ReadingPage from "./pages/ReadingPage/ReadingPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import BookmarkPage from "./pages/BookmarkPage/BookmarkPage";

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
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
