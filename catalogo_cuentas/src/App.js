import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cuentas from "./pages/Cuentas";
import './App.css';
import GruposCuentas from "./pages/GruposCuentas";
import JerarquiaCuentas from "./pages/Jerarquia";
import EstadosFinancieros from "./pages/EstadosCuentas";
import Impuestos from "./pages/Impuestos";
import AuditoriaCuentas from "./pages/Auditorias";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cuentas" element={<Cuentas />} />
        <Route path="/grupos" element={<GruposCuentas />} />
        <Route path="/jerarquias" element={<JerarquiaCuentas />} />
        <Route path="/estado-financiero" element={<EstadosFinancieros />} />
        <Route path="/impuestos" element={<Impuestos />} />
        <Route path="/auditoria" element={<AuditoriaCuentas />} />
      </Routes>
    </Router>
  );
}

export default App;
