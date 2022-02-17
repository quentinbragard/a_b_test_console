import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';
import { ExperimentContextProvider } from './components/ExperimentContext.jsx';
import App from './components/App.jsx';

ReactDOM.render(
  <React.StrictMode>
    <ExperimentContextProvider>
      <App />
    </ExperimentContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
