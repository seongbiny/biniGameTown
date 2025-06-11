import { BrowserRouter, Routes, Route } from "react-router-dom";

// 페이지 컴포넌트들 import
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import MainPage from "./pages/game/MainPage";
import SelectLevelPage from "./pages/game/SelectLevelPage";
import SelectArtistPage from "./pages/game/SelectArtistPage";
import SelectMemberPage from "./pages/game/SelectMemberPage";
import ReadyPage from "./pages/game/ReadyPage";
import GamePlayPage from "./pages/game/GamePlayPage";
import GameOverPage from "./pages/game/GameOverPage";

// 레이아웃 컴포넌트
import ProtectedRoute from "./components/layout/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 공개 라우트들 */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* 보호된 게임 라우트들 */}
        <Route path="/game" element={<ProtectedRoute />}>
          <Route index element={<MainPage />} />
          <Route path="level" element={<SelectLevelPage />} />
          <Route path="artist" element={<SelectArtistPage />} />
          <Route path="member" element={<SelectMemberPage />} />
          <Route path="ready" element={<ReadyPage />} />
          <Route path="play" element={<GamePlayPage />} />
          <Route path="result" element={<GameOverPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
