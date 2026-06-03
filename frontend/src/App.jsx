import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import Home from './pages/Home';
import MyRecipes from './pages/MyRecipes';
import ProtectedRoute from './components/ProtectedRoute';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import Recipes from './pages/Recipes';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route
          path="/my-recipes"
          element={
            <ProtectedRoute>
              <MyRecipes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
