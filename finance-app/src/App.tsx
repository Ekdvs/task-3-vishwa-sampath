import './App.css'
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;