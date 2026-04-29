import React from 'react';
import { Link } from 'react-router';

const Footer = () => {
    return (
        <footer className="bg-neutral text-neutral-content border-t border-white/5">
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Brand */}
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <span className="text-lg font-extrabold tracking-tight text-neutral-content">
                            Asset<span className="text-primary">Verse</span>
                        </span>
                        <p className="text-xs text-neutral-content/40">Smart asset management, simplified.</p>
                    </div>

                    {/* Links */}
                    <nav className="flex items-center gap-6 text-sm text-neutral-content/60">
                        <Link to="/aboutUs"  className="hover:text-neutral-content transition-colors">About</Link>
                        <Link to="/contactus"className="hover:text-neutral-content transition-colors">Contact</Link>
                        <Link to="/"         className="hover:text-neutral-content transition-colors">Home</Link>
                    </nav>

                    {/* Social */}
                    <div className="flex items-center gap-3">
                        <a href="#" aria-label="YouTube"
                            className="w-9 h-9 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="fill-current">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                            </svg>
                        </a>
                        <a href="#" aria-label="Facebook"
                            className="w-9 h-9 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="fill-current">
                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-8 pt-6 text-center text-xs text-neutral-content/30">
                    © {new Date().getFullYear()} AssetVerse. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
