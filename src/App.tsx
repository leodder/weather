import Layout from "./components/layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./context/theme-provider";
import WeatherDashboard from "./pages/weather-dashboard";
import CityPage from "./pages/city-page";
// import { Button } from './components/ui/button'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark">
        <Layout>
          <Routes>
            <Route path='/' element={<WeatherDashboard />}/>
            <Route path='/city/:cityname' element={<CityPage />}/>
          </Routes>
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
