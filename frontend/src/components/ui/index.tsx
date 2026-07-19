'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, XCircle, AlertTriangle, Info, X, Loader2,
  ChevronLeft, ChevronRight, Plus, Home, Building2, BookOpen,
  FileQuestion, Users, DollarSign, Clock, AlertCircle,
  Eye, EyeOff, Mail, Lock, ArrowRight, Send, Play,
  Search, Bell, Settings, LogOut, Menu, ChevronDown,
  ChevronUp, Edit, Trash2, MoreVertical, User, Shield
} from 'lucide-react';

// ============================================================================
// TOAST SYSTEM
// ============================================================================

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { ...toast, id }]);
    
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

function ToastIcon({ type }: { type: ToastType }) {
  const icons = {
    success: <CheckCircle size={24} />,
    error: <XCircle size={24} />,
    warning: <AlertTriangle size={24} />,
    info: <Info size={24} />,
  };
  return icons[type];
}

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const bgColors = {
    success: 'bg-gradient-to-r from-green-500 to-green-600',
    error: 'bg-gradient-to-r from-red-500 to-red-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    info: 'bg-gradient-to-r from-blue-500 to-blue-600',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`${bgColors[toast.type]} text-white rounded-xl shadow-2xl overflow-hidden min-w-[350px] max-w-md`}
          >
            <div className="flex items-center gap-4 p-4">
              <div className="flex-shrink-0">
                <ToastIcon type={toast.type} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{toast.title}</p>
                {toast.message && (
                  <p className="text-sm opacity-90 mt-0.5">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: (toast.duration || 5000) / 1000, ease: "linear" }}
              className="h-1 bg-white/30"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// BUTTONS
// ============================================================================

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark shadow-sm',
  secondary: 'bg-secondary text-white hover:bg-secondary-dark',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  ghost: 'text-gray-600 hover:bg-gray-100',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  success: 'bg-green-500 text-white hover:bg-green-600',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
};

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  loading, 
  icon, 
  iconPosition = 'left',
  children, 
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-xl
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : icon && iconPosition === 'left' ? (
        icon
      ) : null}
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
}

// ============================================================================
// INPUT
// ============================================================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, hint, icon, className = '', ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.type === 'password';

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={isPassword && showPassword ? 'text' : props.type}
          className={`
            w-full px-4 py-3 border-2 rounded-xl transition-all
            ${icon ? 'pl-12' : ''}
            ${isPassword ? 'pr-12' : ''}
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
              : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10'}
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {hint && !error && <p className="text-sm text-gray-500">{hint}</p>}
    </div>
  );
}

// ============================================================================
// CARD
// ============================================================================

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      onClick={onClick}
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden
        ${hover ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// BADGE
// ============================================================================

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const badgeStyles: Record<BadgeVariant, string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  gray: 'bg-gray-100 text-gray-700',
};

export function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}

// ============================================================================
// SKELETON
// ============================================================================

interface SkeletonProps {
  variant?: 'text' | 'title' | 'avatar' | 'card' | 'button';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({ variant = 'text', width, height, className = '' }: SkeletonProps) {
  const variants = {
    text: 'h-4 rounded',
    title: 'h-8 rounded',
    avatar: 'w-12 h-12 rounded-full',
    card: 'h-48 rounded-xl',
    button: 'h-10 w-24 rounded-lg',
  };

  return (
    <div 
      className={`animate-pulse bg-gray-200 ${variants[variant]} ${className}`}
      style={{ width, height }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border">
      <div className="h-24 bg-gradient-to-r from-gray-200 to-gray-100 relative">
        <div className="absolute -bottom-6 left-6">
          <div className="w-16 h-16 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
      <div className="pt-10 px-6 pb-6 space-y-3">
        <div className="h-6 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
        <div className="flex gap-3 mt-6">
          <div className="h-10 bg-gray-100 rounded-xl flex-1 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded-xl flex-1 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EMPTY STATE
// ============================================================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center relative"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-6"
      >
        {icon || <BookOpen className="text-gray-400" size={64} />}
      </motion.div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      {description && (
        <p className="text-gray-500 max-w-md mb-8">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} icon={<Plus size={20} />}>
          {action.label}
        </Button>
      )}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary/5 rounded-full blur-2xl" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
    </motion.div>
  );
}

// ============================================================================
// MODAL
// ============================================================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStylesModal = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full ${sizeStylesModal[size]}`}
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {title && (
                <div className="px-6 py-4 border-b flex items-center justify-between">
                  <h2 className="text-lg font-bold">{title}</h2>
                  <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X size={20} />
                  </button>
                </div>
              )}
              <div className="p-6">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// CONFIRM MODAL
// ============================================================================

type ConfirmType = 'warning' | 'danger' | 'success' | 'info';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmType;
  loading?: boolean;
}

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = 'warning',
  loading
}: ConfirmModalProps) {
  const icons = {
    warning: <AlertTriangle className="text-yellow-500" size={48} />,
    danger: <XCircle className="text-red-500" size={48} />,
    success: <CheckCircle className="text-green-500" size={48} />,
    info: <Info className="text-blue-500" size={48} />,
  };

  const bgColors = {
    warning: 'bg-yellow-50 border-yellow-200',
    danger: 'bg-red-50 border-red-200',
    success: 'bg-green-50 border-green-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center p-4">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${bgColors[type]}`}>
          {icons[type]}
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 mb-8">{message}</p>
        <div className="flex gap-3 w-full">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            {cancelText}
          </Button>
          <Button 
            variant={type === 'danger' ? 'danger' : 'primary'} 
            className="flex-1"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ============================================================================
// PROGRESS BAR
// ============================================================================

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ value, max = 100, showLabel, variant = 'primary', size = 'md' }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorStyles = {
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full ${colorStyles[variant]} rounded-full`}
        />
      </div>
      {showLabel && (
        <p className="text-sm text-gray-500 mt-1 text-right">{Math.round(percentage)}%</p>
      )}
    </div>
  );
}

// ============================================================================
// TABS
// ============================================================================

interface TabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px
            ${activeTab === tab.id 
              ? 'border-primary text-primary' 
              : 'border-transparent text-gray-500 hover:text-gray-700'}
          `}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// DROPDOWN
// ============================================================================

interface DropdownProps {
  trigger: React.ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
}

export function Dropdown({ trigger, children, align = 'right' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`
                absolute z-50 mt-2 min-w-[200px] bg-white rounded-xl shadow-xl border py-2
                ${align === 'right' ? 'right-0' : 'left-0'}
              `}
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

interface DropdownItemProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger';
}

export function DropdownItem({ icon, children, onClick, variant = 'default' }: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
        ${variant === 'danger' 
          ? 'text-red-600 hover:bg-red-50' 
          : 'text-gray-700 hover:bg-gray-50'}
      `}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export {
  // Icons
  CheckCircle, XCircle, AlertTriangle, Info, X, Loader2,
  ChevronLeft, ChevronRight, Plus, Home, Building2, BookOpen,
  FileQuestion, Users, DollarSign, Clock, AlertCircle,
  Eye, EyeOff, Mail, Lock, ArrowRight, Send, Play,
  Search, Bell, Settings, LogOut, Menu, ChevronDown,
  ChevronUp, Edit, Trash2, MoreVertical, User, Shield,
};
