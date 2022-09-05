import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import styles from "./navigation.module.css";

const Navigation = () => {
  const { data: session, status } = useSession();

  const handleLogout = () => {
    signOut();
  };

  return (
    <header className={styles.header}>
      <Link href="/">
        <a>
          <div className={styles.logo}>Next Auth</div>
        </a>
      </Link>
      <nav>
        <ul>
          {!session && status !== "loading" && (
            <li>
              <Link href="/auth">Login</Link>
            </li>
          )}
          {session && (
            <li>
              <Link href="/profile">Profile</Link>
            </li>
          )}
          {session && (
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
