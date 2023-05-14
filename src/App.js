import "./App.css";
import PdfUpload from "./components/PdfUpload";
import Chat from "./components/Chat";
import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <div>
    <h1>Chat with any pdf</h1>
      <Routes>
        <Route path="/" element={<PdfUpload />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
