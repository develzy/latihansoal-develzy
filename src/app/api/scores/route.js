export const runtime = 'edge';

// Memori sementara untuk simulasi lokal (akan reset jika server restart)
let localScores = [
  { id: 1, name: 'Budi Santoso', subject: 'Matematika', score: 85, date: '09/05/2026, 06:00:00' },
  { id: 2, name: 'Siti Aminah', subject: 'PPKN', score: 90, date: '09/05/2026, 06:15:00' },
  { id: 3, name: 'Ahmad Dani', subject: 'B. Indonesia', score: 75, date: '09/05/2026, 06:30:00' },
];

// GET /api/scores
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pass = searchParams.get('pass');

  if (pass !== 'guru123') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const db = process.env.DB;
    if (!db) {
      return Response.json(localScores);
    }
    const { results } = await db.prepare("SELECT * FROM scores ORDER BY id DESC").all();
    return Response.json(results);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/scores
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, subject, pgScore, essayData } = body;
    const date = new Date().toLocaleString('id-ID');

    let essayScore = 0;
    let reasons = [];

    // Jika ada data uraian dan API Key Gemini tersedia
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (essayData && essayData.length > 0 && apiKey) {
      try {
        // Buat prompt untuk Gemini
        const prompt = `
        Anda adalah seorang guru Sekolah Dasar yang bertugas menilai jawaban uraian siswa secara adil.
        Nilailah 5 jawaban uraian berikut dengan skala 0 sampai 6 (bobot maksimal 6 per soal).
        Berikan nilai tinggi jika maknanya sama/mendekati kunci jawaban, meskipun kata-katanya berbeda atau ada typo.
        
        Daftar Soal:
        ${essayData.map((d, i) => `
        Soal ${i+1}: "${d.q}"
        Kunci Jawaban Ideal: "${d.sample}"
        Jawaban Siswa: "${d.studentAnswer || 'Tidak dijawab'}"
        `).join('\n')}
        
        Kembalikan respon HANYA dalam format JSON array seperti ini (tanpa markdown, tanpa teks lain):
        [
          { "score": 6, "reason": "Jawaban lengkap dan tepat." },
          ...
        ]
        `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        const resData = await response.json();
        const textResponse = resData.candidates[0].content.parts[0].text;
        
        // Parse JSON dari Gemini
        const grades = JSON.parse(textResponse.trim());
        
        // Hitung total nilai uraian (max 30)
        grades.forEach(g => {
          essayScore += g.score;
          reasons.push(g.reason);
        });
      } catch (err) {
        console.error('Gagal menilai dengan Gemini:', err);
        // Fallback: Jika AI gagal, nilai uraian dianggap 0 dulu atau butuh koreksi manual
        essayScore = 0;
      }
    }

    // Hitung Skor Akhir: PG (max 70) + Uraian (max 30) = 100
    // Asumsi pgScore yang dikirim sudah diskala ke max 70, atau kita skala disini.
    // Misal pgScore yang dikirim adalah jumlah jawaban benar (0-35).
    const scaledPgScore = Math.round((pgScore / 35) * 70);
    const finalScore = scaledPgScore + essayScore;

    const db = process.env.DB;
    
    if (!db) {
      const newScore = {
        id: localScores.length + 1,
        name,
        subject,
        score: finalScore,
        date,
        isMock: true
      };
      localScores.unshift(newScore);
      return Response.json({ success: true, finalScore, mock: true });
    }

    await db.prepare(
      "INSERT INTO scores (name, subject, score, date) VALUES (?, ?, ?, ?)"
    ).bind(name, subject, finalScore, date).run();

    return Response.json({ success: true, finalScore });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
