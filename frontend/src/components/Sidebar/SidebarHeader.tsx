import logo from '../../assets/logo/icon.png';
import { RiSidebarFoldLine, RiSidebarUnfoldLine } from 'react-icons/ri';
import styles from './Sidebar.module.css';

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

export const SidebarHeader = ({ collapsed, onToggle }: Props) => {
  return (
    <div className={styles.topRow}>
      <div className={styles.brand}>
        <img src={logo} alt="ChatSF" className={styles.brandLogo} />
        {/* {!collapsed && <span className={styles.brandText}>ChatSF</span>} */}
      </div>

      <button className={styles.iconBtn} onClick={onToggle} aria-label="Đóng/mở sidebar">
        {collapsed ? <RiSidebarUnfoldLine size={18} /> : <RiSidebarFoldLine size={18} />}
      </button>
    </div>
  );
};

