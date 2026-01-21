import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/logo/logo.png';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={logo} alt="ChatSF Logo" className={styles.logoImage} />
          <span className={styles.logoText}>ChatSF</span>
        </div>
        {user && (
          <div className={styles.userSection}>
            <span className={styles.userEmail}>{user.email}</span>
            <button onClick={logout} className={styles.logoutBtn}>
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
