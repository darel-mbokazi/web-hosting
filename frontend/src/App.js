import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RegisterDomain from './pages/RegisterDomain'
import TransferDomain from './pages/TransferDomain'
import WebHosting from './pages/WebHosting'
import AddonPlans from './pages/AddonPlans'
import MalwareScanner from './pages/MalwareScanner'
import DomainReseller from './pages/DomainReseller'
import HostingReseller from './pages/HostingReseller'
import OpenTicket from './pages/OpenTicket'
import AboutUs from './pages/AboutUs'
import Login from './pages/Login'
import NoPage from './pages/NoPage'
import Whois from './pages/Whois'
import Account from './pages/Account'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AdminRoute from './components/AdminRoute'
import AdminDashboard from './pages/admin/AdminDashboard'
import UsersPage from './pages/admin/UsersPage'
import OrdersPage from './pages/admin/OrdersPage'
import InvoicesPage from './pages/admin/InvoicesPage'
import HostingPage from './pages/admin/HostingPage'
import AddonsPage from './pages/admin/AddonsPage'
import SupportRoute from './components/SupportRoute'
import SupportDashboard from './pages/support/SupportDashboard'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import TicketList from './pages/TicketList'
import { Toaster } from 'react-hot-toast'
import Help from './pages/Help'
import SecuritySettings from './pages/SecuritySettings'
import WordPress from './pages/WordPress'
import WordPressPage from './pages/admin/WordPressPage'
import PaymentSuccess from './pages/PaymentSuccess'
import Orders from './pages/Orders'
import AdminHomePage from './components/AdminHomePage'

function App() {
  return (
    <div className="pt-28">
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }>
            {/* render inside the Outlet */}
            <Route path="users" element={<UsersPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="hosting" element={<HostingPage />} />
            <Route path="wordpress" element={<WordPressPage />} />
            <Route path="addons" element={<AddonsPage />} />

            <Route index element={<AdminHomePage />} />
          </Route>

          {/* support */}
          <Route
            path="/support"
            element={
              <SupportRoute>
                <SupportDashboard />
              </SupportRoute>
            }
          />

          {/* Users */}
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/register-domain" element={<RegisterDomain />} />
          <Route path="/transfer-domain" element={<TransferDomain />} />
          <Route path="/web-hosting" element={<WebHosting />} />
          <Route path="/wordpress-hosting" element={<WordPress />} />
          <Route path="/addons" element={<AddonPlans />} />
          <Route path="/whois-domain" element={<Whois />} />
          <Route path="/malware-scanner" element={<MalwareScanner />} />
          <Route path="/domain-reseller" element={<DomainReseller />} />
          <Route path="/hosting-reseller" element={<HostingReseller />} />
          <Route path="/open-ticket" element={<OpenTicket />} />
          <Route path="/tickets" element={<TicketList />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/security-settings" element={<SecuritySettings />} />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}

export default App
