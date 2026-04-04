import { Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen.jsx";
import HostPage from "./screens/HostPage.jsx";
import PlayerPage from "./screens/PlayerPage.jsx";
import SoloPage from "./screens/SoloPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/solo" element={<SoloPage />} />
      <Route path="/host" element={<HostPage />} />
      <Route path="/play" element={<PlayerPage />} />
      <Route path="/play/:code" element={<PlayerPage />} />
    </Routes>
  );
}
