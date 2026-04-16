import { CatchAll } from "@/components/CatchAll";
import Layout from "@/components/layout/layout";
import { Login } from "@/components/login/Login";
import { PendingApprovalPage } from "@/components/login/PendingApprovalPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ProviderDirectoryPage } from "@/components/provider-directory/ProviderDirectoryPage";
import { QuotaTracking } from "@/components/quota-tracking/QuotaTrackingPage";
import { UserDirectory } from "@/components/user-directory/UserDirectoryPage";
import { PendingRequestsPage } from "@/components/user-directory/PendingRequestsPage";
import { Settings } from "@/components/user-settings/Settings";
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
                    <Route
                      path="/user-directory"
                      element={
                        <ProtectedRoute
                          element={<UserDirectory />}
                          allowedRoles={["ccm"]}
                        />
                      }
                    />
                    <Route
                      path="/pending-requests"
                      element={
                        <ProtectedRoute
                          element={<PendingRequestsPage />}
                          allowedRoles={["ccm"]}
                        />
                      }
                    />

                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute
                          element={<Settings />}
                          allowedRoles={["viewer"]}
                        />
                      }
                    />
                    <Route
                      path="/quota-tracking/:date?"
                      element={
                        <ProtectedRoute
                          element={<QuotaTracking />}
                          allowedRoles={["viewer"]}
                        />
                      }
                    />
                    <Route
                      path="/provider-directory"
                      element={
                        <ProtectedRoute
                          element={<ProviderDirectoryPage />}
                          allowedRoles={["viewer"]}
                        />
                      }
                    />
                    <Route
                      path="/version-log/:date?"
                      element={
                        <ProtectedRoute
                          element={<VersionLogPage />}
                          allowedRoles={["ccm"]}
                          />
                      }
                    />
                  </Route>
                  <Route
                    path="/login"
                    element={<Login />}
                  />
                  <Route
                    path="/pending-approval"
                    element={
                      <ProtectedRoute
                        element={<PendingApprovalPage />}
                        allowedRoles={["viewer"]}
                      />
                    }
                  />
                  {/* <Route
                    path="/signup"
                    element={<Signup />}
                  /> */}
                  {/* <Route
                    path="/dashboard"
                    element={<ProtectedRoute
                      element={<Dashboard />}
                    />}
                  /> */}
                  <Route
                    path="/version-log"
                    element={
                    <ProtectedRoute
                      element={<VersionLogPage />}
                      allowedRoles={["ccm"]}
                      />
                    }
                  />
                  {/* <Route
                    path="/admin"
                    element={
                      <ProtectedRoute
                        element={<Admin />}
                        allowedRoles={"ccm"}
                      />
                    }
                  /> */}
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
            </UserProvider>
          </AuthProvider>
        </BackendProvider>
      </CookiesProvider>
    </QueryClientProvider>
  );
};

export default App;
