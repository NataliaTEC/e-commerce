import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header.jsx";
import Footer from "./components/footer.jsx";
import './App.css';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        {/* Define your routes here */}
      </Routes>

      <Footer />
    </>
  );
}