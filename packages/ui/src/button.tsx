import * as React from "react";

export function Button({ children }: { children: React.ReactNode }) {
  return <button style={{ padding: "10px", background: "blue", color: "white" }}>{children}</button>;
}
