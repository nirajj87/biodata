import React from 'react';
import BiodataForm from './components/BiodataForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Layout from "./components/Layout";

// This function returns a layout component with a div containing a BiodataForm component
function App() {
  return (
    <Layout>
    <div className="App">
      <BiodataForm />
    </div>
    </Layout>
  );
}

export default App;