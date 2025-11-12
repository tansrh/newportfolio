"use client";
import { use, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.scss";
import Link from "next/link";
import { openModal } from "@/store/slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/utils/apiRequest';
import { logout } from "@/store/slices/authSlice";
import Error from "@/app/error";
import { useToast } from "../ToastProvider";

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const isUserLoggedIn = useSelector((state: any) => state.auth.loggedIn);
  const { addToast } = useToast();
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/logout', 'POST');
    },
    onSuccess: () => {
      // Optionally clear localStorage, update redux, redirect, etc.
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      dispatch(logout());
      addToast("Logged out successfully");
    },
    onError: (err: any) => {
      addToast(err.message || "Logout failed");
    }
  });

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {

      if (hamburgerRef.current && !hamburgerRef.current.contains(event.target as Node) && dropdownRef && !dropdownRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [setOpen]);



  return (
    <nav className={styles.navbar}>
      <div style={{ display: "flex", justifyContent: 'space-between', width: '100%' }}>
        <ul className={styles.menu}>
          <li className={pathname === "/" ? styles.active : ""}><Link href="/">About Me</Link></li>
          <li className={pathname === "/blogs" ? styles.active : ""}><Link href="/blogs">Blogs</Link></li>
        </ul>
        <ul className={styles.menu}>
          {
            isUserLoggedIn ? (
              <li><span onClick={() => logoutMutation.mutate()} style={{ cursor: 'pointer' }}>Logout</span></li>
            ) : (
              <li onClick={() => { dispatch(openModal({ content: 'Login' })) }} ><span>Login</span></li>
            )
          }
        </ul>
      </div>
      <button
        className={styles.hamburger}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle menu"
        ref={hamburgerRef}
      >
        <span />
        <span />
        <span />
      </button>
      {open && (
        <div className={styles.dropdown} ref={dropdownRef}>
          <ul>
            <li className={pathname === "/" ? styles.activeDropdown : ""}><Link href="/">About Me</Link></li>
            <li className={pathname === "/blogs" ? styles.activeDropdown : ""}><Link href="/blogs">Blogs</Link></li>
            {isUserLoggedIn ? (
              <li><span onClick={() => logoutMutation.mutate()} style={{ cursor: 'pointer' }}>Logout</span></li>
            ) : (
              <li onClick={() => { dispatch(openModal({ content: 'Login' })) }} ><span>Login</span></li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
