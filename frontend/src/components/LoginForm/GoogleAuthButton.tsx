import { GoogleLogin } from '@react-oauth/google';

import { api } from '../../services/api';
import styles from './GoogleAuthButton.module.css';

type Props = {
  onDone: (token: string) => void;
  onError: (message: string) => void;
};

export const GoogleAuthButton = ({ onDone, onError }: Props) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <div className={styles.wrap}>
        <div className={styles.divider}>
          <div className={styles.line} />
          <span className={styles.text}>Hoặc</span>
          <div className={styles.line} />
        </div>
        <div className={styles.notice}>
          Chưa cấu hình Google OAuth. Thêm biến môi trường VITE_GOOGLE_CLIENT_ID và khởi động lại.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.divider}>
        <div className={styles.line} />
        <span className={styles.text}>Hoặc</span>
        <div className={styles.line} />
      </div>

      <div className={styles.googleBtn}>
        <GoogleLogin
          useOneTap
          onSuccess={async (credentialResponse) => {
            try {
              const credential = credentialResponse.credential;
              if (!credential) return onError('KhĂ´ng nháº­n Ä‘Æ°á»£c credential tá»« Google.');

              const data = await api.post<{ token?: string; message?: string }>(
                '/auth/google',
                { credential }
              );

              if (!data.token) return onError(data.message || 'ÄÄƒng nháº­p Google tháº¥t báº¡i.');
              onDone(data.token);
            } catch (e: any) {
              onError(e?.message || 'ÄÄƒng nháº­p Google tháº¥t báº¡i.');
            }
          }}
          onError={() => onError('ÄÄƒng nháº­p Google tháº¥t báº¡i.')}
          theme="filled_black"
          text="continue_with"
          shape="pill"
        />
      </div>
    </div>
  );
};
