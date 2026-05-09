export const runtime = 'edge';

// Memori sementara untuk simulasi lokal (akan reset jika server restart)
let localScores = [];

const schoolPasswords = {
  'guruberprestasi25': 'SDN 01 KALISALAK',
  'guruumum25': 'Umum'
};

// GET /api/scores
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pass = searchParams.get('pass');

  const school = schoolPasswords[pass];
  if (!school) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const db = process.env.DB;
    if (!db) {
      const requestedSchool = searchParams.get('school');
      const filtered = school === 'Umum' 
        ? (requestedSchool ? localScores.filter(s => s.school === requestedSchool) : localScores.filter(s => s.school !== 'SDN 01 KALISALAK'))
        : localScores.filter(s => s.school === school);
      return Response.json(filtered);
    }
    
    let results;
    const requestedSchool = searchParams.get('school');
    if (school === 'Umum') {
      if (requestedSchool) {
        const query = await db.prepare("SELECT * FROM scores WHERE school = ? ORDER BY id DESC").bind(requestedSchool).all();
        results = query.results;
      } else {
        const query = await db.prepare("SELECT * FROM scores WHERE school != 'SDN 01 KALISALAK' OR school IS NULL ORDER BY id DESC").all();
        results = query.results;
      }
    } else {
      const query = await db.prepare("SELECT * FROM scores WHERE school = ? ORDER BY id DESC").bind(school).all();
      results = query.results;
    }
    return Response.json(results);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/scores
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, subject, pgScore, essayData, school } = body;
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
        school: school || 'SDN 01 KALISALAK',
        isMock: true
      };
      localScores.unshift(newScore);
      return Response.json({ success: true, finalScore, mock: true });
    }

    await db.prepare(
      "INSERT INTO scores (name, subject, score, date, school) VALUES (?, ?, ?, ?, ?)"
    ).bind(name, subject, finalScore, date, school || 'SDN 01 KALISALAK').run();

    return Response.json({ success: true, finalScore });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
