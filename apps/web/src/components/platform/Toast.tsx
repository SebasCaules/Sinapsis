export function useToast() { return { toast: (msg: string) => { console.info("[toast]", msg); } }; }
export function Toaster() { return null; }
