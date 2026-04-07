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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <BackendProvider>
          <AuthProvider>
            <UserProvider>
              <Router>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/user-directory" element={<UserDirectory />} />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute element={<Settings view={PERSONAL_INFO} />} />
                      }
                    />
                    <Route path="/quota-tracking/:date?" element={<QuotaTracking />} />
                    <Route path="/provider-directory" element={<ProviderDirectoryPage />} />
                    <Route path="/version-log/:date?" element={<VersionLogPage />} />
                  </Route>
                  <Route path="/login" element={<Login />} />
                  <Route path="/pending-approval" element={<PendingApprovalPage />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/playground" element={<Playground />} />
                  <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                  <Route path="/admin" element={<ProtectedRoute element={<Admin />} allowedRoles={"ccm"} />} />
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="*" element={<ProtectedRoute element={<CatchAll />} />} />
                </Routes>
              </Router>
            </UserProvider>
          </AuthProvider>
        </BackendProvider>
      </CookiesProvider>
    </QueryClientProvider>
  );
};

export default App;
