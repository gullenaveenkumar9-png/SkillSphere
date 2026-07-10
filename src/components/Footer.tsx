import React from "react";
import { Flame, Github, Linkedin, ExternalLink } from "lucide-react";

interface FooterProps {
  theme: "light" | "dark";
  onNavigate?: (tab: string, path: string) => void;
  isLoggedIn?: boolean;
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  tabId: string;
  onNavigate?: (tab: string, path: string) => void;
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

// Custom Next-like Link component for SPA routing and clean URL updates
function Link({ to, tabId, onNavigate, children, className, ...props }: LinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(tabId, to);
    }
  };
  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}

export default function Footer({ theme, onNavigate, isLoggedIn }: FooterProps) {
  return (
    <footer 
      id="skillsphere-global-footer"
      className={`border-t transition-all duration-300 relative z-10 ${
        theme === "dark" 
          ? "border-white/5 bg-slate-950 text-slate-400" 
          : "border-slate-200 bg-white text-slate-600"
      } py-12 px-6 md:px-12`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        {/* Brand/Introduction */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-extrabold text-sm">
              <Flame className="w-4 h-4" />
            </div>
            <span className={`font-black text-lg ${
              theme === "dark" ? "text-slate-100" : "text-slate-800"
            }`}>
              SkillSphere
            </span>
          </div>
          <p className="text-xs leading-relaxed font-medium">
            SkillSphere – Student Skill Exchange Platform
          </p>
          <p className="text-[11px] leading-relaxed opacity-80">
            Empowering students to share knowledge, exchange practical technical skills, level up academic achievements, and collaborate in peer mentorship.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${
            theme === "dark" ? "text-slate-200" : "text-slate-800"
          }`}>
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            <li>
              <Link 
                id="footer-link-home"
                to="/"
                tabId="Landing"
                onNavigate={onNavigate}
                className="hover:text-indigo-400 cursor-pointer transition-colors text-left"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                id="footer-link-explore"
                to={isLoggedIn ? "/skills" : "/"}
                tabId={isLoggedIn ? "Skills" : "Landing"}
                onNavigate={onNavigate}
                className="hover:text-indigo-400 cursor-pointer transition-colors text-left"
              >
                Explore Skills
              </Link>
            </li>
            <li>
              <Link 
                id="footer-link-students"
                to={isLoggedIn ? "/discover" : "/"}
                tabId={isLoggedIn ? "Discover" : "Landing"}
                onNavigate={onNavigate}
                className="hover:text-indigo-400 cursor-pointer transition-colors text-left"
              >
                Find Students
              </Link>
            </li>
            <li>
              <Link 
                id="footer-link-dashboard"
                to={isLoggedIn ? "/dashboard" : "/"}
                tabId={isLoggedIn ? "Dashboard" : "Landing"}
                onNavigate={onNavigate}
                className="hover:text-indigo-400 cursor-pointer transition-colors text-left"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                id="footer-link-about"
                to="/about"
                tabId="About"
                onNavigate={onNavigate}
                className="hover:text-indigo-400 cursor-pointer transition-colors text-left"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link 
                id="footer-link-contact"
                to="/contact"
                tabId="Contact"
                onNavigate={onNavigate}
                className="hover:text-indigo-400 cursor-pointer transition-colors text-left"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div>
          <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${
            theme === "dark" ? "text-slate-200" : "text-slate-800"
          }`}>
            Resources
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            <li>
              <Link 
                id="footer-link-resources"
                to="/resources"
                tabId="Resources"
                onNavigate={onNavigate}
                className="hover:text-indigo-400 cursor-pointer transition-colors text-left"
              >
                Resources
              </Link>
            </li>
            <li>
              <Link 
                id="footer-link-help"
                to="/help"
                tabId="Help"
                onNavigate={onNavigate}
                className="hover:text-indigo-400 cursor-pointer transition-colors text-left"
              >
                Help Center
              </Link>
            </li>
            <li>
              <Link 
                id="footer-link-faq"
                to="/faq"
                tabId="FAQ"
                onNavigate={onNavigate}
                className="hover:text-indigo-400 cursor-pointer transition-colors text-left"
              >
                FAQs
              </Link>
            </li>
            <li>
              <Link 
                id="footer-link-privacy"
                to="/privacy-policy"
                tabId="Privacy"
                onNavigate={onNavigate}
                className="hover:text-indigo-400 cursor-pointer transition-colors text-left"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link 
                id="footer-link-terms"
                to="/terms"
                tabId="Terms"
                onNavigate={onNavigate}
                className="hover:text-indigo-400 cursor-pointer transition-colors text-left"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Follow Us */}
        <div>
          <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${
            theme === "dark" ? "text-slate-200" : "text-slate-800"
          }`}>
            Follow Us
          </h4>
          <ul className="space-y-3 text-xs">
            <li>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-indigo-400 flex items-center gap-1.5 transition-colors font-semibold"
              >
                <Github className="w-4 h-4 text-slate-400 hover:text-white" />
                <span>GitHub</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-50" />
              </a>
            </li>
            <li>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-indigo-400 flex items-center gap-1.5 transition-colors font-semibold"
              >
                <Linkedin className="w-4 h-4 text-slate-400 hover:text-white" />
                <span>LinkedIn</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-50" />
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Row */}
      <div className={`pt-6 border-t ${
        theme === "dark" ? "border-white/5" : "border-slate-100"
      } flex flex-col md:flex-row justify-between items-center gap-4 text-xs`}>
        <p className="font-medium text-slate-400">
          &copy; 2026 SkillSphere. All Rights Reserved.
        </p>
        <p className={`font-semibold ${
          theme === "dark" ? "text-indigo-400" : "text-indigo-600"
        }`}>
          Designed and Developed by Gulle Naveen Kumar.
        </p>
      </div>
    </footer>
  );
}
