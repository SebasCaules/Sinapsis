import type { ButtonHTMLAttributes, ReactNode } from "react";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: "primary" | "secondary" | "ghost"; size?: "sm" | "md"; }
export function Button({ variant = "secondary", size = "md", ...rest }: ButtonProps) { return <button type="button" data-variant={variant} data-size={size} {...rest} />; }
export function IconButton({ label, children, ...rest }: { label: string; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) { return <button type="button" aria-label={label} title={label} {...rest}>{children}</button>; }
