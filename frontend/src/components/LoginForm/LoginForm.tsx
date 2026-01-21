import type { FormEvent, InputHTMLAttributes } from 'react';
import { useMemo, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

import logo from '../../assets/logo/logo.png';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { GoogleAuthButton } from './GoogleAuthButton';
import styles from './LoginForm.module.css';

type Mode = 'login' | 'register';
type RegisterStep = 'form' | 'otp';
type ForgotStep = 'email' | 'otp';

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  autoComplete?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  showToggle?: boolean;
  showValidation?: boolean;
  isValid?: boolean;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
};

type TabsProps = {
  mode: Mode;
  onChange: (mode: Mode) => void;
};

type LoginFieldsProps = {
  email: string;
  password: string;
  loading: boolean;
  showPassword: boolean;
  onTogglePassword: () => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onForgot: () => void;
};

type RegisterFieldsProps = {
  email: string;
  password: string;
  confirmPassword: string;
  passwordOk: boolean;
  loading: boolean;
  showPassword: boolean;
  showConfirm: boolean;
  onTogglePassword: () => void;
  onToggleConfirm: () => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
};

type OtpFieldsProps = {
  email: string;
  otp: string;
  loading: boolean;
  onOtpChange: (value: string) => void;
  onBack: () => void;
  onSubmit: (e: FormEvent) => void;
};

const isStrongPassword = (password: string) =>
  password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);

