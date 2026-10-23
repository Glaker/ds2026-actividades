import { useEffect, useState } from 'react'

// Resultado que devuelve el hook
type UseFetchResult<T> = {
  data: T | null
  loading: boolean
  error: string | null
}

// Custom hook: hace GET a la url y expone data, loading y error
export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Se vuelve a ejecutar solo cuando cambia la url
  useEffect(() => {
    async function cargar() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(url)
        // fetch no falla con 404/500: hay que chequear res.ok a mano
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
        setData((await res.json()) as T)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [url])

  return { data, loading, error }
}
