'use client'

import { cn } from '@/lib/utils'
import { ReactNode, ButtonHTMLAttributes } from 'react'

// ── Button ──────────────────────────────────────────────────────────────────
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  fullWidth?: boolean
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth,
  loading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 active:scale-[0.97]',
        {
          'bg-[#1565FF] text-white hover:bg-[#1052CC] shadow-lg shadow-blue-900/30': variant === 'primary',
          'border border-[#1565FF] text-white bg-transparent hover:bg-[#1565FF]/10': variant === 'secondary',
          'text-[#8A9BB5] hover:text-white hover:bg-white/5': variant === 'ghost',
          'bg-[#FF4D6A]/10 text-[#FF4D6A] border border-[#FF4D6A]/20 hover:bg-[#FF4D6A]/20': variant === 'danger',
          'h-10 px-4 text-sm': size === 'sm',
          'h-12 px-5 text-sm': size === 'md',
          'h-14 px-6 text-base': size === 'lg',
          'w-full': fullWidth,
          'opacity-50 cursor-not-allowed': disabled || loading,
        },
        className
      )}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </span>
      )}
      <span className={cn({ 'opacity-0': loading })}>{children}</span>
    </button>
  )
}

// ── Card ────────────────────────────────────────────────────────────────────
interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
}

export function Card({ children, className, onClick, hoverable }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-[#0F1A2E] rounded-2xl border border-[rgba(255,255,255,0.06)]',
        { 'cursor-pointer hover:bg-[#162035] transition-colors duration-150': hoverable || onClick },
        className
      )}
    >
      {children}
    </div>
  )
}

// ── Badge ───────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: ReactNode
  variant?: 'green' | 'red' | 'yellow' | 'blue' | 'default'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold',
        {
          'bg-[#00D897]/15 text-[#00D897]': variant === 'green',
          'bg-[#FF4D6A]/15 text-[#FF4D6A]': variant === 'red',
          'bg-yellow-500/15 text-yellow-400': variant === 'yellow',
          'bg-[#1565FF]/15 text-[#1565FF]': variant === 'blue',
          'bg-white/5 text-[#8A9BB5]': variant === 'default',
        },
        className
      )}
    >
      {children}
    </span>
  )
}

// ── Input ───────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'bg-[#162035] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-3 text-white placeholder-[#4A5568] focus:outline-none focus:border-[#1565FF]/50 transition-colors w-full text-sm',
        className
      )}
      {...props}
    />
  )
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('shimmer rounded-xl', className)} />
  )
}

// ── Divider ─────────────────────────────────────────────────────────────────
export function Divider({ label }: { label?: string }) {
  if (!label) return <div className="h-px bg-[rgba(255,255,255,0.06)]" />
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
      <span className="text-xs text-[#4A5568]">{label}</span>
      <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
    </div>
  )
}

// ── TokenLogo ────────────────────────────────────────────────────────────────
export function TokenLogo({
  logo,
  color,
  size = 40,
  className,
}: {
  logo: string
  color: string
  size?: number
  className?: string
}) {
  return (
    <div
      className={cn('rounded-full flex items-center justify-center flex-shrink-0 relative', className)}
      style={{
        width: size,
        height: size,
        background: `${color}20`,
        border: `1.5px solid ${color}40`,
        fontSize: size * 0.45,
      }}
    >
      {logo}
      <span
        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] border border-[#080E1C]"
        style={{ background: '#0098EA', fontSize: 8 }}
      >
        💎
      </span>
    </div>
  )
}
