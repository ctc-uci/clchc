import { Admin } from "@/components/admin/Admin";
import { CatchAll } from "@/components/CatchAll";
import { Dashboard } from "@/components/dashboard/Dashboard";
import Layout from "@/components/layout/layout";
import { Login } from "@/components/login/Login";
import { PendingApprovalPage } from "@/components/login/PendingApprovalPage";
import { Playground } from "@/components/Playground";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ProviderDirectoryPage } from "@/components/provider-directory/ProviderDirectoryPage";
import { QuotaTracking } from "@/components/quota-tracking/QuotaTrackingPage";
import { Signup } from "@/components/signup/Signup";
import { UserDirectory } from "@/components/user-directory/UserDirectoryPage";
import { PERSONAL_INFO, Settings } from "@/components/user-settings/Settings";
import { VersionLogPage } from "@/components/version-log/VersionLogPage";
import { AuthProvider } from "@/contexts/AuthContext";
import { BackendProvider } from "@/contexts/BackendContext";
import { UserProvider } from "@/contexts/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion";
import { CookiesProvider } from "react-cookie";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
    <motion.main
      key={location.pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Routes location={location}>
                <Route element={<Layout/>}>
                  <Route
                  path="/user-directory"
                  element={<UserDirectory />}
                  />
                  <Route
                  path="/settings"
                  element={
                    <ProtectedRoute
                      element={<Settings view={PERSONAL_INFO} />}
                    />
                  }
                />
                <Route
                  path="/quota-tracking/:date?"
                  element={<QuotaTracking />}
                  />
                  <Route
                  path="/provider-directory"
                  element={<ProviderDirectoryPage />}
                  />
                  <Route
                  path="/version-log/:date?"
                  element={<VersionLogPage />}
                  />
                </Route>
                <Route
                  path="/login"
                  element={<Login />}
                />
                <Route
                  path="/pending-approval"
                  element={<PendingApprovalPage />}
                />
                <Route
                  path="/pending-approval"
                  element={<PendingApprovalPage />}
                />
                <Route
                  path="/signup"
                  element={<Signup />}
                />
                <Route
                  path="/playground"
                  element={<Playground />}
                />
                <Route
                  path="/dashboard"
                  element={<ProtectedRoute element={<Dashboard />} />}
                />
                <Route
                  path="/provider-directory"
                  element={<ProviderDirectoryPage />}
                />
                <Route
                  path="/version-log"
                  element={<VersionLogPage />}
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute
                      element={<Admin />}
                      allowedRoles={"ccm"}
                    />
                  }
                />
                <Route
                  path="/"
                  element={
                    <Navigate
                      to="/login"
                      replace
                    />
                  }
                />
                <Route
                  path="*"
                  element={<ProtectedRoute element={<CatchAll />} />}
                />
      </Routes>
    </motion.main>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <BackendProvider>
          <AuthProvider>
            <UserProvider>
              <Router>
                <AppRoutes />
              </Router>
            </UserProvider>
          </AuthProvider>
        </BackendProvider>
      </CookiesProvider>
    </QueryClientProvider>
  );
};

export default App;
