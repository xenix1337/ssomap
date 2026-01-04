import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./Home";
import Guessr from "./Guessr";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_STATIC_URL}/data.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error("Błąd pobierania danych: " + error.message);
      });
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home data={data} />} />
          <Route path="/guessr" element={<Guessr data={data} />} />
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-center"
        autoClose={3500}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
        transition={Zoom}
      />
    </>
  );
}

export default App;
