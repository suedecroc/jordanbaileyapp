"use client";

import { useState } from "react";

export function StudioLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/studio/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Wrong password");
        setBusy(false);
        return;
      }
      window.location.reload();
    } catch {
      setError("Network error");
      setBusy(false);
    }
  }

  return (
    <div className="studio-login">
      <form onSubmit={submit} className="studio-login__card">
        <div className="studio-login__mark">GIGASUEDE</div>
        <div className="studio-login__sub">private studio</div>
        <div className="studio-login__field">
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="passphrase"
            autoFocus
            className="studio-login__input"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="studio-login__toggle"
            aria-label={show ? "hide password" : "show password"}
            aria-pressed={show}
          >
            {show ? "HIDE" : "SHOW"}
          </button>
        </div>
        {error ? <div className="studio-login__error">{error}</div> : null}
        <button type="submit" disabled={busy || !password} className="studio-login__btn">
          {busy ? "opening…" : "enter"}
        </button>
      </form>
    </div>
  );
}
