
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import ProductList from "./components/ProductList";
import 'react-toastify/dist/ReactToastify.css';
import ProductCreate from "./components/ProductCreate";

function App() {
  return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/create" element={<ProductCreate/>}></Route>
            <Route path="/products" element={<ProductList/>}></Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer/>
      </>
  );
}

export default App;
