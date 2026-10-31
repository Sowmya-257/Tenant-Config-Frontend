import React, { useState } from 'react';
import { Shield, LogIn, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { api, TENANTS } from '../services/store';

const PERSONAS = [
  {
    id: 'admin',
    name: 'Admin',
    username: 'alice_admin',
    password: 'admin123',
    role: 'ROLE_ADMIN',
    badgeClass: 'badge-purple',
    description: 'Full global administrative privileges across all tenants, rollbacks, and staged rollouts.',
  },
  {
    id: 'operator',
    name: 'Operator',
    username: 'bob_ops',
    password: 'operator123',
    role: 'ROLE_OPERATOR',
    badgeClass: 'badge-blue',
    description: 'Tenant-level operations. Can edit operational configurations and launch canary pilots.',
  },
  {
    id: 'employee',
    name: 'Employee',
    username: 'charlie_emp',
    password: 'employee123',
    role: 'ROLE_EMPLOYEE',
    badgeClass: 'badge-yellow',
    description: 'Read-only access to view effective configurations and policies. Mutation is strictly blocked.',
  },
];

export default function LoginPage({ onLogin }) {
  const [tenant, setTenant] = useState('MICROSOFT');
  const [username, setUsername] = useState('alice_admin');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState('ROLE_ADMIN');
  const [selectedPersonaId, setSelectedPersonaId] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSelectPersona = (p) => {
    setSelectedPersonaId(p.id);
    setUsername(p.username);
    setPassword(p.password);
    setRole(p.role);
    setErrorMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // Authenticate with real backend Spring Boot JWT auth service
      const authResponse = await api.login(username.trim(), password.trim(), tenant, role);
      
      onLogin({
        username: authResponse.username || username.trim(),
        tenant: authResponse.tenantId || tenant,
        role: authResponse.role || role,
        token: authResponse.token,
      });
    } catch (err) {
      console.error('Authentication error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const activePersona = PERSONAS.find((p) => p.id === selectedPersonaId);

  return (
    <div
      style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: 480,
          width: '100%',
          padding: '32px 28px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
            }}
          >
            <Shield size={24} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '4px' }}>
            MoveInSync Enterprise
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Cryptographically Authenticated Hierarchical Config Platform
          </p>
        </div>

        {/* Persona Preset Buttons */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              SELECT ROLE PERSONA:
            </span>
            <span style={{ fontSize: '0.7rem', color: '#60a5fa' }}>Populates credentials</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
            }}
          >
            {PERSONAS.map((p) => {
              const isSelected = selectedPersonaId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPersona(p)}
                  style={{
                    padding: '8px 6px',
                    borderRadius: 'var(--radius)',
                    border: isSelected ? '1px solid #3b82f6' : '1px solid var(--border)',
                    background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'var(--panel)',
                    color: isSelected ? '#93c5fd' : 'var(--text-muted)',
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'center',
                  }}
                >
                  <div>{p.name}</div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.75, marginTop: '2px', fontFamily: 'var(--mono)' }}>
                    {p.username}
                  </div>
                </button>
              );
            })}
          </div>

          {activePersona && (
            <div
              style={{
                marginTop: '10px',
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                lineHeight: 1.4,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span className={`badge ${activePersona.badgeClass}`} style={{ fontSize: '0.65rem' }}>
                  {activePersona.role}
                </span>
                <span style={{ color: 'var(--text)', fontWeight: 500 }}>{activePersona.name} Permissions:</span>
              </div>
              {activePersona.description}
            </div>
          )}
        </div>

        {errorMsg && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 'var(--radius)',
              padding: '10px 14px',
              color: '#f87171',
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Client Organization / Tenant</label>
            <select
              className="select"
              value={tenant}
              onChange={(e) => setTenant(e.target.value)}
            >
              {TENANTS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="input"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setSelectedPersonaId(null);
                }}
                placeholder="Username (e.g. alice_admin, bob_ops)"
                required
                style={{ paddingLeft: '34px' }}
              />
              <User
                size={15}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setSelectedPersonaId(null);
                }}
                placeholder="Password"
                required
                style={{ paddingLeft: '34px', paddingRight: '36px' }}
              />
              <KeyRound
                size={15}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Role Category</label>
            <select
              className="select"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setSelectedPersonaId(null);
              }}
            >
              <option value="ROLE_ADMIN">Admin (Full Multi-Tenant Control &amp; Rollback)</option>
              <option value="ROLE_OPERATOR">Operator (Tenant Configuration &amp; Canary Rollout)</option>
              <option value="ROLE_EMPLOYEE">Employee (Read-Only Policy &amp; Schedule Viewer)</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '12px', padding: '10px 16px', fontWeight: 600 }}
          >
            {loading ? (
              <span>Authenticating with Backend...</span>
            ) : (
              <>
                <LogIn size={16} />
                <span>Sign In Securely</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
