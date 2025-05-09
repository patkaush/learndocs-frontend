
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import ChatWindow from './Chat';

export default function RouterSetup() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/chat/:chatId" element={<ChatWindow />} />
        </Routes>
    </BrowserRouter>
  );
}
