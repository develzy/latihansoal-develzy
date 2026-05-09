'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './page.module.css';
import { ChevronRight, Award, RefreshCw, BookOpen, Lock, Clock, Eye, Send, Trash2, ChevronDown } from 'lucide-react';
import { paiQuestions } from './data/pai';
import { mathQuestions } from './data/math';
import { indoQuestions } from './data/indo';
import { ppknQuestions } from './data/ppkn';
import { englishQuestions } from './data/english';
import { jawaQuestions } from './data/jawa';
import { pjokQuestions } from './data/pjok';
import { ipasQuestions } from './data/ipas';
import { sbdpQuestions } from './data/sbdp';











const playSound = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }
  } catch (e) {
    console.log('Audio not supported or blocked');
  }
};

const triggerConfetti = () => {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  document.body.appendChild(container);

  const colors = ['#00ff87', '#60efff', '#ff4a4a', '#ffff00'];
  for (let i = 0; i < 100; i++) {
    const p = document.createElement('div');
    p.style.position = 'absolute';
    p.style.width = '10px';
    p.style.height = '10px';
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = '-10px';
    p.style.borderRadius = '50%';
    p.style.opacity = Math.random();
    container.appendChild(p);

    const animation = p.animate([
      { transform: `translate(0, 0) rotate(0deg)` },
      { transform: `translate(${(Math.random() - 0.5) * 200}px, 100vh) rotate(${Math.random() * 360}deg)` }
    ], {
      duration: 2000 + Math.random() * 3000,
      easing: 'cubic-bezier(0,1,1,1)'
    });

    animation.onfinish = () => p.remove();
  }
  setTimeout(() => container.remove(), 5000);
};

