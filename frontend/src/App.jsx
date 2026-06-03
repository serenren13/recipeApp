import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyRecipes from './pages/MyRecipes';
import ProtectedRoute from './components/ProtectedRoute';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import CreateRecipe from './pages/CreateRecipe';
import AdminPage from './pages/Admin';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';

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
        <Route path="/create-recipe" element={<CreateRecipe />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin" element={<MyRecipes />} />
      </Routes>
    </>
  );
}

export default App;