// src/pages/Settings.tsx
import { useState } from "react";

export default function Settings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [twoFA, setTwoFA] = useState(false);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Saved profile (stub).");
  };

  const saveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Saved security (stub).");
  };

  const saveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Saved notifications (stub).");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile */}
      <section className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Profile</h2>
        <form className="space-y-4" onSubmit={saveProfile}>
          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input
              className="w-full border rounded-md px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className="w-full border rounded-md px-3 py-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white">
            Save Profile
          </button>
        </form>
      </section>

      {/* Security */}
      <section className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Security</h2>
        <form className="space-y-4" onSubmit={saveSecurity}>
          <div className="flex items-center gap-3">
            <input
              id="twofa"
              type="checkbox"
              className="h-4 w-4"
              checked={twoFA}
              onChange={() => setTwoFA((v) => !v)}
            />
            <label htmlFor="twofa">Enable Two-Factor Authentication</label>
          </div>
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white">
            Save Security
          </button>
        </form>
      </section>

      {/* Notifications */}
      <section className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        <form className="space-y-4" onSubmit={saveNotifications}>
          <div className="flex items-center gap-3">
            <input
              id="newsletter"
              type="checkbox"
              className="h-4 w-4"
              checked={newsletter}
              onChange={() => setNewsletter((v) => !v)}
            />
            <label htmlFor="newsletter">Email me news and updates</label>
          </div>
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white">
            Save Notifications
          </button>
        </form>
      </section>
    </div>
  );
}
