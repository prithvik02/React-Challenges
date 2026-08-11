import type { ReactNode } from 'react'

type BadgeProps = {
  children: ReactNode
  variant?: string
  type?: string
}

export default function Badge({
  children,
  variant,
  type,
}: BadgeProps) {
  return (
    <span
      className="badge"
      data-variant={variant || type}
    >
      {children}
    </span>
  )
}