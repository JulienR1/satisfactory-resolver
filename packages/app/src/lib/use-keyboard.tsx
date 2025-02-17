import { useEffect } from "react"

export function useKeyboard(keys: string | Array<string>, handler: () => void) {
    return useEffect(() => {
        const inputs = Array.isArray(keys) ? keys : [keys]
        function callback(e: KeyboardEvent) {
            if (inputs.includes(e.code)) {
                handler()
            }
        }

        document.addEventListener("keyup", callback)
        return () => document.removeEventListener("keyup", callback)
    }, [keys, handler])
}
