import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { ToastProvider } from "./context/ToastContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Dashboard/StreamView pull in livekit-client + stompjs — code-split them so
// the landing/auth pages stay fast to first paint.
const Dashboard = lazy(() => import("./pages/Dashboard"));
const StreamView = lazy(() => import("./pages/StreamView"));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
}

// Keying by :id forces a clean remount when navigating from one stream
// straight to another, so StreamView's state never needs an in-effect reset.
function StreamViewRoute() {
  const { id } = useParams();
  return <StreamView key={id} />;
}

function RouteFallback() {
  return (
    <div className="landing grid min-h-screen place-items-center">
      <span className="size-9 rounded-full border-4 border-ink-line border-t-ink [animation:auth-spin_.8s_linear_infinite]" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/stream/:id" element={<ProtectedRoute><StreamViewRoute /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
