import { Link } from 'react-router-dom'
import {
  MapPin,
  Phone,
  Mail,
  ShoppingBasket,
  Milk,
  Apple,
  Croissant,
  Send,
  AtSign,
  ArrowUpRight
} from "lucide-react";

const CATEGORY_LINKS = [
  { label: 'Grocery', value: 'grocery' },
  { label: 'Food', value: 'food' },
  { label: 'Fruits', value: 'fruit' },
  { label: 'Bakery', value: 'bakery' },
  { label: 'Dairy', value: 'dairy' },
  { label: 'Stationery', value: 'stationary' },
]

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="hl-footer">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .hl-footer {
          font-family: 'Inter', sans-serif;
          background: #0f172a;
          color: #cbd5e1;
          position: relative;
          overflow: hidden;
        }

        .hl-footer::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #22c55e, #16a34a 40%, #0f172a 100%);
        }

        .hl-footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 56px 24px 28px;
        }

        .hl-footer-top {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
          gap: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .hl-brand-logo {
          font-size: 22px;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.8px;
          margin-bottom: 14px;
        }
        .hl-brand-logo em { color: #22c55e; font-style: normal; }

        .hl-brand-tag {
          font-size: 13.5px;
          line-height: 1.65;
          color: #94a3b8;
          max-width: 280px;
          margin-bottom: 20px;
        }

        .hl-basket-row {
          display: flex;
          gap: 10px;
        }
        .hl-basket-chip {
          width: 34px; height: 34px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
        }

        .hl-col-title {
          font-size: 12.5px;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 18px;
        }

        .hl-link-list {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }
        .hl-link {
          font-size: 13.5px;
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          width: fit-content;
        }
        .hl-link:hover { color: #fff; }
        .hl-link .dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .hl-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13.5px;
          color: #94a3b8;
          margin-bottom: 14px;
        }
        .hl-contact-icon {
          width: 28px; height: 28px;
          border-radius: 8px;
          background: rgba(34,197,94,0.12);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .hl-vendor-cta {
          margin-top: 6px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #22c55e;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.25);
          padding: 9px 14px;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.15s;
        }
        .hl-vendor-cta:hover {
          background: #22c55e;
          color: #0f172a;
        }

        .hl-footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          padding-top: 24px;
        }

        .hl-copyright {
          font-size: 12.5px;
          color: #64748b;
        }
        .hl-copyright strong { color: #94a3b8; }

        .hl-socials {
          display: flex;
          gap: 10px;
        }
        .hl-social-btn {
          width: 34px; height: 34px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          color: #94a3b8;
          transition: all 0.15s;
          cursor: pointer;
        }
        .hl-social-btn:hover {
          background: #22c55e;
          color: #0f172a;
          border-color: #22c55e;
        }

        @media (max-width: 860px) {
          .hl-footer-top {
            grid-template-columns: 1fr 1fr;
            gap: 32px 24px;
          }
        }
        @media (max-width: 560px) {
          .hl-footer-top { grid-template-columns: 1fr; }
          .hl-footer-bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="hl-footer-inner">
        <div className="hl-footer-top">

          {/* Brand */}
          <div>
            <div className="hl-brand-logo">Hyper<em>local</em></div>
            <p className="hl-brand-tag">
              Groceries, fruits, dairy and daily essentials from verified shops
              in your neighbourhood — delivered fast, every time.
            </p>
            <div className="hl-basket-row">
              <div className="hl-basket-chip"><ShoppingBasket size={15} color="#22c55e" /></div>
              <div className="hl-basket-chip"><Milk size={15} color="#60a5fa" /></div>
              <div className="hl-basket-chip"><Apple size={15} color="#f87171" /></div>
              <div className="hl-basket-chip"><Croissant size={15} color="#fbbf24" /></div>
            </div>
          </div>

          {/* Shop by category */}
          <div>
            <div className="hl-col-title">Shop by category</div>
            <div className="hl-link-list">
              {CATEGORY_LINKS.map(cat => (
                <Link key={cat.value} to="/marketplace" className="hl-link">
                  <span className="dot" style={{ background: '#22c55e' }} />
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div className="hl-col-title">Quick links</div>
            <div className="hl-link-list">
              <Link to="/marketplace" className="hl-link">
                <span className="dot" style={{ background: '#475569' }} />
                Browse marketplace
              </Link>
              <Link to="/customer/orders" className="hl-link">
                <span className="dot" style={{ background: '#475569' }} />
                My orders
              </Link>
              <Link to="/cart" className="hl-link">
                <span className="dot" style={{ background: '#475569' }} />
                My cart
              </Link>
              <Link to="/vendor/dashboard" className="hl-link">
                <span className="dot" style={{ background: '#475569' }} />
                Vendor dashboard
              </Link>
            </div>
          </div>

          {/* Contact + vendor CTA */}
          <div>
            <div className="hl-col-title">Get in touch</div>
            <div className="hl-contact-item">
              <div className="hl-contact-icon"><MapPin size={13} color="#22c55e" /></div>
              <span>Serving neighbourhoods within 10 km of your location</span>
            </div>
            <div className="hl-contact-item">
              <div className="hl-contact-icon"><Mail size={13} color="#22c55e" /></div>
              <span>support@hyperlocal.app</span>
            </div>
            <div className="hl-contact-item">
              <div className="hl-contact-icon"><Phone size={13} color="#22c55e" /></div>
              <span>+91 8917359201</span>
            </div>

            <Link to="/vendor/create-shop" className="hl-vendor-cta">
              See on Hyperlocal
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        <div className="hl-footer-bottom">
          <p className="hl-copyright">
            © {year} <strong>Hyperlocal</strong>. All rights reserved.
          </p>
          <div className="hl-socials">
            <a className="hl-social-btn" href="#" aria-label="Instagram"><AtSign size={15} /></a>
            <a className="hl-social-btn" href="#" aria-label="Twitter"><Send size={15} /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer