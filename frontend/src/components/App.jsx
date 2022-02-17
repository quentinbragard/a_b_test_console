import "../styles/app.css";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home.jsx";
import ExpandedExperimentCard from "./ExpandedExperimentCard.jsx";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="experiments/:id" element={<ExpandedExperimentCard />} />
    </Routes>
  </BrowserRouter>
);

// 1) refacto backend pour enoyer un id en Attr
// 2) mettre tous les experiments dans un objet unique
// 3) Au sein de l'ibjet unique, definir { id1: experiment1 , id2: experiment2, ... }
// 4) Refacto ExperimentPanel
// 5) utiliser le hook pour recuperer les params (check react-router-dom)
// 6) dans expandedExperimentCard, tu recup ton exp en faisant selectedExperiment = experiments.find((experiment) => experiment.id == params.id)
// 7) Chaque route experiments/:id pourra être load sous réserve que ton id corresponde

export default App;
