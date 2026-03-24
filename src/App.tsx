import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";

import "./App.css";

import RequireAuth from "./routes/RequireAuth";

import { useAuthContext } from "./pages/login/context";
import { Login } from "./pages/login/login";
import NotFound from "./pages/notFound/notFound";
import ResultBulkAvailability from "./pages/tools/consultAvailability/components/bulkAvailability/resultBulkAvailability";
import Clients from "./pages/companys/clientsPJ/clients";
import ClientsPF from "./pages/companys/clientsPF/clientsPF";
import OrdersBandaLargaPJ from "./pages/orders/ordersBandaLargaPJ/ordersBandaLargaPJ";
import OrdersBandaLargaPF from "./pages/orders/ordersBandaLargaPF/ordersBandaLargaPF";

import Contacts from "./pages/messages/contacts";
import ResultAvailability from "./pages/tools/consultAvailability/components/consultAvailability/resultAvailability";
import ResultSearchAvailability from "./pages/tools/consultAvailability/components/searchAvailability/resultSearchAvailability";
import Availability from "./pages/tools/consultAvailability/availability";
import Users from "./pages/management/users/users";
import Partners from "./pages/management/partners/partners";
import UserProfile from "./pages/management/userProfile/userProfile";
import CheckOperadora from "./pages/tools/checkOperadora/checkOperadora";
import CheckAnatel from "./pages/tools/checkAnatel/checkAnatel";
import ZapChecker from "./pages/tools/zapChecker/zapChecker";
import PJChecker from "./pages/tools/pjChecker/pjChecker";
import Base2bSocio from "./pages/tools/base2bSocio/base2bSocio";
import Base2bEmpresa from "./pages/tools/base2bEmpresa/base2bEmpresa";
import MonthOffers from "./pages/offers/monthOffers/monthOffers";
import { Chats } from "./pages/chats/chats";
import Evolution from "./pages/evolution/evolution";
import AdminLayout from "./layouts/adminLayout";
import PublicLayout from "./layouts/publicLayout";
import ProductBL from "./pages/products/productBandaLarga/productBL";

export default function App() {
  const { user, checkAuth } = useAuthContext();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        <Route
          path="/admin"
          element={
            user ? (
              <Navigate to="/admin/pedidos-banda-larga-pj" replace />
            ) : (
              <Login />
            )
          }
        />



        <Route element={<RequireAuth user={user} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/evolution" element={<Evolution />} />
            <Route path="/admin/chats" element={<Chats />} />
            <Route path="/admin/check-operadora" element={<CheckOperadora />} />
            <Route path="/admin/check-anatel" element={<CheckAnatel />} />
            <Route path="/admin/zap-checker" element={<ZapChecker />} />
            <Route path="/admin/pj-checker" element={<PJChecker />} />
            <Route path="/admin/base2b-socio" element={<Base2bSocio />} />
            <Route path="/admin/base2b-empresa" element={<Base2bEmpresa />} />

            <Route
              path="/admin/consulta-disponibilidade"
              element={<Availability />}
            />
            <Route
              path="/admin/consulta-disponibilidade/:cep"
              element={<ResultAvailability />}
            />
            <Route
              path="/admin/consulta-disponibilidade/:cep/:numero"
              element={<ResultAvailability />}
            />
            <Route
              path="/admin/resultado-disponibilidade"
              element={<ResultSearchAvailability />}
            />
            <Route path="/admin/book-de-ofertas" element={<MonthOffers />} />
            <Route path="/admin/contatos" element={<Contacts />} />
            <Route path="/admin/clientes-pj" element={<Clients />} />
            <Route path="/admin/clientes-pf" element={<ClientsPF />} />
            <Route
              path="/admin/pedidos-banda-larga-pj"
              element={<OrdersBandaLargaPJ />}
            />
            <Route
              path="/admin/pedidos-banda-larga-pf"
              element={<OrdersBandaLargaPF />}
            />

            <Route
              path="/admin/produto-banda-larga"
              element={<ProductBL />}
            />


            <Route
              path="/admin/resultado-disponibilidade-massa"
              element={<ResultBulkAvailability />}
            />
            <Route path="/admin/usuarios" element={<Users />} />
            <Route path="/admin/perfil-usuario/:id" element={<UserProfile />} />
            <Route path="/admin/representantes" element={<Partners />} />
          </Route>
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      {/* componente do Toast. Só aparece quando da import no lugar desejado: "import { toast } from "sonner";" */}
      <Toaster
        duration={5000}
        position="bottom-right"
        richColors
        expand={true}
        visibleToasts={6}
        toastOptions={{
          style: {
            pointerEvents: "auto",
          },
        }}
      />
    </Router>
  );
}
