# Simple state manipulation

```ts
import { atom } from 'jotai'

export const isSidebarOpenAtomState = atom(false)
```

```tsx
import { useAtom } from 'jotai'
import { isSidebarOpenAtomState } from './path-to-atom'

export function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtomState)

  function handleToggleSidebar() {
    setIsSidebarOpen((prev) => !prev)
  }

  return (
    <sidebar className={isSidebarOpen ? 'open' : 'closed'}>
        <button onClick={handleToggleSidebar}>
            {isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
        </button>
      <h2>Sidebar</h2>
      <p>This is the sidebar content.</p>
      </sidebar>
  )
}
```