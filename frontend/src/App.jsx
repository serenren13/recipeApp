import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import RecipeDetail from './pages/RecipeDetail';
import Recipes from './pages/Recipes';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/recipes" element={<Recipes />} />
      </Routes>
    </>
  );
}

export default App;
