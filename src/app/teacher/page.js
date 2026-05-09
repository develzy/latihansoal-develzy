'use client';

import { useState, useEffect } from 'react';
import styles from '../page.module.css';
import { ChevronRight, Award, RefreshCw, BookOpen, Lock, Clock, Eye, Send, Trash2 } from 'lucide-react';

export default function TeacherPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scores, setScores] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/scores?pass=${password}`);
      if (res.ok) {
        const data = await res.json();
        setScores(data);
        setIsAuthenticated(true);
      } else {
        setError('Password salah atau akses ditolak.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memuat data.');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/scores?pass=${password}`);
      if (res.ok) {
        const data = await res.json();
        setScores(data);
      }
    } catch (err) {
      setError('Gagal memperbarui data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerGrid}>
          <div className={styles.logoContainer}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Shield_of_Tegal_Regency.svg" alt="Logo Tegal" className={styles.logo} />
          </div>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Panel Guru</h1>
            <p className={styles.subtitle}>Rekap Nilai Siswa SDN 01 KALISALAK</p>
          </div>
        </div>
      </header>

      {!isAuthenticated ? (
        <div className={styles.card} style={{ maxWidth: '400px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Login Guru</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>Password Akses</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          {error && <p style={{ color: 'var(--danger-color)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
          <button className={styles.button} onClick={handleLogin} disabled={loading}>
            {loading ? 'Memuat...' : 'Masuk Panel'} <ChevronRight size={18} />
          </button>
        </div>
      ) : (
        <div className={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontWeight: 700 }}>Daftar Nilai Siswa</h2>
            <button className={styles.navButton} onClick={refreshData} disabled={loading}>
              <RefreshCw size={16} className={loading ? styles.spin : ''} /> {loading ? 'Memuat...' : 'Refresh Data'}
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Siswa</th>
                  <th>Mata Pelajaran</th>
                  <th>Nilai</th>
                  <th>Waktu Selesai</th>
                </tr>
              </thead>
              <tbody>
                {scores.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: '#8b949e' }}>Belum ada data nilai.</td>
                  </tr>
                ) : (
                  scores.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td style={{ fontWeight: 600 }}>{item.name}</td>
                      <td>{item.subject}</td>
                      <td style={{ fontWeight: 700, color: 'var(--accent-color)' }}>{item.score}</td>
                      <td style={{ fontSize: '0.85rem', color: '#8b949e' }}>{item.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        <div className={styles.footerLine}></div>
        <p>Asah Kemampuan, Raih Prestasi</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.2rem', opacity: 0.7 }}>@2026 Powered by DEVELZY</p>
      </footer>
    </div>
  );
}
