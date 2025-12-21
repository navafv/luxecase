import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';

const Cart = () => <div className="p-10 text-center text-xl">Cart Page (Coming Soon)</div>;
const Login = () => <div className="p-10 text-center text-xl">Login Page (Coming Soon)</div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <footer className="bg-dark text-white text-center p-4 mt-8">
          © 2025 LuxeCase. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;