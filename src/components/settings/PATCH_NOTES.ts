// Settings disconnect note:
// The onDisconnect prop now opens AppKit's Account view (which has a built-in
// disconnect button) rather than calling tonConnectUI.disconnect() directly.
// No other changes needed in this file — just make sure onDisconnect is called
// from the button as before.
//
// If you want a programmatic disconnect instead, install @reown/appkit and call:
//   import { useDisconnect } from '@reown/appkit/react'
//   const { disconnect } = useDisconnect()
//   disconnect()
//
// This file intentionally left as a comment patch — your existing Settings.tsx
// UI code doesn't need changes beyond the above if you keep the onDisconnect prop.
export {}
