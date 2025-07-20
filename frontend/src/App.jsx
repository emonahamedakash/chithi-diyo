import React, { lazy, Suspense } from "react";
import Loading from "./components/layouts/Loading.jsx";
function App() {
  return <Suspense fallback={Loading}></Suspense>;
}

export default App;
