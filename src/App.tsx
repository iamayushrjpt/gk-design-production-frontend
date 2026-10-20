import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import BackToTop from "./components/layout/BackToTop";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Wishlist from "./pages/Wishlist";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";

import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import { AuthProvider } from "./admin/AuthContext";
import ProtectedRoute from "./admin/ProtectedRoute";
import AdminDashboard from "./admin/pages/Dashboard";
import ProductsAdmin from "./admin/pages/ProductsAdmin";
import CategoriesAdmin from "./admin/pages/CategoriesAdmin";
import HomepageCMS from "./admin/pages/HomepageCMS";
import MediaLibrary from "./admin/pages/MediaLibrary";
import InquiriesLog from "./admin/pages/InquiriesLog";
import AdminSettings from "./admin/pages/AdminSettings";

function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-32 text-center flex flex-col items-center gap-4">
      <span className="font-display text-6xl text-gold-deep">404</span>
      <h1 className="font-display text-2xl text-ink">This page doesn't exist</h1>
      <p className="text-stone text-sm">
        The page you're looking for may have moved or been removed.
      </p>
      <a href="/" className="text-sm font-medium text-ink underline underline-offset-4 hover:text-gold-deep">
        Back to homepage
      </a>
    </div>
  );
}

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {/* Public site */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:slug" element={<CategoryDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin dashboard — JWT-protected, wraps everything in AuthProvider */}
          <Route
            path="/admin/*"
            element={
              <AuthProvider>
                <Routes>
                  <Route path="login" element={<AdminLogin />} />
                  <Route
                    path="*"
                    element={
                      <ProtectedRoute>
                        <AdminLayout>
                          <Routes>
                            <Route index element={<AdminDashboard />} />
                            <Route path="products" element={<ProductsAdmin />} />
                            <Route path="categories" element={<CategoriesAdmin />} />
                            <Route path="homepage" element={<HomepageCMS />} />
                            <Route path="media" element={<MediaLibrary />} />
                            <Route path="inquiries" element={<InquiriesLog />} />
                            <Route path="settings" element={<AdminSettings />} />
                          </Routes>
                        </AdminLayout>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </AuthProvider>
            }
          />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
