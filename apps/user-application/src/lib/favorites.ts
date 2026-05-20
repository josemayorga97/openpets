import * as React from 'react'

export function useFavorites() {
  const [favorites, setFavorites] = React.useState<Set<string>>(() => new Set())
  const toggle = React.useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])
  return { favorites, toggle }
}
