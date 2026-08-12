import { useEffect, useState } from "react";
import { listConfig, updateConfig } from "../../lib/admin";

export default function ConfigPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [formValue, setFormValue] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await listConfig();
        if (!mounted) return;
        setSettings(res.data ?? []);
        setError(null);
      } catch (e: any) {
        setError(e?.error ?? "Failed to load config");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  function beginEdit(setting: any) {
    setEditingKey(setting.key);
    setFormValue(setting.value ?? "");
    setFormDescription(setting.description ?? "");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingKey) return;
    setSaving(true);
    try {
      await updateConfig(editingKey, { value: formValue, description: formDescription || undefined });
      const res = await listConfig();
      setSettings(res.data ?? []);
      setEditingKey(null);
      setError(null);
    } catch (e: any) {
      setError(e?.error ?? "Failed to update config");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading config...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>Configuration</h2>
      {settings.length === 0 ? <p>No config entries found.</p> : (
        <ul>
          {settings.map((setting) => (
            <li key={setting.key}>
              <strong>{setting.key}</strong> — {setting.value}
              {setting.description && <div>{setting.description}</div>}
              <button type="button" onClick={() => beginEdit(setting)}>Edit</button>
            </li>
          ))}
        </ul>
      )}

      {editingKey && (
        <form onSubmit={handleSave}>
          <h3>Edit {editingKey}</h3>
          <label>
            Value
            <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
          </label>
          <label>
            Description
            <input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
          </label>
          <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          <button type="button" onClick={() => setEditingKey(null)}>Cancel</button>
        </form>
      )}
    </div>
  );
}
