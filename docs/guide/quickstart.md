# Quickstart

A minimal app using the primitives, then a full app shell.

## 1. Import styles once

At your entry point (e.g. `main.tsx`):

```ts
import "@fractalui/tokens/styles.css";
import "@fractalui/primitives/styles.css";
```

## 2. Use a primitive

Every primitive is headless and accessible — keyboard, focus and ARIA are handled for you.

```tsx
import { Button, TextField, Stack } from "@fractalui/primitives";

export function LoginForm() {
  return (
    <Stack gap="md">
      <TextField label="Email" type="email" />
      <TextField label="Password" type="password" />
      <Button onPress={() => console.log("submit")}>Sign in</Button>
    </Stack>
  );
}
```

## 3. Compose a whole screen with patterns

`@fractalui/patterns` gives you an application shell — nav rail, sections, header, and a resizable right-dock — as one component.

```tsx
import { AppShell, type ShellSection } from "@fractalui/patterns";
import { Home, Settings } from "@fractalui/icons"; // or your own icons

const sections: ShellSection[] = [
  {
    key: "home",
    label: "Home",
    icon: <Home size={18} />,
    active: true,
    onSelect: () => navigate("/"),
    items: [{ key: "dashboard", label: "Dashboard", onSelect: () => navigate("/") }],
  },
];

export function App() {
  return (
    <AppShell
      brand={<button className="brand">My App</button>}
      sections={sections}
      railFooter={[{ key: "settings", icon: <Settings size={16} />, label: "Settings", onPress: openSettings }]}
    >
      <YourPageHere />
    </AppShell>
  );
}
```

`AppShell` also accepts `headerRight`, `rightDock` (a docked, resizable panel — pair it with `DockPanel`), and `backdrop`. See [Patterns & App shell](patterns.md).

## 4. Data-heavy screens, without boilerplate

Need a table or a form from a schema? `patterns` has `AutoTable` and `AutoForm`:

```tsx
import { AutoTable } from "@fractalui/patterns";

<AutoTable
  columns={[
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role", align: "end" },
  ]}
  rows={users}
/>;
```

→ Next: [Architecture](architecture.md) · [Theming](theming.md)