export default function Home() {
  const [started, setStarted] = useState(false);
  const [student, setStudent] = useState({ name: '', school: 'SDN 01 KALISALAK' }); // Default school
  const [subject, setSubject] = useState(null);
  const [current, setCurrent] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [lockedAnswers, setLockedAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [apiScore, setApiScore] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [history, setHistory] = useState([]);

  const labels = ['A', 'B', 'C', 'D'];

  // Load state on mount
  useEffect(() => {
    const savedState = localStorage.getItem('current_quiz_state');
    if (savedState) {
      const state = JSON.parse(savedState);
      setStarted(state.started);
      setStudent(state.student);
      setSubject(state.subject);
      setCurrent(state.current);
      setAnswers(state.answers);
      setSubmitted(state.submitted);
      setLockedAnswers(state.lockedAnswers || new Array(state.answers.length).fill(false));
      setTimeLeft(state.timeLeft);
      setActiveQuestions(state.activeQuestions);
    }
  }, []);

  // Save state on change
  useEffect(() => {
    if (started && !submitted) {
      const stateToSave = {
        started,
        student,
        subject,
        current,
        answers,
        submitted,
        lockedAnswers,
        timeLeft,
        activeQuestions
      };
      localStorage.setItem('current_quiz_state', JSON.stringify(stateToSave));
    }
  }, [started, student, subject, current, answers, submitted, lockedAnswers, timeLeft, activeQuestions]);

  const getSubjectName = useCallback(() => {
    if (subject === 'pai') return 'PAI-BP';
    if (subject === 'math') return 'Matematika';
    if (subject === 'indo') return 'B. Indonesia';
    if (subject === 'ppkn') return 'PPKN';
    if (subject === 'english') return 'Bahasa Inggris';
    if (subject === 'jawa') return 'Bahasa Jawa';
    if (subject === 'pjok') return 'PJOK';
    if (subject === 'ipas') return 'IPAS';
    if (subject === 'sbdp') return 'SBdP';
    return '';
  }, [subject]);

  const handleSubmit = useCallback(async () => {
    if (!lockedAnswers[current] && timeLeft > 0) {
      setError('Harap kunci jawaban Anda terlebih dahulu.');
      return;
    }
    setSubmitted(true);
    triggerConfetti();
    playSound('correct');

    // Save to Cloudflare D1 via API
    try {
      // Hitung benar PG (Soal 1-35)
      let pgCorrect = 0;
      for (let i = 0; i < 35; i++) {
        if (answers[i] === activeQuestions[i].a) pgCorrect++;
      }

      // Ambil data uraian (Soal 36-40)
      const essayData = activeQuestions.slice(35, 40).map((q, i) => ({
        q: q.q,
        sample: q.sample,
        studentAnswer: answers[35 + i]
      }));

      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: student.name,
          subject: getSubjectName(),
          pgScore: pgCorrect,
          essayData: essayData
        })
      });
      if (res.ok) {
        const data = await res.json();
        setApiScore(data.finalScore);
      }
    } catch (err) {
      console.error('Gagal menyimpan nilai ke database:', err);
    }

    // Clear current state
    localStorage.removeItem('current_quiz_state');
  }, [lockedAnswers, current, timeLeft, activeQuestions, answers, student, getSubjectName]);

  useEffect(() => {
    let timer;
    if (started && !submitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [started, submitted, timeLeft, handleSubmit]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!student.name) {
      setError('Harap isi nama lengkap Anda.');
      return;
    }
    if (!subject) {
      setError('Harap pilih mata pelajaran.');
      return;
    }
    setError('');
    let qList = [];
    if (subject === 'pai') qList = paiQuestions;
    else if (subject === 'math') qList = mathQuestions;
    else if (subject === 'indo') qList = indoQuestions;
    else if (subject === 'ppkn') qList = ppknQuestions;
    else if (subject === 'english') qList = englishQuestions;
    else if (subject === 'jawa') qList = jawaQuestions;
    else if (subject === 'pjok') qList = pjokQuestions;
    else if (subject === 'ipas') qList = ipasQuestions;
    else if (subject === 'sbdp') qList = sbdpQuestions;

    setActiveQuestions(qList);
    setAnswers(new Array(qList.length).fill(null));
    setLockedAnswers(new Array(qList.length).fill(false));
    setStarted(true);
    setTimeLeft(3600);
    playSound('click');
  };

  const handleAnswer = (index) => {
    if (submitted || lockedAnswers[current]) return;

    const newAnswers = [...answers];
    newAnswers[current] = index;
    setAnswers(newAnswers);
    setError('');

    const newLocked = [...lockedAnswers];
    newLocked[current] = true;
    setLockedAnswers(newLocked);

    if (index === activeQuestions[current].a) {
      playSound('correct');
    } else {
      playSound('wrong');
    }
  };

  const handleEssayChange = (e) => {
    if (submitted || lockedAnswers[current]) return;
    const newAnswers = [...answers];
    newAnswers[current] = e.target.value;
    setAnswers(newAnswers);
    setError('');
  };

  const handleLockEssay = () => {
    if (!answers[current] || !answers[current].trim()) {
      setError('Harap isi jawaban terlebih dahulu.');
      return;
    }
    const newLocked = [...lockedAnswers];
    newLocked[current] = true;
    setLockedAnswers(newLocked);
    setError('');
    playSound('correct');
  };

  const handleNext = () => {
    if (!lockedAnswers[current]) {
      setError('Harap kunci jawaban Anda terlebih dahulu.');
      return;
    }
    setError('');
    if (current < activeQuestions.length - 1) {
      setCurrent(current + 1);
      playSound('click');
    }
  };



  const clearHistory = () => {
    localStorage.removeItem('quiz_history');
    setHistory([]);
    playSound('click');
  };

  const sendWhatsApp = () => {
    const message = `Halo Guru, saya *${student.name}* telah menyelesaikan latihan soal *${getSubjectName()}* dengan nilai *${calculateScore()}*.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const resetQuiz = () => {
    localStorage.removeItem('current_quiz_state');
    setStarted(false);
    setStudent({ name: '', school: 'SDN 01 KALISALAK' });
    setSubject(null);
    setCurrent(0);
    setAnswers([]);
    setLockedAnswers([]);
    setSubmitted(false);
    setError('');
    setActiveQuestions([]);
    setShowReview(false);
    playSound('click');
  };

  const handleRetry = () => {
    localStorage.removeItem('current_quiz_state');
    setStarted(false);
    setSubject(null);
    setCurrent(0);
    setAnswers([]);
    setLockedAnswers([]);
    setSubmitted(false);
    setError('');
    setApiScore(null);
    setActiveQuestions([]);
    setShowReview(false);
    playSound('click');
  };

  const calculateScore = () => {
    let correct = 0;
    for (let i = 0; i < 35; i++) {
      if (answers[i] === activeQuestions[i].a) correct++;
    }
    return Math.round((correct / 35) * 100);
  };

  const q = activeQuestions[current];
  const isEssay = q ? !!q.essay : false;



  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerGrid}>
          <div className={styles.logoContainer}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Shield_of_Tegal_Regency.svg" alt="Logo Tegal" className={styles.logo} />
          </div>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Latihan Soal ASAJ</h1>
            <h2 className={styles.schoolName}>SDN 01 KALISALAK</h2>
          </div>
        </div>
        {started && !submitted && (
          <div className={styles.timer}>
            <Clock size={18} /> {formatTime(timeLeft)}
          </div>
        )}
      </header>

      <div className={styles.marquee}>
        <div className={styles.marqueeInner}>
          <span>WEB LATIHAN ASESMEN SUMATIF AKHIR JENJANG | SDN 01 KALISALAK [jika mengalami kendala atau ingin berkolaborasi dalam inovasi, hubungi kami]</span>
          <span>WEB LATIHAN ASESMEN SUMATIF AKHIR JENJANG | SDN 01 KALISALAK [jika mengalami kendala atau ingin berkolaborasi dalam inovasi, hubungi kami]</span>
          <span>WEB LATIHAN ASESMEN SUMATIF AKHIR JENJANG | SDN 01 KALISALAK [jika mengalami kendala atau ingin berkolaborasi dalam inovasi, hubungi kami]</span>
          <span>WEB LATIHAN ASESMEN SUMATIF AKHIR JENJANG | SDN 01 KALISALAK [jika mengalami kendala atau ingin berkolaborasi dalam inovasi, hubungi kami]</span>
        </div>
      </div>

      {!started ? (
        <>
          <div className={styles.card}>
            <h2 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Data Peserta</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nama Lengkap</label>
              <input
                type="text"
                className={styles.input}
                value={student.name}
                onChange={(e) => setStudent({ ...student, name: e.target.value })}
                placeholder="Masukkan nama Anda"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Pilih Mata Pelajaran</label>
              <div className={styles.dropdown}>
                <div 
                  className={styles.dropdownHeader} 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{subject ? getSubjectName() : 'Pilih Mata Pelajaran'}</span>
                  <ChevronDown size={18} className={isDropdownOpen ? styles.rotate : ''} />
                </div>
                {isDropdownOpen && (
                  <ul className={styles.dropdownList}>
                    <li onClick={() => { setSubject('pai'); setIsDropdownOpen(false); }}>1. PAI-BP</li>
                    <li onClick={() => { setSubject('math'); setIsDropdownOpen(false); }}>2. MATEMATIKA</li>
                    <li onClick={() => { setSubject('indo'); setIsDropdownOpen(false); }}>3. B. INDONESIA</li>
                    <li onClick={() => { setSubject('ppkn'); setIsDropdownOpen(false); }}>4. PPKN</li>
                    <li onClick={() => { setSubject('english'); setIsDropdownOpen(false); }}>5. B. INGGRIS</li>
                    <li onClick={() => { setSubject('jawa'); setIsDropdownOpen(false); }}>6. B. JAWA</li>
                    <li onClick={() => { setSubject('pjok'); setIsDropdownOpen(false); }}>7. PJOK</li>
                    <li onClick={() => { setSubject('ipas'); setIsDropdownOpen(false); }}>8. IPAS</li>
                    <li onClick={() => { setSubject('sbdp'); setIsDropdownOpen(false); }}>9. SBdP</li>
                  </ul>
                )}
              </div>
            </div>

            {error && <p style={{ color: 'var(--danger-color)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
            <button className={styles.button} onClick={handleStart}>
              Mulai Latihan <ChevronRight size={18} />
            </button>
          </div>

          {/* History Section (Teacher/Admin View) */}
          {history.length > 0 && (
            <div className={styles.card} style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontWeight: 700 }}>Riwayat Nilai Siswa</h2>
                <button className={styles.clearBtn} onClick={clearHistory}>
                  <Trash2 size={16} /> Hapus Riwayat
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Mapel</th>
                      <th>Nilai</th>
                      <th>Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.subject}</td>
                        <td style={{ fontWeight: 700, color: 'var(--accent-color)' }}>{item.score}</td>
                        <td style={{ fontSize: '0.85rem', color: '#8b949e' }}>{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {!submitted && (
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${((current + 1) / activeQuestions.length) * 100}%` }}
                ></div>
              </div>
              <span className={styles.progressText}>
                {current + 1} / {activeQuestions.length}
              </span>
            </div>
          )}

          {!submitted ? (
            <div className={styles.card}>
              <div className={styles.questionNumber}>
                {getSubjectName()} | {isEssay ? `Uraian ${current - 34}` : `Pilihan Ganda ${current + 1}`}
              </div>
              <div className={styles.questionText}>{q.q}</div>

              {!isEssay ? (
                <div>
                  {q.o.map((opt, i) => {
                    let classes = styles.optionBtn;
                    if (answers[current] === i) classes += ` ${styles.selected}`;
                    if (submitted || lockedAnswers[current]) {
                      if (i === q.a) classes += ` ${styles.correct}`;
                      else if (answers[current] === i) classes += ` ${styles.wrong}`;
                    }

                    return (
                      <button
                        key={i}
                        className={classes}
                        onClick={() => handleAnswer(i)}
                        disabled={submitted || lockedAnswers[current]}
                      >
                        <span className={styles.optionLetter}>{labels[i]}.</span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div>
                  <textarea
                    className={styles.textarea}
                    value={answers[current] || ''}
                    onChange={handleEssayChange}
                    placeholder="Tulis jawaban Anda di sini..."
                    disabled={submitted || lockedAnswers[current]}
                  />
                  {!lockedAnswers[current] && (
                    <button className={styles.button} onClick={handleLockEssay} style={{ marginTop: '0.5rem' }}>
                      <Lock size={16} /> Kunci Jawaban & Lihat Penjelasan
                    </button>
                  )}
                </div>
              )}

              {error && <p style={{ color: 'var(--danger-color)', marginTop: '1rem', fontSize: '0.9rem' }}>{error}</p>}

              <div className={styles.nav}>
                {current < activeQuestions.length - 1 ? (
                  <button
                    className={`${styles.navButton} ${styles.primary}`}
                    onClick={handleNext}
                    disabled={!lockedAnswers[current]}
                  >
                    Selanjutnya <ChevronRight size={18} />
                  </button>
                ) : (
                  !submitted && (
                    <button
                      className={`${styles.navButton} ${styles.primary}`}
                      onClick={handleSubmit}
                      disabled={!lockedAnswers[current]}
                    >
                      Selesai & Lihat Nilai
                    </button>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className={`${styles.card} animated-fade-in`} style={{ textAlign: 'center' }}>
              <Award size={48} color="var(--accent-color)" style={{ marginBottom: '1rem' }} />
              <h2>Hasil Latihan ASAJ</h2>
              <div style={{ margin: '1rem 0', color: '#8b949e' }}>
                <p><strong>Nama:</strong> {student.name}</p>
                <p><strong>Sekolah:</strong> SDN 01 KALISALAK</p>
                <p><strong>Mata Pelajaran:</strong> {getSubjectName()}</p>
              </div>

              <div className={styles.scoreDisplay}>
                {apiScore !== null ? apiScore : calculateScore()} / 100
              </div>

              <p style={{ color: '#8b949e', marginBottom: '2rem' }}>
                {apiScore !== null 
                  ? "Skor di atas sudah termasuk penilaian otomatis oleh AI untuk soal uraian." 
                  : "Skor di atas hanya berdasarkan soal pilihan ganda. Soal uraian akan dinilai oleh guru."}
              </p>

              <div className={styles.nav} style={{ justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button className={styles.button} onClick={sendWhatsApp}>
                  <Send size={18} /> Kirim Hasil ke Guru
                </button>
                <button className={styles.button} onClick={() => setShowReview(!showReview)}>
                  <Eye size={18} /> {showReview ? 'Tutup Pembahasan' : 'Lihat Pembahasan'}
                </button>
                <button className={styles.button} onClick={handleRetry}>
                  <RefreshCw size={18} /> Coba Lagi
                </button>
                <button className={styles.button} onClick={resetQuiz} style={{ background: 'rgba(255, 74, 74, 0.1)', color: '#ff4a4a', border: '1px solid rgba(255, 74, 74, 0.2)' }}>
                  <Lock size={18} /> Selesai & Ganti Siswa
                </button>
              </div>

              {showReview && (
                <div className={styles.reviewContainer}>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>Pembahasan Soal</h3>
                  {activeQuestions.map((question, index) => {
                    const isCorrect = answers[index] === question.a;
                    const isEssayQuestion = !!question.essay;

                    return (
                      <div key={index} className={`${styles.reviewItem} ${isEssayQuestion ? '' : (isCorrect ? styles.correct : styles.wrong)}`}>
                        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                          {index + 1}. {question.q}
                        </p>

                        {!isEssayQuestion ? (
                          <>
                            <p style={{ fontSize: '0.9rem', color: '#8b949e' }}>
                              Jawaban Anda: <span style={{ color: isCorrect ? 'var(--accent-color)' : 'var(--danger-color)' }}>
                                {answers[index] !== null ? `${labels[answers[index]]}. ${question.o[answers[index]]}` : 'Tidak dijawab'}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p style={{ fontSize: '0.9rem', color: 'var(--accent-color)' }}>
                                Jawaban Benar: {labels[question.a]}. {question.o[question.a]}
                              </p>
                            )}
                          </>
                        ) : (
                          <p style={{ fontSize: '0.9rem', color: '#8b949e' }}>
                            Jawaban Anda: {answers[index] || 'Tidak dijawab'}
                          </p>
                        )}

                        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#c9d1d9', display: 'flex', gap: '0.5rem' }}>
                          <BookOpen size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span><strong>Penjelasan:</strong> {question.expl}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {!submitted && lockedAnswers[current] && (
            <div className={styles.explanationBox}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-color)' }}>
                <BookOpen size={18} />
                <span style={{ fontWeight: 700 }}>Penjelasan Singkat:</span>
              </div>
              <p style={{ color: '#8b949e', fontSize: '0.95rem', lineHeight: '1.6' }}>{q.expl}</p>
              {!isEssay && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#c9d1d9' }}>
                  Jawaban yang benar: <strong>{labels[q.a]}</strong>
                </p>
              )}
            </div>
          )}
        </>
      )}
      <footer className={styles.footer}>
        <div className={styles.footerLine}></div>
        <div className={styles.footerContent}>
          <h3 className={styles.footerTitle}>Asah Kemampuan, Raih Prestasi</h3>
          <p className={styles.footerQuote}>
            &quot;Kami Selalu Tumbuh Bersama Inovasi dan Prestasi, menciptakan lingkungan belajar yang modern, inspiratif, dan penuh semangat untuk meraih masa depan gemilang.&quot;
          </p>
          <div className={styles.footerMeta}>
            <p className={styles.copyright}>
              <a href="https://wa.me/6285879584257" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>@2026 Powered by DEVELZY</a>
            </p>
            <div className={styles.footerLinks}>
              <span>Versi 1.2.5 | Mode Cerdas | Terintegritas Dengan AI</span>
              <span className={styles.divider}>|</span>
              <a href="/teacher" className={styles.teacherLink}>Ruang Guru</a>
              <span className={styles.divider}>|</span>
              <a href={`https://wa.me/6285879584257?text=${encodeURIComponent("Assalamu'alaikum Wr. Wb.\n*WEB LATIHAN SOAL ASAJ*\nNama:\nKendala:\nSekolah:\n\nTerimakasih sudah mendukung kami")}`} target="_blank" rel="noopener noreferrer" className={styles.teacherLink}>Mengalami Kendala?</a>
            </div>
          </div>
        </div>
      </footer>
    </div >
  );
}
