import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { createPortal } from 'react-dom'
import {
    Search, ClipboardList, ShoppingCart, User, LogOut, X, Mail
} from 'lucide-react'

const Navbar = ({ scrolled }) => {
    const { user, logout } = useAuth()
    const { totalItems } = useCart()
    const navigate = useNavigate()

    const [menuOpen, setMenuOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const menuRef = useRef(null)

    // Close the small dropdown when clicking outside it
    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    // Lock page scroll while the profile modal is open
    useEffect(() => {
        document.body.style.overflow = profileOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [profileOpen])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <>
            <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">

                    <div
                        onClick={() => navigate('/marketplace')}
                        className="text-3xl font-extrabold tracking-tight cursor-pointer"
                    >
                        Hyper<span className="text-emerald-600">local</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-3 w-95 h-11 px-4 rounded-xl border border-slate-200">
                        <Search size={18} className="text-slate-400" />

                        <input
                            type="text"
                            placeholder="Search shops, products..."
                            className="flex-1 outline-none text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-8">

                        <button
                            onClick={() => navigate('/customer/orders')}
                            className="flex items-center gap-2 text-[15px] font-semibold text-slate-800 hover:text-emerald-600 transition"
                        >
                            <ClipboardList size={19} />
                            My Orders
                        </button>

                        <button
                            onClick={() => navigate('/cart')}
                            className="relative flex items-center gap-2 text-[15px] font-semibold text-slate-800 hover:text-emerald-600 transition"
                        >
                            <ShoppingCart size={19} />
                            Cart

                            {totalItems > 0 && (
                                <span className="absolute -top-2 left-3 min-w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {user ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setMenuOpen(v => !v)}
                                    className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition flex items-center justify-center"
                                >
                                    <User size={18} className="text-slate-700" />
                                </button>

                                {menuOpen && (
                                    <div className="absolute right-0 top-14 w-72 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                                        <div className="p-5 flex gap-4 border-b border-slate-100">
                                            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center">
                                                {user?.name?.[0]?.toUpperCase()}
                                            </div>

                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    {user?.name}
                                                </p>

                                                <p className="text-sm text-slate-500">
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            className="w-full px-5 py-3 flex items-center gap-3 text-slate-700 hover:bg-slate-50 transition"
                                            onClick={() => {
                                                setMenuOpen(false);
                                                setProfileOpen(true);
                                            }}
                                        >
                                            <User size={15} />
                                            View Profile
                                        </button>

                                        <button
                                            className="w-full px-5 py-3 flex items-center gap-3 text-red-500 hover:bg-red-50 transition"
                                            onClick={handleLogout}
                                        >
                                            <LogOut size={15} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
                                onClick={() => navigate('/login')}
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {profileOpen && user && createPortal(
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-100"
                    onClick={() => setProfileOpen(false)}
                >
                    <div
                        className="bg-white w-full max-w-md rounded-3xl p-8 relative shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-5 right-5 text-slate-500 hover:text-slate-900"
                            onClick={() => setProfileOpen(false)}
                        >
                            <X size={18} />
                        </button>

                        <div className="w-24 h-24 rounded-full bg-emerald-600 text-white text-3xl font-bold flex items-center justify-center mx-auto">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>

                        <h2 className="text-2xl font-bold text-center mt-5 text-slate-900">
                            {user?.name}
                        </h2>

                        <div className="flex items-center justify-center gap-2 text-slate-500 mt-2">
                            <Mail size={14} />
                            {user?.email}
                        </div>

                        {user?.role && (
                            <span className="block text-center mt-4 text-sm font-medium text-emerald-600">
                                {user.role}
                            </span>
                        )}

                        <button
                            className="w-full mt-8 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 transition"
                            onClick={handleLogout}
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default Navbar