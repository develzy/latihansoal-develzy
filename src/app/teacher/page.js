'use client';

import { useState, useEffect } from 'react';
import styles from '../page.module.css';
import { ChevronRight, Award, RefreshCw, BookOpen, Lock, Clock, Eye, EyeOff, Send, Trash2, ChevronDown } from 'lucide-react';

export default function TeacherPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scores, setScores] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);

  const schools = [
    'SD Negeri Margasari 01',
    'SD Negeri Margasari 02',
    'SD Negeri Margasari 03',
    'SD Negeri Margasari 04',
    'SD Negeri Margasari 05',
    'SD Negeri Margasari 06',
    'SD Negeri Margasari 07',
    'SD Negeri Marga Ayu',
    'SD Negeri Danaraja 01',
    'SD Negeri Danaraja 02',
    'SD Negeri Danaraja 03',
    'SD Negeri Danaraja 04',
    'SD Negeri Jatilaba 01',
    'SD Negeri Jatilaba 02',
    'SD Negeri Jatilaba 03',
    'SD Negeri Jembayat 01',
    'SD Negeri Jembayat 02',
    'SD Negeri Jembayat 03',
    'SD Negeri Kaligayam 01',
    'SD Negeri Kaligayam 02',
    'SD Negeri Kaligayam 03',
    'SD Negeri Kalisalak 02',
    'SD Negeri Karangdawa 01',
    'SD Negeri Karangdawa 02',
    'SD Negeri Karangdawa 03',
    'SD Negeri Karangdawa 04',
    'SD Negeri Pakulaut 01',
    'SD Negeri Pakulaut 02',
    'SD Negeri Pakulaut 03',
    'SD Negeri Pakulaut 04',
    'SD Negeri Prupuk Selatan 01',
    'SD Negeri Prupuk Selatan 02',
    'SD Negeri Prupuk Selatan 03',
    'SD Negeri Prupuk Utara 01',
    'SD Negeri Prupuk Utara 02',
    'SD Negeri Wanasari 01',
    'SD Negeri Wanasari 02',
  ];

  const handleLogin = async () => {
    if (password === 'GuruUmum25' && !selectedSchool) {
      setError('Harap pilih sekolah Anda.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const url = password === 'GuruUmum25' 
        ? `/api/scores?pass=${password}&school=${encodeURIComponent(selectedSchool)}`
        : `/api/scores?pass=${password}`;
      const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setScores(data);
          setIsAuthenticated(true);
        } else {
          const errData = await res.json().catch(() => ({}));
          setError(errData.error || 'Password salah atau akses ditolak.');
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
      const url = password === 'GuruUmum25' 
        ? `/api/scores?pass=${password}&school=${encodeURIComponent(selectedSchool)}`
        : `/api/scores?pass=${password}`;
      const res = await fetch(url);
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
            <p className={styles.subtitle}>
              Rekap Nilai Siswa {password === 'GuruUmum25' ? (selectedSchool || 'Sekolah Umum') : 'SDN 01 KALISALAK'}
            </p>
          </div>
        </div>
      </header>

      {!isAuthenticated ? (
        <div className={styles.card} style={{ maxWidth: '400px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Login Guru</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>Password Akses</label>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                style={{ paddingRight: '2.5rem' }}
              />
              <div 
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '0.75rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  cursor: 'pointer',
                  color: '#8b949e',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

            {password === 'GuruUmum25' && (
              <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                <label className={styles.label}>Pilih Sekolah Anda</label>
                <div className={styles.dropdown}>
                  <div 
                    className={styles.dropdownHeader} 
                    onClick={() => setIsSchoolDropdownOpen(!isSchoolDropdownOpen)}
                  >
                    <span>{selectedSchool || 'Pilih Sekolah'}</span>
                    <ChevronDown size={18} className={isSchoolDropdownOpen ? styles.rotate : ''} />
                  </div>
                  {isSchoolDropdownOpen && (
                    <ul className={styles.dropdownList}>
                      <li style={{ padding: '0.5rem 1rem', cursor: 'default' }}>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="Cari sekolah..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()} 
                          style={{ width: '100%', marginBottom: '0.5rem' }}
                        />
                      </li>
                      {schools
                        .filter(sch => sch.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((sch, i) => (
                          <li 
                            key={i} 
                            onClick={() => { 
                              setSelectedSchool(sch); 
                              setIsSchoolDropdownOpen(false); 
                              setSearchQuery('');
                            }}
                          >
                            {sch}
                          </li>
                        ))
                      }
                      {schools.filter(sch => sch.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                        <li style={{ color: '#8b949e', cursor: 'default' }}>Sekolah tidak ditemukan</li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            )}
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
                  <th>Sekolah</th>
                  <th>Mata Pelajaran</th>
                  <th>Nilai</th>
                  <th>Waktu Selesai</th>
                </tr>
              </thead>
              <tbody>
                {scores.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#8b949e' }}>Belum ada data nilai.</td>
                  </tr>
                ) : (
                  scores.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td style={{ fontWeight: 600 }}>{item.name}</td>
                      <td>{item.school || 'SDN 01 KALISALAK'}</td>
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
