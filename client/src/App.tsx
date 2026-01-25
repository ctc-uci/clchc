import { Admin } from "@/components/admin/Admin";
import { CatchAll } from "@/components/CatchAll";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Login } from "@/components/login/Login";
import { Playground } from "@/components/Playground";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ProviderDirectoryPage } from "@/components/provider-directory/ProviderDirectoryPage";
import { QuotaTracking } from "@/components/quota-tracking/QuotaTrackingPage";
import { Signup } from "@/components/signup/Signup";
import { UserDirectory } from "@/components/user-directory/UserDirectoryPage";
import { Settings, PERSONAL_INFO, CALCULATION_FACTOR, DELETE_ACCOUNT } from "@/components/user-settings/Settings";
import { AuthProvider } from "@/contexts/AuthContext";
import { BackendProvider } from "@/contexts/BackendContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { CookiesProvider } from "react-cookie";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

const App = () => {
  return (
    <CookiesProvider>
      <BackendProvider>
        <AuthProvider>
          <RoleProvider>
            <Router>
              <Routes>
                <Route
                  path="/user-directory"
                  element={<UserDirectory />}
                />
                <Route
                  path="/user-settings/personal-info"
                  element={<Settings view={PERSONAL_INFO} />}
                />
                <Route
                  path="/user-settings/delete-account"
                  element={<Settings view={DELETE_ACCOUNT} />}
                />
                <Route
                  path="/user-settings/calculation-factor"
                  element={<Settings view={CALCULATION_FACTOR} />}
                />
                <Route
                  path="/quota-tracking"
                  element={<QuotaTracking />}
                />
                <Route
                  path="/login"
                  element={<Login />}
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
            </Router>
          </RoleProvider>
        </AuthProvider>
      </BackendProvider>
    </CookiesProvider>
  );
};

export default App;