const TextField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  inputMode,
  showToggle = false,
  showValidation = false,
  isValid,
  isVisible = false,
  onToggleVisibility
}: FieldProps) => (
  <div className={styles.inputGroup}>
    <label htmlFor={id}>{label}</label>
    <div className={styles.inputWrapper}>
      <input
        id={id}
        type={showToggle && isVisible ? 'text' : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        required
        className={`${styles.input} ${showValidation ? (isValid ? styles.valid : styles.invalid) : ''}`}
      />
      {showToggle && (
        <button
          type="button"
          className={styles.eyeBtn}
          onClick={onToggleVisibility}
          aria-label="Hiển thị / ẩn mật khẩu"
        >
          {isVisible ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
        </button>
      )}
    </div>
  </div>
);

const AuthTabs = ({ mode, onChange }: TabsProps) => (
  <div className={styles.tabs}>
    <button
      type="button"
      className={`${styles.tab} ${mode === 'login' ? styles.activeTab : ''}`}
      onClick={() => onChange('login')}
    >
      Đăng nhập
    </button>
    <button
      type="button"
      className={`${styles.tab} ${mode === 'register' ? styles.activeTab : ''}`}
      onClick={() => onChange('register')}
    >
      Đăng ký
    </button>
  </div>
);

const LoginFields = ({
  email,
  password,
  loading,
  showPassword,
  onTogglePassword,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onForgot
}: LoginFieldsProps) => (
  <form onSubmit={onSubmit} className={styles.form}>
    <TextField
      id="email"
      label="Email"
      type="email"
      value={email}
      onChange={onEmailChange}
      placeholder="hello@chatsf.ai"
      autoComplete="email"
    />

    <TextField
      id="password"
      label="Mật khẩu"
      type="password"
      value={password}
      onChange={onPasswordChange}
      placeholder="Nhập mật khẩu"
      autoComplete="current-password"
      showToggle
      showValidation
      isValid={password.length >= 8}
      isVisible={showPassword}
      onToggleVisibility={onTogglePassword}
    />

    <div className={styles.actions}>
      <button type="button" className={styles.linkButton} onClick={onForgot}>
        Quên mật khẩu?
      </button>
    </div>

    <button type="submit" disabled={loading} className={styles.submitButton}>
      {loading ? 'Đang xử lý...' : 'Đăng nhập'}
    </button>
  </form>
);

const RegisterFields = ({
  email,
  password,
  confirmPassword,
  passwordOk,
  loading,
  showPassword,
  showConfirm,
  onTogglePassword,
  onToggleConfirm,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit
}: RegisterFieldsProps) => (
  <form onSubmit={onSubmit} className={styles.form}>
    <TextField
      id="emailR"
      label="Email"
      type="email"
      value={email}
      onChange={onEmailChange}
      placeholder="hello@chatsf.ai"
      autoComplete="email"
    />

    <TextField
      id="passwordR"
      label="Mật khẩu"
      type="password"
      value={password}
      onChange={onPasswordChange}
      placeholder="Ít nhất 8 ký tự, có HOA/thường/số"
      autoComplete="new-password"
      showToggle
      showValidation
      isValid={passwordOk}
      isVisible={showPassword}
      onToggleVisibility={onTogglePassword}
    />
    <div className={styles.hintRow}>
      <span className={`${styles.badge} ${passwordOk ? styles.ok : styles.bad}`}>
        {passwordOk ? 'Mật khẩu mạnh' : 'Yêu cầu: 8+ ký tự, HOA + thường + số'}
      </span>
    </div>

    <TextField
      id="confirmPassword"
      label="Xác nhận mật khẩu"
      type="password"
      value={confirmPassword}
      onChange={onConfirmPasswordChange}
      placeholder="Nhập lại mật khẩu"
      autoComplete="new-password"
      showToggle
      showValidation
      isValid={confirmPassword.length > 0 && confirmPassword === password}
      isVisible={showConfirm}
      onToggleVisibility={onToggleConfirm}
    />

    <button type="submit" disabled={loading} className={styles.submitButton}>
      {loading ? 'Đang gửi OTP...' : 'Gửi mã OTP'}
    </button>
  </form>
);

const OtpFields = ({ email, otp, loading, onOtpChange, onBack, onSubmit }: OtpFieldsProps) => (
  <form onSubmit={onSubmit} className={styles.form}>
    <div className={styles.otpInfo}>
      Mã OTP đã được gửi tới <b>{email}</b>. Vui lòng nhập mã để hoàn tất đăng ký.
    </div>

    <TextField
      id="otp"
      label="Mã OTP"
      value={otp}
      onChange={onOtpChange}
      placeholder="Nhập OTP (6 số)"
      inputMode="numeric"
    />

    <button type="submit" disabled={loading} className={styles.submitButton}>
      {loading ? 'Đang xác thực...' : 'Xác thực & Tạo tài khoản'}
    </button>

    <button type="button" className={styles.secondaryBtn} onClick={onBack}>
      Quay lại
    </button>
  </form>
);

export const LoginForm = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [step, setStep] = useState<RegisterStep>('form');
  const [forgotStep, setForgotStep] = useState<ForgotStep>('email');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const passwordOk = useMemo(() => isStrongPassword(password), [password]);

  const resetRegisterState = () => {
    setStep('form');
    setOtp('');
    setPassword('');
    setConfirmPassword('');
  };

  const resetForgotState = () => {
    setForgotStep('email');
    setForgotEmail('');
    setForgotOtp('');
    setForgotNewPassword('');
    setForgotConfirmPassword('');
    setForgotError('');
    setForgotSuccess('');
  };

  const onGoogleDone = (token: string) => {
    localStorage.setItem('token', token);
    window.location.href = '/chat';
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      await login({ email, password });
      setSuccessMessage('Đăng nhập thành công! Đang chuyển đến trang trò chuyện...');
      setTimeout(() => navigate('/chat'), 800);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Đã xảy ra lỗi.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotRequestOtp = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(forgotEmail)) {
      setForgotError('Email không hợp lệ.');
      return;
    }
    setForgotLoading(true);
    try {
      await api.post<{ ok?: boolean; message?: string }>('/auth/password/request-otp', {
        email: forgotEmail
      });
      setForgotSuccess('Đã gửi OTP. Vui lòng kiểm tra email.');
      setForgotStep('otp');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể gửi OTP.';
      setForgotError(message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotReset = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (!isStrongPassword(forgotNewPassword)) {
      setForgotError('Mật khẩu phải >= 8 ký tự, có chữ hoa, chữ thường và số.');
      return;
    }

    setForgotLoading(true);
    try {
      await api.post<{ ok?: boolean; message?: string }>('/auth/password/reset', {
        email: forgotEmail,
        newPassword: forgotNewPassword,
        otp: forgotOtp
      });
      setForgotSuccess('Đặt lại mật khẩu thành công. Bạn có thể đăng nhập.');
      setTimeout(() => {
        setShowForgotModal(false);
        resetForgotState();
      }, 900);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể đặt lại mật khẩu.';
      setForgotError(message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleRequestOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (!passwordOk) {
      setError('Mật khẩu phải >= 8 ký tự, có chữ hoa, chữ thường và số.');
      return;
    }

    setLoading(true);
    try {
      const out = await api.post<{ ok?: boolean; message?: string }>(
        '/auth/register/request-otp',
        { email }
      );
      if (!out.ok) {
        setError(out.message || 'Không thể gửi OTP.');
        return;
      }
      setStep('otp');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể gửi OTP.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      const out = await api.post<{ token?: string; message?: string }>(
        '/auth/register/confirm',
        { email, password, otp }
      );
      if (!out.token) {
        setError(out.message || 'OTP không đúng hoặc đã hết hạn.');
        return;
      }
      localStorage.setItem('token', out.token);
      setSuccessMessage('Đăng ký thành công! Đang chuyển đến trang trò chuyện...');
      setTimeout(() => navigate('/chat'), 800);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'OTP không đúng hoặc đã hết hạn.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.shell}>
      {successMessage && (
        <div className={styles.modal}>
          <div className={styles.modalCard}>
            <div className={styles.modalTitle}>Thành công</div>
            <p className={styles.modalText}>{successMessage}</p>
          </div>
        </div>
      )}
      {showForgotModal && (
        <div className={styles.modal}>
          <div className={styles.modalCard}>
            <div className={styles.modalTitle}>Quên mật khẩu</div>
            <p className={styles.modalText}>
              Nhập email để nhận mã OTP đặt lại mật khẩu. Sau khi xác thực OTP, bạn sẽ đặt mật khẩu mới.
            </p>
            {forgotError && <div className={styles.error}>{forgotError}</div>}
            {forgotSuccess && <div className={styles.success}>{forgotSuccess}</div>}

            {forgotStep === 'email' ? (
              <form onSubmit={handleForgotRequestOtp} className={styles.form}>
                <TextField
                  id="forgotEmail"
                  label="Email"
                  type="email"
                  value={forgotEmail}
                  onChange={setForgotEmail}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => {
                      setShowForgotModal(false);
                      resetForgotState();
                    }}
                  >
                    Đóng
                  </button>
                  <button type="submit" disabled={forgotLoading} className={styles.submitButton}>
                    {forgotLoading ? 'Đang gửi...' : 'Gửi OTP'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotReset} className={styles.form}>
                <TextField
                  id="otpReset"
                  label="Mã OTP"
                  value={forgotOtp}
                  onChange={setForgotOtp}
                  placeholder="Nhập OTP 6 số"
                  inputMode="numeric"
                  showValidation
                  isValid={forgotOtp.length >= 4}
                />
                <TextField
                  id="newPassword"
                  label="Mật khẩu mới"
                  type="password"
                  value={forgotNewPassword}
                  onChange={setForgotNewPassword}
                  placeholder="Ít nhất 8 ký tự, HOA/thường/số"
                  autoComplete="new-password"
                  showToggle
                  showValidation
                  isValid={isStrongPassword(forgotNewPassword)}
                  isVisible={showRegisterPassword}
                  onToggleVisibility={() => setShowRegisterPassword((v) => !v)}
                />
                <TextField
                  id="confirmNewPassword"
                  label="Xác nhận mật khẩu mới"
                  type="password"
                  value={forgotConfirmPassword}
                  onChange={setForgotConfirmPassword}
                  placeholder="Nhập lại mật khẩu"
                  autoComplete="new-password"
                  showToggle
                  showValidation
                  isValid={
                    forgotConfirmPassword.length > 0 &&
                    forgotConfirmPassword === forgotNewPassword
                  }
                  isVisible={showConfirmPassword}
                  onToggleVisibility={() => setShowConfirmPassword((v) => !v)}
                />
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => {
                      setShowForgotModal(false);
                      resetForgotState();
                    }}
                  >
                    Đóng
                  </button>
                  <button type="submit" disabled={forgotLoading} className={styles.submitButton}>
                    {forgotLoading ? 'Đang đặt lại...' : 'Xác nhận'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      <div className={styles.glowOne} />
      <div className={styles.glowTwo} />
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.brandRow}>
            <div className={styles.brandLogo}>
              <img src={logo} alt="ChatSF" />
            </div>
            <div className={styles.brandText}>
              <p className={styles.kicker}>Đăng nhập vào tài khoản</p>
              <h1 className={styles.title}>Xin chào bạn quay trở lại</h1>
            </div>
          </div>
          <p className={styles.subtitle}>Nhập thông tin để tiếp tục trò chuyện cùng ChatSF.</p>
        </div>

        <AuthTabs
          mode={mode}
          onChange={(nextMode) => {
            setMode(nextMode);
            setError('');
            resetRegisterState();
          }}
        />

        {error && <div className={styles.error}>{error}</div>}

        {mode === 'login' ? (
          <LoginFields
            email={email}
            password={password}
            loading={loading}
            showPassword={showLoginPassword}
            onTogglePassword={() => setShowLoginPassword((v) => !v)}
            onForgot={() => {
              setShowForgotModal(true);
              resetForgotState();
              setForgotEmail(email || '');
            }}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleLogin}
          />
        ) : step === 'form' ? (
          <RegisterFields
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            passwordOk={passwordOk}
            loading={loading}
          showPassword={showRegisterPassword}
          showConfirm={showConfirmPassword}
          onTogglePassword={() => setShowRegisterPassword((v) => !v)}
          onToggleConfirm={() => setShowConfirmPassword((v) => !v)}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onSubmit={handleRequestOtp}
          />
        ) : (
          <OtpFields
            email={email}
            otp={otp}
            loading={loading}
            onOtpChange={setOtp}
            onBack={() => {
              setStep('form');
              setOtp('');
              setError('');
            }}
            onSubmit={handleConfirmOtp}
          />
        )}

        <div className={styles.googleWrap}>
          <GoogleAuthButton onDone={onGoogleDone} onError={(m) => setError(m)} />
        </div>
      </div>
    </div>
  );
};
