'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { ChevronRight, Award, RefreshCw, BookOpen, Lock, Clock, Eye, Send, Trash2 } from 'lucide-react';

const paiQuestions = [
  { q: 'Perhatikan penggalan ayat berikut!\n"إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ"\nArti penggalan ayat yang bergaris bawah adalah ....', o: ['manusia yang paling kaya', 'manusia yang paling mulia di sisi Allah adalah yang bertakwa', 'manusia diciptakan bersuku-suku', 'Allah Maha Mengetahui'], a: 1, expl: 'Potongan ayat "Inna akramakum \'indallahi atqakum" berarti "Sesungguhnya yang paling mulia di antara kamu di sisi Allah adalah yang paling bertakwa".' },
  { q: 'Indonesia memiliki beragam suku and budaya. Sikap yang sesuai dengan pesan Q.S. Al-Hujurat ayat 13 adalah ....', o: ['mengejek budaya daerah lain', 'merasa sukunya paling hebat', 'saling menghormati and hidup rukun', 'memilih teman dari suku yang sama'], a: 2, expl: 'Q.S. Al-Hujurat ayat 13 mengajarkan bahwa manusia diciptakan bersuku-suku dan berbangsa-bangsa untuk saling mengenal dan menghormati.' },
  { q: 'Perilaku yang sesuai dengan hadis tentang persaudaraan sesama manusia adalah ....', o: ['membenci teman berbeda pendapat', 'membantu teman yang kesulitan', 'memutus hubungan dengan tetangga', 'mengejek kekurangan orang lain'], a: 1, expl: 'Membantu teman yang kesulitan adalah wujud nyata dari ukhuwah atau persaudaraan sesama manusia.' },
  { q: 'Perhatikan potongan Surah Al-Kafirun berikut!\n"لَكُمْ دِينُكُمْ وَلِيَ دِينِ"\nHukum bacaan pada kata "وَلِيَ" adalah ....', o: ['ikhfa', 'idgham', 'mad thabi\'i', 'qalqalah'], a: 2, expl: 'Hukum bacaan pada kata tersebut adalah mad thabi\'i karena terdapat harakat yang dibaca panjang.' },
  { q: 'Perhatikan perilaku berikut!\n1) Menghardik anak yatim\n2) Rajin membantu fakir miskin\n3) Enggan memberi makan orang miskin\n4) Menolong teman tanpa pamrih\n\nCiri pendusta agama sesuai Surah Al-Ma\'un ditunjukkan oleh nomor ....', o: ['1 dan 3', '2 dan 4', '1 dan 2', '3 dan 4'], a: 0, expl: 'Surah Al-Ma\'un menyebutkan ciri pendusta agama di antaranya adalah orang yang menghardik anak yatim dan tidak menganjurkan memberi makan orang miskin.' },
  { q: 'Arti ayat "Qul huwallahu ahad" adalah ....', o: ['Allah tempat meminta', 'Allah tidak beranak', 'Katakanlah Allah Maha Esa', 'tidak ada yang setara dengan-Nya'], a: 2, expl: 'Arti dari "Qul huwallahu ahad" adalah "Katakanlah (Muhammad), Dialah Allah, Yang Maha Esa".' },
  { q: 'Dua siswa bertengkar karena saling mengejek. Sikap yang tepat sesuai hadis tentang kasih sayang adalah ....', o: ['membiarkan pertengkaran', 'ikut memihak salah satu teman', 'mendamaikan and saling memaafkan', 'menjauhi keduanya'], a: 2, expl: 'Islam mengajarkan umatnya untuk saling menyayangi dan mendamaikan saudaranya yang sedang berselisih.' },
  { q: 'Allah Swt. berdiri sendiri dan tidak membutuhkan bantuan makhluk-Nya. Asmaulhusna yang sesuai adalah ....', o: ['Al-Gaffar', 'Al-Qayyum', 'As-Samad', 'Al-Afuw'], a: 1, expl: 'Al-Qayyum berarti Allah Maha Mandiri atau Maha Berdiri Sendiri, tidak membutuhkan bantuan makhluk-Nya.' },
  { q: 'Asmaulhusna "Al-Gaffar" berarti ....', o: ['Maha Esa', 'Maha Pengampun', 'Maha Berdiri Sendiri', 'Maha Tempat Meminta'], a: 1, expl: 'Al-Gaffar berasal dari kata gafara yang berarti mengampuni. Jadi, Al-Gaffar berarti Allah Maha Pengampun.' },
  { q: 'Berikut yang termasuk tanda kiamat sugra adalah ....', o: ['matahari terbit dari barat', 'turunnya Nabi Isa a.s.', 'banyak terjadi gempa bumi', 'ditiupnya sangkakala'], a: 2, expl: 'Kiamat sugra adalah kiamat kecil, seperti bencana alam (gempa bumi), kematian seseorang, dll.' },
  { q: 'Perilaku yang mencerminkan hikmah beriman kepada hari akhir dalam kehidupan bertetangga adalah ....', o: ['suka memfitnah tetangga', 'membantu tetangga yang kesulitan', 'membuang sampah di rumah tetangga', 'tidak peduli lingkungan sekitar'], a: 1, expl: 'Beriman kepada hari akhir membuat seseorang gemar berbuat baik, termasuk membantu tetangga, karena tahu semua amal akan dibalas.' },
  { q: 'Kelahiran dan kematian termasuk contoh ....', o: ['takdir muallaq', 'takdir mubram', 'usaha manusia', 'ikhtiar manusia'], a: 1, expl: 'Takdir mubram adalah takdir Allah yang sudah pasti dan tidak dapat diubah oleh usaha manusia, seperti kematian dan kelahiran.' },
  { q: 'Rina bercita-cita menjadi dokter. Ia belajar dengan rajin dan berdoa kepada Allah. Sikap tersebut menunjukkan iman kepada ....', o: ['takdir mubram', 'qada', 'takdir muallaq', 'kiamat kubra'], a: 2, expl: 'Takdir muallaq adalah takdir yang masih bisa diubah dengan usaha (ikhtiar) dan doa manusia, seperti keberhasilan atau cita-cita.' },
  { q: 'Pasangan Asmaulhusna dan artinya yang tepat adalah ....', o: ['Al-Wahid = Maha Pengampun', 'As-Samad = Maha Esa', 'Al-Afuw = Maha Pemaaf', 'Al-Qayyum = Maha Penyayang'], a: 2, expl: 'Al-Afuw berarti Allah Maha Pemaaf yang menghapuskan dosa-dosa hamba-Nya.' },
  { q: 'Orang yang beriman kepada hari akhir akan ....', o: ['bebas berbuat sesuka hati', 'takut berbuat dosa', 'malas beribadah', 'meremehkan orang lain'], a: 1, expl: 'Kesadaran akan adanya hari pembalasan membuat orang beriman berhati-hati dan takut berbuat dosa.' },
  { q: 'Adab berdoa yang benar adalah ....', o: ['sambil bercanda', 'menghadap kiblat and khusyuk', 'berteriak keras', 'tergesa-gesa'], a: 1, expl: 'Menghadap kiblat, khusyuk, dan merendahkan suara adalah bagian dari adab berdoa yang diajarkan Rasulullah.' },
  { q: 'Tetangga sebelah rumah sedang sakit. Sikap yang tepat adalah ....', o: ['membiarkannya', 'mengejeknya', 'menjenguk and membantu', 'menghindarinya'], a: 2, expl: 'Menjenguk tetangga yang sakit adalah salah satu hak muslim terhadap muslim lainnya dan merupakan perbuatan terpuji.' },
  { q: 'Di sekolah terdapat teman berbeda agama. Sikap yang tepat adalah ....', o: ['memaksakan keyakinan', 'menghina ibadahnya', 'menghormati and bertoleransi', 'menjauhinya'], a: 2, expl: 'Toleransi beragama adalah menghormati perbedaan keyakinan dan tidak mengganggu ibadah orang lain.' },
  { q: 'Menyayangi hewan merupakan bentuk ....', o: ['kesombongan', 'syukur kepada Allah', 'pemborosan', 'kemalasan'], a: 1, expl: 'Menyayangi sesama makhluk ciptaan Allah adalah salah satu bentuk rasa syukur kita atas nikmat-Nya.' },
  { q: 'Cara menjaga tumbuhan di lingkungan sekolah adalah ....', o: ['mencabut tanaman sembarangan', 'menginjak rumput', 'menyiram tanaman secara rutin', 'membuang sampah di taman'], a: 2, expl: 'Menyiram dan merawat tanaman adalah tindakan nyata dalam menjaga kelestarian lingkungan sekolah.' },
  { q: 'Dua teman berselisih karena salah paham. Solusi yang tepat adalah ....', o: ['saling mengejek', 'berkelahi', 'bermusyawarah and saling memaafkan', 'tidak saling menyapa selamanya'], a: 2, expl: 'Bermusyawarah dan saling memaafkan adalah cara terbaik menyelesaikan perselisihan sesuai ajaran Islam.' },
  { q: 'Perbedaan zakat fitrah dan zakat mal yang benar adalah ....', o: ['zakat fitrah wajib setiap hari', 'zakat mal berupa beras', 'zakat fitrah dibayar saat Ramadan', 'zakat mal hanya untuk anak yatim'], a: 2, expl: 'Zakat fitrah khusus dikeluarkan pada bulan Ramadan untuk mensucikan diri, sedangkan zakat mal adalah zakat harta.' },
  { q: 'Memberikan uang untuk pembangunan masjid termasuk ....', o: ['sedekah', 'infak', 'hadiah', 'hibah'], a: 1, expl: 'Infak adalah mengeluarkan sebagian harta untuk kepentingan umum atau keagamaan seperti pembangunan masjid.' },
  { q: 'Puasa sunah yang dilaksanakan pada tanggal 9 Dzulhijjah adalah puasa ....', o: ['Arafah', 'Asyura', 'Senin Kamis', 'Daud'], a: 0, expl: 'Puasa Arafah dilaksanakan pada hari Arafah (9 Dzulhijjah) bagi orang yang tidak sedang melaksanakan ibadah haji.' },
  { q: 'Yang termasuk golongan penerima zakat adalah ....', o: ['orang kaya', 'fakir and miskin', 'pedagang sukses', 'pejabat'], a: 1, expl: 'Fakir dan miskin adalah dua dari delapan golongan (asnaf) yang berhak menerima zakat.' },
  { q: 'Guru memberikan hadiah kepada siswa berprestasi. Hukum memberi hadiah adalah ....', o: ['haram', 'makruh', 'boleh and dianjurkan', 'wajib'], a: 2, expl: 'Memberi hadiah untuk memotivasi kebaikan hukumnya boleh dan sangat dianjurkan dalam Islam.' },
  { q: 'Makanan yang halal dikonsumsi adalah makanan yang ....', o: ['diperoleh dengan mencuri', 'mengandung racun', 'bersih and baik', 'berasal dari hewan haram'], a: 2, expl: 'Makanan halal harus memenuhi syarat thoyyib (baik dan bersih) serta diperoleh dengan cara yang benar.' },
  { q: 'Makanan haram karena cara memperolehnya disebut haram ....', o: ['dzatihi', 'lighairihi', 'mutlak', 'syubhat'], a: 1, expl: 'Haram lighairihi adalah makanan yang asalnya halal namun menjadi haram karena cara memperolehnya yang salah (seperti mencuri).' },
  { q: 'Salah satu alasan Nabi Muhammad saw. hijrah ke Madinah adalah ....', o: ['ingin berdagang', 'menghindari tekanan kaum Quraisy', 'mencari kekayaan', 'ingin berwisata'], a: 1, expl: 'Hijrah ke Madinah dilakukan untuk menyelamatkan diri dan umat Islam dari siksaan serta tekanan kaum kafir Quraisy.' },
  { q: 'Nilai yang terkandung dalam Piagam Madinah adalah ....', o: ['permusuhan', 'perpecahan', 'toleransi and persatuan', 'kesombongan'], a: 2, expl: 'Piagam Madinah adalah lambang toleransi dan persatuan antar berbagai golongan di Madinah pada masa Rasulullah.' },
  { q: 'Sifat teladan Abu Bakar as-Siddiq yang dapat diterapkan saat ini adalah ....', o: ['keras kepala', 'tegas and jujur', 'sombong', 'pemalas'], a: 1, expl: 'Abu Bakar as-Siddiq terkenal dengan sifatnya yang jujur (as-siddiq) dan tegas dalam memimpin.' },
  { q: 'Jasa besar Umar bin Khattab dalam bidang pemerintahan adalah ....', o: ['membangun Ka\'bah', 'menyusun administrasi negara', 'memimpin perang Badar', 'membuat kitab hadis'], a: 1, expl: 'Khalifah Umar bin Khattab adalah peletak dasar sistem administrasi negara Islam yang modern pada zamannya.' },
  { q: 'Kedermawanan Utsman bin Affan memberikan dampak ....', o: ['umat Islam semakin lemah', 'masyarakat menjadi sengsara', 'membantu kebutuhan umat Islam', 'menimbulkan permusuhan'], a: 2, expl: 'Utsman bin Affan sering mendermakan hartanya untuk kepentingan umat Islam, seperti membeli sumur Raumah.' },
  { q: 'Ali bin Abi Thalib dikenal sebagai ....', o: ['ahli perdagangan', 'Pintu Ilmu and pemberani', 'penulis wahyu pertama', 'sahabat terkaya'], a: 1, expl: 'Rasulullah bersabda: "Aku adalah kotanya ilmu dan Ali adalah pintunya." Beliau juga terkenal sangat pemberani.' },
  { q: 'Sikap Nabi Muhammad saw. saat Fathu Makkah mengajarkan kita untuk ....', o: ['membalas dendam', 'sombong kepada musuh', 'memaafkan kesalahan orang lain', 'menghina lawan'], a: 2, expl: 'Saat Fathu Makkah (pembebasan kota Mekah), Rasulullah memaafkan para musuhnya yang dulu pernah menyiksanya.' },
  { q: 'Tuliskan 3 langkah nyata untuk menciptakan kerukunan di lingkungan masyarakat sesuai pesan Q.S. Al-Hujurat ayat 13!', essay: true, sample: 'Menghormati perbedaan, saling tolong-menolong, and menjaga persatuan.', expl: 'Kerukunan dapat diciptakan dengan menghargai perbedaan fisik/suku, tidak saling mengejek, and aktif bergotong-royong.' },
  { q: 'Bagaimana perilaku yang mencerminkan sikap sabar and syukur dalam menghadapi takdir Allah Swt.?', essay: true, sample: 'Tetap sabar saat mendapat musibah and bersyukur saat mendapat nikmat.', expl: 'Sikap sabar ditunjukkan dengan tidak mengeluh saat susah, and syukur dengan mengucapkan alhamdulillah saat senang.' },
  { q: 'Jelaskan sikap tawakal yang benar setelah seseorang berikhtiar dengan sungguh-sungguh!', essay: true, sample: 'Berusaha dengan sungguh-sungguh lalu menyerahkan hasilnya kepada Allah Swt.', expl: 'Tawakal yang benar adalah berserah diri kepada Allah SETELAH melakukan usaha maksimal (ikhtiar).' },
  { q: 'Jelaskan hikmah zakat and sedekah bagi kehidupan masyarakat!', essay: true, sample: 'Membantu orang yang membutuhkan, mengurangi kesenjangan sosial, and mempererat persaudaraan.', expl: 'Zakat and sedekah dapat membersihkan harta, membantu fakir miskin, and mempererat tali persaudaraan.' },
  { q: 'Tuliskan salah satu strategi kepemimpinan Khulafaurasyidin dalam menghadapi tantangan umat Islam!', essay: true, sample: 'Menegakkan keadilan and mengutamakan musyawarah dalam menyelesaikan masalah umat.', expl: 'Para khalifah selalu mengutamakan musyawarah (syura) untuk mengambil keputusan demi kepentingan umat.' }
];

const mathQuestions = [
  { q: 'Bilangan 54.327 dibaca ....', o: ['lima puluh empat ribu tiga ratus dua puluh tujuh', 'lima ribu empat ratus tiga puluh dua tujuh', 'lima puluh empat ribu tiga puluh dua tujuh', 'lima ratus empat puluh tiga ribu dua puluh tujuh'], a: 0, expl: 'Angka 5 menempati puluhan ribu, 4 ribuan, 3 ratusan, 2 puluhan, and 7 satuan.' },
  { q: 'Tiga puluh delapan ribu lima ratus enam ditulis ....', o: ['38.056', '38.506', '38.560', '35.806'], a: 1, expl: 'Tuliskan angka sesuai nilai tempatnya: 38 di ribuan, 5 di ratusan, and 6 di satuan (puluhannya nol).' },
  { q: 'Nilai tempat angka 7 pada bilangan 47.325 adalah ....', o: ['satuan', 'puluhan', 'ribuan', 'ribu puluhan'], a: 2, expl: 'Pada bilangan 47.325, angka 4=puluhan ribu, 7=ribuan, 3=ratusan, 2=puluhan, 5=satuan.' },
  { q: 'Perhatikan bilangan berikut!\n45.321, 54.123, 43.215, 52.134\n\nUrutan dari yang terkecil adalah ....', o: ['43.215, 45.321, 52.134, 54.123', '45.321, 43.215, 52.134, 54.123', '54.123, 52.134, 45.321, 43.215', '43.215, 52.134, 45.321, 54.123'], a: 0, expl: 'Bandingkan angka puluh ribuan terlebih dahulu: 43 < 45 < 52 < 54.' },
  { q: 'Bentuk komposisi dari 62.543 adalah ....', o: ['60.000 + 2.000 + 500 + 40 + 3', '6.000 + 2.000 + 500 + 40 + 3', '60.000 + 20 + 500 + 40 + 3', '62.000 + 500 + 43'], a: 0, expl: 'Uraikan sesuai nilai tempatnya: 60.000 + 2.000 + 500 + 40 + 3.' },
  { q: 'Bentuk dekomposisi dari 84.216 adalah ....', o: ['80.000 + 4.000 + 200 + 10 + 6', '8.000 + 400 + 20 + 16', '84.000 + 216', '80.000 + 42 + 16'], a: 0, expl: 'Dekomposisi adalah menjabarkan angka: 8 puluhan ribu, 4 ribuan, 2 ratusan, 1 puluhan, 6 satuan.' },
  { q: 'Ibu memiliki uang Rp75.000,00. Digunakan membeli buku Rp25.000,00 dan pensil Rp10.000,00. Sisa uang ibu adalah ....', o: ['Rp35.000,00', 'Rp40.000,00', 'Rp45.000,00', 'Rp50.000,00'], a: 1, expl: 'Sisa uang = Total uang - Pengeluaran. Rp75.000 - (Rp25.000 + Rp10.000) = Rp75.000 - Rp35.000 = Rp40.000.' },
  { q: 'Hasil dari 23.450 + 15.325 − 8.200 adalah ....', o: ['30.575', '31.575', '32.575', '33.575'], a: 0, expl: 'Hitung penjumlahan dulu: 23.450 + 15.325 = 38.775. Lalu kurangi: 38.775 - 8.200 = 30.575.' },
  { q: 'Hasil dari 24 × 12 ÷ 6 adalah ....', o: ['24', '36', '48', '72'], a: 2, expl: 'Bisa dihitung berurutan: 24 x 12 = 288, lalu 288 / 6 = 48. Atau sederhanakan: 12 / 6 = 2, lalu 24 x 2 = 48.' },
  { q: 'Tiga lampu berkedip setiap 6 detik, 8 detik, and 12 detik. Ketiga lampu akan berkedip bersama lagi setiap ....', o: ['12 detik', '18 detik', '24 detik', '48 detik'], a: 2, expl: 'Cari KPK dari 6, 8, and 12. Kelipatan 6: 6,12,18,24. Kelipatan 8: 8,16,24. Kelipatan 12: 12,24. KPK-nya adalah 24.' },
  { q: 'Pecahan terbesar adalah ....', o: ['1/2', '2/3', '3/4', '4/5'], a: 3, expl: 'Ubah ke desimal agar mudah: 1/2=0.5; 2/3=0.66; 3/4=0.75; 4/5=0.8. Jadi 4/5 adalah yang terbesar.' },
  { q: 'Urutan pecahan dari yang terkecil adalah ....', o: ['1/2, 2/3, 3/4, 4/5', '4/5, 3/4, 2/3, 1/2', '2/3, 1/2, 4/5, 3/4', '3/4, 1/2, 2/3, 4/5'], a: 0, expl: 'Sesuai nilai desimalnya: 0.5 < 0.66 < 0.75 < 0.8.' },
  { q: 'Ani memiliki pita 1/2 meter, lalu membeli lagi 1/4 meter and 1/8 meter. Jumlah pita Ani adalah ....', o: ['5/8 meter', '6/8 meter', '7/8 meter', '8/8 meter'], a: 2, expl: 'Samakan penyebutnya menjadi 8: 4/8 + 2/8 + 1/8 = 7/8 meter.' },
  { q: 'Hasil dari 7/8 − 1/4 − 1/8 adalah ....', o: ['1/4', '1/2', '5/8', '3/4'], a: 1, expl: 'Samakan penyebutnya: 7/8 - 2/8 - 1/8 = 4/8. Sederhanakan 4/8 menjadi 1/2.' },
  { q: 'Hasil dari 2 × 3/5 ÷ 2 adalah ....', o: ['1/5', '2/5', '3/5', '4/5'], a: 2, expl: '2 dikali 3/5 adalah 6/5. Lalu 6/5 dibagi 2 adalah 3/5 kembali.' },
  { q: 'Bentuk desimal dari 3/4 adalah ....', o: ['0,25', '0,5', '0,75', '0,8'], a: 2, expl: '3 dibagi 4 adalah 0.75. Caranya 30 dibagi 4 dapat 7 sisa 2, dst.' },
  { q: 'Urutan desimal dari yang terbesar adalah ....\n0,5 ; 0,7 ; 0,2 ; 0,9', o: ['0,2 ; 0,5 ; 0,7 ; 0,9', '0,9 ; 0,7 ; 0,5 ; 0,2', '0,7 ; 0,9 ; 0,5 ; 0,2', '0,9 ; 0,5 ; 0,7 ; 0,2'], a: 1, expl: 'Bandingkan angka di belakang koma: 9 > 7 > 5 > 2.' },
  { q: 'Nilai x pada 245 + x = 500 adalah ....', o: ['245', '255', '265', '275'], a: 1, expl: 'Gunakan operasi kebalikan: x = 500 - 245 = 255.' },
  { q: 'Nilai n pada 12 × n = 144 adalah ....', o: ['10', '11', '12', '13'], a: 2, expl: 'Operasi kebalikannya adalah pembagian: n = 144 / 12 = 12.' },
  { q: 'Pola bilangan berikut:\n2, 4, 8, 16, ....\n\nBilangan selanjutnya adalah ....', o: ['18', '24', '30', '32'], a: 3, expl: 'Polanya adalah dikali 2 untuk setiap suku berikutnya. 16 x 2 = 32.' },
  { q: 'Pola bilangan berikut:\n160, 80, 40, 20, ....\n\nBilangan selanjutnya adalah ....', o: ['5', '10', '15', '25'], a: 1, expl: 'Polanya adalah dibagi 2 untuk setiap suku berikutnya. 20 / 2 = 10.' },
  { q: 'Harga 3 buku adalah Rp18.000,00. Harga 1 buku adalah ....', o: ['Rp4.000,00', 'Rp5.000,00', 'Rp6.000,00', 'Rp7.000,00'], a: 2, expl: 'Bagi total harga dengan jumlah buku: Rp18.000 / 3 = Rp6.000.' },
  { q: 'Sebuah persegi panjang memiliki panjang 12 cm and lebar 8 cm. Luasnya adalah ....', o: ['20 cm²', '48 cm²', '96 cm²', '120 cm²'], a: 2, expl: 'Luas persegi panjang = panjang x lebar. 12 cm x 8 cm = 96 cm².' },
  { q: 'Sebuah bangun gabungan memiliki sisi luar total 40 cm. Keliling bangun tersebut adalah ....', o: ['20 cm', '30 cm', '40 cm', '50 cm'], a: 2, expl: 'Keliling adalah jumlah panjang semua sisi terluar bangun tersebut.' },
  { q: 'Luas gabungan bangun datar adalah ....', o: ['120 cm²', '140 cm²', '160 cm²', '180 cm²'], a: 2, expl: 'Hitung luas masing-masing bagian bangun datar lalu jumlahkan.' },
  { q: 'Jumlah sudut dalam segitiga adalah ....', o: ['90°', '180°', '270°', '360°'], a: 1, expl: 'Semua jenis segitiga jika ketiga sudut dalamnya dijumlahkan hasilnya pasti 180°.' },
  { q: 'Bangun ruang yang semua rusuknya sama panjang adalah ....', o: ['tabung', 'kerucut', 'balok', 'kubus'], a: 3, expl: 'Kubus terbentuk dari 6 persegi yang kongruen, sehingga semua rusuknya sama panjang.' },
  { q: 'Jaring-jaring yang dapat membentuk kubus terdiri dari ....', o: ['4 persegi', '5 persegi', '6 persegi', '8 persegi'], a: 2, expl: 'Kubus memiliki 6 buah sisi, sehingga jaring-jaringnya terdiri dari 6 buah persegi.' },
  { q: 'Bagian paling atas dari balok disebut ....', o: ['sisi atas', 'sisi depan', 'sisi samping', 'sisi belakang'], a: 0, expl: 'Sisi yang berada di posisi atas dinamakan sisi atas atau tutup balok.' },
  { q: 'Bangun datar yang memiliki dua pasang sisi sejajar adalah ....', o: ['segitiga', 'persegi panjang', 'lingkaran', 'layang-layang'], a: 1, expl: 'Persegi panjang and jajar genjang memiliki dua pasang sisi yang sejajar dan sama panjang.' },
  { q: 'Bangun ruang yang memiliki 6 sisi berbentuk persegi panjang adalah ....', o: ['kubus', 'balok', 'kerucut', 'tabung'], a: 1, expl: 'Balok adalah bangun ruang 3 dimensi yang dibentuk oleh 3 pasang persegi panjang.' },
  { q: 'Pada peta berpetak, sekolah berada di kolom B baris 3. Lokasi sekolah adalah ....', o: ['A3', 'B2', 'B3', 'C3'], a: 2, expl: 'Titik koordinat ditulis dengan menyebutkan kolom dulu baru baris: B3.' },
  { q: 'Data tinggi badan siswa paling tepat disajikan dalam bentuk ....', o: ['diagram batang', 'cerita', 'paragraf', 'gambar bebas'], a: 0, expl: 'Diagram batang sangat cocok untuk membandingkan data kuantitatif seperti tinggi badan.' },
  { q: 'Diagram batang digunakan untuk ....', o: ['menghitung luas', 'menunjukkan data', 'menghitung keliling', 'mencari sudut'], a: 1, expl: 'Fungsi utama diagram batang adalah untuk menyajikan dan menunjukkan data visual agar mudah dibaca.' },
  { q: 'Dalam kantong terdapat 5 bola merah and 2 bola biru. Bola yang kemungkinan paling besar terambil adalah ....', o: ['bola biru', 'bola merah', 'keduanya sama', 'tidak mungkin diambil'], a: 1, expl: 'Peluang terbesar adalah warna yang jumlahnya paling banyak, yaitu bola merah (5 buah).' },
  { q: 'Tiga anak berolahraga setiap 6 hari, 8 hari, and 12 hari sekali. Jika hari ini mereka berolahraga bersama, berapa hari lagi mereka akan berolahraga bersama kembali?', essay: true, sample: 'KPK dari 6, 8, and 12 adalah 24. Jadi mereka akan berolahraga bersama lagi 24 hari kemudian.', expl: 'Masalah ini diselesaikan dengan mencari KPK dari 6, 8, and 12 yang hasilnya adalah 24.' },
  { q: 'Sebuah mobil menempuh jarak 180 km dalam waktu 3 jam. Berapa km jarak yang ditempuh mobil setiap jam?', essay: true, sample: '180 ÷ 3 = 60 km/jam.', expl: 'Kecepatan = Jarak / Waktu. 180 km / 3 jam = 60 km/jam.' },
  { q: 'Sebuah persegi memiliki panjang sisi 15 cm. Hitunglah keliling persegi tersebut!', essay: true, sample: 'Keliling persegi = 4 × 15 = 60 cm.', expl: 'Keliling persegi = 4 x sisi. Jadi 4 x 15 cm = 60 cm.' },
  { q: 'Film dimulai pukul 08.15 and selesai pukul 10.45. Berapa lama durasi film tersebut?', essay: true, sample: 'Durasi film = 2 jam 30 menit.', expl: 'Waktu selesai dikurangi waktu mulai: 10.45 - 08.15 = 2 jam 30 menit.' },
  { q: 'Data jumlah buku yang dibaca siswa:\n2, 3, 2, 4, 5, 3, 4, 2\n\nSajikan data tersebut ke dalam bentuk tabel!', essay: true, sample: 'Jumlah Buku 2: Frekuensi 3, Jumlah Buku 3: Frekuensi 2, Jumlah Buku 4: Frekuensi 2, Jumlah Buku 5: Frekuensi 1.', expl: 'Hitung berapa kali setiap angka muncul (frekuensi) lalu masukkan ke dalam tabel data.' }
];

const indoQuestions = [
  { q: 'Perhatikan teks berikut!\n\n“Pada pagi hari terjadi banjir di beberapa wilayah karena hujan deras sejak malam.”\n\nIde pokok teks tersebut adalah ....', o: ['warga membersihkan rumah', 'hujan deras menyebabkan banjir', 'pagi hari sangat cerah', 'sungai menjadi kering'], a: 1, expl: 'Teks menyebutkan banjir terjadi karena hujan deras sejak malam, sehingga ide pokoknya adalah hujan deras menyebabkan banjir.' },
  { q: 'Kalimat yang merupakan opini adalah ....', o: ['Matahari terbit dari timur.', 'Indonesia memiliki banyak pulau.', 'Menurut saya, pantai itu sangat indah.', 'Air mendidih pada suhu 100°C.'], a: 2, expl: 'Kalimat yang diawali dengan "Menurut saya" adalah opini karena merupakan pendapat pribadi yang subjektif.' },
  { q: 'Sinonim kata “pandai” adalah ....', o: ['malas', 'bodoh', 'cerdas', 'lemah'], a: 2, expl: 'Sinonim adalah persamaan kata. Kata "pandai" memiliki arti yang sama dengan "cerdas".' },
  { q: 'Gunung meletus terjadi karena adanya tekanan magma dari dalam bumi. Tekanan tersebut menyebabkan material vulkanik keluar melalui kawah.\n\nKesimpulan teks tersebut adalah ....', o: ['gunung meletus disebabkan tekanan magma', 'magma berasal dari laut', 'semua gunung pasti meletus', 'kawah berada di sungai'], a: 0, expl: 'Kesimpulan teks adalah inti dari informasi yang disampaikan, yaitu gunung meletus disebabkan oleh tekanan magma.' },
  { q: '“Lingkungan bersih membuat hidup menjadi sehat dan nyaman.”\n\nGagasan utama paragraf tersebut adalah ....', o: ['hidup sehat', 'lingkungan bersih membuat nyaman', 'membuang sampah', 'udara panas'], a: 1, expl: 'Gagasan utama paragraf tersebut adalah tentang lingkungan bersih yang membuat hidup menjadi nyaman.' },
  { q: 'Beni tetap membantu temannya walaupun ia sendiri sedang kesulitan.\n\nAmanat cerita tersebut adalah ....', o: ['jangan suka menolong', 'menolong harus menunggu kaya', 'kita harus peduli terhadap sesama', 'jangan berteman dengan siapa pun'], a: 2, expl: 'Amanat adalah pesan moral. Cerita tersebut mengajarkan kita untuk selalu peduli dan menolong sesama.' },
  { q: 'Data siswa gemar membaca:\n\n* Kelas 4 = 20 siswa\n* Kelas 5 = 25 siswa\n* Kelas 6 = 30 siswa\n\nKelas yang paling banyak gemar membaca adalah ....', o: ['kelas 4', 'kelas 5', 'kelas 6', 'semua sama'], a: 2, expl: 'Berdasarkan data, Kelas 6 memiliki jumlah siswa terbanyak yang gemar membaca, yaitu 30 siswa.' },
  { q: '“Angin bernyanyi lirih di malam hari.”\n\nKalimat tersebut menggunakan majas ....', o: ['hiperbola', 'personifikasi', 'metafora', 'ironi'], a: 1, expl: 'Majas personifikasi adalah gaya bahasa yang mengumpamakan benda mati (angin) seolah-olah memiliki sifat manusia (bernyanyi).' },
  { q: '“Aku akan terus belajar agar menjadi juara,” kata Rani dengan semangat.\n\nWatak Rani adalah ....', o: ['pemalas', 'sombong', 'rajin and semangat', 'penakut'], a: 2, expl: 'Pernyataan Rani yang ingin terus belajar menunjukkan bahwa ia memiliki watak yang rajin and penuh semangat.' },
  { q: 'Kalimat sanggahan yang santun adalah ....', o: ['Pendapatmu salah total!', 'Saya kurang setuju karena ada data lain.', 'Kamu tidak mengerti masalahnya.', 'Eso ide yang buruk.'], a: 1, expl: 'Sanggahan yang santun menggunakan bahasa yang tidak menyerang pribadi dan disertai dengan alasan yang logis.' },
  { q: 'Penggunaan tanda baca yang tepat adalah ....', o: ['Ibu membeli sayur buah dan ikan.', 'Ibu membeli sayur, buah, dan ikan.', 'Ibu membeli, sayur buah dan ikan.', 'Ibu membeli sayur buah, dan ikan.'], a: 1, expl: 'Tanda koma (,) digunakan untuk memisahkan unsur-unsur dalam suatu pemerincian yang lebih dari dua.' },
  { q: 'Doni rajin belajar .... nilainya tetap rendah.\n\nKonjungsi yang tepat adalah ....', o: ['dan', 'karena', 'tetapi', 'lalu'], a: 2, expl: 'Konjungsi "tetapi" digunakan untuk menghubungkan dua hal yang saling bertentangan (rajin belajar vs nilai rendah).' },
  { q: 'Urutan membuat teh yang benar adalah ....\n\n1. Masukkan gula\n2. Tuang air panas\n3. Masukkan teh\n4. Aduk hingga rata\n\nUrutan yang tepat adalah ....', o: ['1-2-3-4', '3-1-2-4', '2-3-1-4', '4-3-2-1'], a: 1, expl: 'Urutan yang logis adalah memasukkan teh dulu, lalu gula, menuangkan air panas, and terakhir diaduk.' },
  { q: 'Judul buku yang termasuk nonfiksi adalah ....', o: ['Kisah Sang Kancil', 'Petualangan di Hutan', 'Ensiklopedia Hewan', 'Negeri Dongeng'], a: 2, expl: 'Nonfiksi adalah karya berdasarkan fakta. Ensiklopedia berisi informasi ilmiah yang nyata.' },
  { q: '“Hormat saya,” merupakan bagian dari ....', o: ['pembuka surat', 'isi surat', 'penutup surat', 'alamat surat'], a: 2, expl: 'Frasa "Hormat saya" adalah salam penutup yang umum digunakan dalam surat.' },
  { q: '“Malam itu hujan turun sangat deras.”\n\nLatar waktu pada kalimat tersebut adalah ....', o: ['pagi hari', 'siang hari', 'sore hari', 'malam hari'], a: 3, expl: 'Kata "Malam itu" secara jelas menunjukkan bahwa latar waktu peristiwa tersebut adalah malam hari.' },
  { q: 'Ayah sedang .... halaman rumah.\n\nKata berimbuhan yang tepat adalah ....', o: ['sapu', 'menyapu', 'pesapu', 'tersapu'], a: 1, expl: 'Kata dasar "sapu" jika diberi imbuhan me- untuk menyatakan tindakan aktif menjadi "menyapu".' },
  { q: 'Bagian cerita yang mulai muncul masalah disebut ....', o: ['orientasi', 'komplikasi', 'resolusi', 'koda'], a: 1, expl: 'Komplikasi adalah bagian dalam struktur teks narasi di mana konflik atau masalah mulai muncul.' },
  { q: 'Bagian hasil dalam laporan pengamatan berisi ....', o: ['nama penulis', 'hasil pengamatan', 'alamat rumah', 'salam pembuka'], a: 1, expl: 'Bagian hasil laporan tentu saja harus memuat data atau temuan yang didapat selama pengamatan.' },
  { q: 'Obat diminum 3 kali sehari sesudah makan.\n\nJika sarapan pukul 06.00, makan siang pukul 12.00, dan makan malam pukul 18.00, maka obat diminum ....', o: ['sebelum makan', 'sesudah makan', 'hanya pagi hari', 'hanya malam hari'], a: 1, expl: 'Sesuai petunjuk, obat harus diminum "sesudah makan" pada waktu-waktu yang telah ditentukan.' },
  { q: 'Burung terbang tinggi di awan\nMelihat indah hamparan ....\n\nKata yang tepat untuk melengkapi puisi adalah ....', o: ['sawah', 'meja', 'buku', 'kursi'], a: 0, expl: 'Kata "sawah" memiliki rima akhir yang harmonis dengan "awan" and logis dilihat dari sudut pandang burung di udara.' },
  { q: 'Jalan menjadi licin karena hujan deras.\n\nPenyebab jalan licin adalah ....', o: ['angin kencang', 'hujan deras', 'panas matahari', 'kendaraan banyak'], a: 1, expl: 'Teks menyatakan secara langsung bahwa penyebab jalan menjadi licin adalah karena hujan deras.' },
  { q: 'Penulisan yang benar adalah ....', o: ['saya tinggal di tegal', 'saya tinggal di Tegal', 'Saya tinggal di tegal', 'saya Tinggal di Tegal'], a: 1, expl: 'Nama diri geografis (nama kota) harus ditulis dengan huruf awal kapital (Tegal).' },
  { q: '“Benda ini berbentuk bulat, dapat memantulkan cahaya, dan digunakan untuk melihat bayangan.”\n\nObjek yang dimaksud adalah ....', o: ['meja', 'cermin', 'kursi', 'pensil'], a: 1, expl: 'Benda yang memiliki sifat memantulkan cahaya untuk melihat bayangan diri adalah cermin.' },
  { q: 'Persamaan kedua teks tentang lingkungan adalah ....', o: ['sama-sama membahas kebersihan', 'sama-sama tentang olahraga', 'sama-sama tentang permainan', 'sama-sama tentang makanan'], a: 0, expl: 'Persamaan isi teks dicari dengan melihat topik umum yang dibahas oleh kedua teks tersebut.' },
  { q: 'Kata baku dari “apotik” adalah ....', o: ['apotik', 'apoteik', 'apotek', 'apotrek'], a: 2, expl: 'Menurut Kamus Besar Bahasa Indonesia (KBBI), penulisan kata baku yang benar adalah "apotek".' },
  { q: '“Aku berjalan menuju sekolah sambil membawa tas.”\n\nSudut pandang cerita tersebut adalah ....', o: ['orang ketiga', 'orang pertama', 'campuran', 'pengamat'], a: 1, expl: 'Penggunaan kata ganti "Aku" menunjukkan bahwa cerita menggunakan sudut pandang orang pertama.' },
  { q: 'Ringkasan yang baik adalah ....', o: ['memuat inti cerita', 'lebih panjang dari teks', 'menggunakan semua kalimat', 'ditulis acak'], a: 0, expl: 'Ringkasan bertujuan untuk menyajikan teks yang panjang menjadi lebih singkat dengan tetap memuat inti sarinya.' },
  { q: 'Arti ungkapan “ringan tangan” adalah ....', o: ['suka membantu', 'suka marah', 'malas bekerja', 'suka menangis'], a: 0, expl: 'Ungkapan "ringan tangan" adalah idiom yang berarti suka memberikan bantuan atau suka menolong.' },
  { q: 'Kalimat tanggapan yang positif adalah ....', o: ['Presentasimu membosankan.', 'Penyampaianmu sudah bagus dan jelas.', 'Kamu terlalu lama berbicara.', 'Saya tidak suka hasilnya.'], a: 1, expl: 'Tanggapan positif adalah tanggapan yang bersifat mendukung, memuji, atau memberikan apresiasi yang baik.' },
  { q: 'Tujuan iklan adalah ....', o: ['menghibur pembaca', 'menawarkan barang atau jasa', 'membuat cerita', 'menulis puisi'], a: 1, expl: 'Iklan dibuat dengan tujuan utama untuk mempromosikan atau menawarkan suatu produk (barang/jasa) kepada masyarakat.' },
  { q: 'Ibu memasak nasi di dapur.\n\nBentuk pasif yang tepat adalah ....', o: ['Nasi dimasak ibu di dapur.', 'Ibu dimasak nasi di dapur.', 'Dapur memasak nasi oleh ibu.', 'Nasi memasak ibu di dapur.'], a: 0, expl: 'Kalimat pasif dibentuk dengan mengubah objek (nasi) menjadi subjek, and predikat menggunakan awalan di- (dimasak).' },
  { q: 'Rina belajar dengan rajin setiap hari. Saat ujian, ia dapat mengerjakan semua soal dengan baik.\n\nKemungkinan akhir cerita adalah ....', o: ['Rina gagal ujian', 'Rina dimarahi guru', 'Rina mendapat nilai bagus', 'Rina tidak masuk sekolah'], a: 2, expl: 'Berdasarkan premis bahwa ia rajin and bisa menjawab soal, kesimpulan logisnya adalah ia akan mendapat nilai bagus.' },
  { q: 'Antonim kata “tinggi” adalah ....', o: ['besar', 'pendek', 'luas', 'kecil'], a: 1, expl: 'Antonim adalah lawan kata. Lawan kata dari "tinggi" dalam konteks ukuran adalah "pendek".' },
  { q: 'Tulisan di dalam kurung pada naskah drama disebut ....', o: ['dialog', 'amanat', 'kramagung', 'prolog'], a: 2, expl: 'Kramagung adalah petunjuk perilaku, tindakan, atau perbuatan yang harus dilakukan oleh tokoh dalam naskah drama.' },
  { q: 'Jelaskan alasan perubahan sifat tokoh utama dalam sebuah cerita yang pernah kamu baca!', essay: true, sample: 'Karena tokoh mendapat nasihat, pengalaman, atau menyadari kesalahannya.', expl: 'Perubahan sifat tokoh (karakter dinamis) biasanya terjadi karena adanya konflik, pengalaman baru, atau kesadaran setelah mengalami suatu peristiwa.' },
  { q: 'Tuliskan 5 langkah menggunakan mesin pencari (search engine) di internet!', essay: true, sample: '1) Menyalakan perangkat\n2) Membuka browser\n3) Membuka mesin pencari\n4) Mengetik kata kunci\n5) Memilih hasil pencarian yang sesuai', expl: 'Langkah-langkah tersebut merupakan urutan logis standar dalam menggunakan mesin pencari seperti Google.' },
  { q: 'Tuliskan 2 fakta dan 1 opini tentang lingkungan sekolah!', essay: true, sample: 'Fakta:\n* Sekolah memiliki banyak pohon.\n* Siswa membuang sampah pada tempatnya.\n\nOpini:\n* Lingkungan sekolah sangat nyaman.', expl: 'Fakta adalah hal yang benar-benar terjadi dan dapat dibuktikan. Opini adalah penilaian atau perasaan pribadi seseorang.' },
  { q: 'Buatlah satu paragraf deskripsi tentang kantin sekolah yang bersih dan sehat!', essay: true, sample: 'Kantin sekolah terlihat bersih dan rapi. Meja serta kursinya tertata dengan baik. Makanan disimpan di tempat tertutup sehingga tetap higienis. Di sekitar kantin juga tersedia tempat sampah sehingga lingkungan tetap bersih dan sehat.', expl: 'Paragraf deskripsi harus menggambarkan objek secara jelas agar pembaca seolah-olah dapat melihat atau merasakannya sendiri.' },
  { q: 'Perbaiki kalimat berikut agar menjadi efektif!\n\na. Saya melihat dengan mata kepala saya sendiri.\nb. Naik ke atas panggung.\nc. Turun ke bawah dengan cepat.', essay: true, sample: 'a. Saya melihat sendiri.\nb. Naik panggung.\nc. Turun dengan cepat.', expl: 'Kalimat efektif harus hemat kata. Kata "mata kepala", "ke atas" (setelah naik), and "ke bawah" (setelah turun) adalah pemborosan kata.' }
];

const ppknQuestions = [
  { q: 'Lambang sila pertama Pancasila adalah ....', o: ['rantai', 'pohon beringin', 'bintang', 'kepala banteng'], a: 2, expl: 'Lambang sila pertama adalah Bintang Emas.' },
  { q: 'Bunyi sila kedua Pancasila adalah ....', o: ['Persatuan Indonesia', 'Kemanusiaan yang adil dan beradab', 'Kerakyatan yang dipimpin oleh hikmat kebijaksanaan', 'Keadilan sosial bagi seluruh rakyat Indonesia'], a: 1, expl: 'Sila ke-2 berbunyi: Kemanusiaan yang adil dan beradab.' },
  { q: 'Sikap yang sesuai dengan sila pertama Pancasila adalah ....', o: ['menghormati teman yang berbeda agama', 'memilih teman berdasarkan suku', 'memaksakan pendapat kepada orang lain', 'tidak mau membantu tetangga'], a: 0, expl: 'Menghormati perbedaan agama adalah wujud pengamalan sila pertama (Ketuhanan Yang Maha Esa).' },
  { q: 'Contoh sikap yang mencerminkan sila kedua Pancasila adalah ....', o: ['kerja bakti membersihkan lingkungan', 'menghargai hak orang lain', 'menggunakan produk luar negeri', 'memilih ketua kelas sendiri'], a: 1, expl: 'Menghargai hak asasi orang lain mencerminkan nilai kemanusiaan (sila ke-2).' },
  { q: 'Semboyan bangsa Indonesia adalah ....', o: ['Tut Wuri Handayani', 'Bhinneka Tunggal Ika', 'Ing Ngarsa Sung Tuladha', 'Merdeka Belajar'], a: 1, expl: 'Semboyan negara kita adalah Bhinneka Tunggal Ika.' },
  { q: 'Makna semboyan Bhinneka Tunggal Ika adalah ....', o: ['berbeda-beda tetapi tetap satu', 'bersatu kita runtuh', 'hidup harus sendiri', 'persatuan hanya untuk kelompok tertentu'], a: 0, expl: 'Bhinneka Tunggal Ika berarti berbeda-beda tetapi tetap satu jua.' },
  { q: 'Contoh sikap menjaga persatuan di sekolah adalah ....', o: ['memilih teman yang kaya saja', 'bertengkar karena perbedaan pendapat', 'bermain bersama tanpa membeda-bedakan teman', 'mengejek budaya daerah lain'], a: 2, expl: 'Bermain tanpa membeda-bedakan teman memupuk rasa persatuan (sila ke-3).' },
  { q: 'Aturan dibuat agar kehidupan menjadi ....', o: ['kacau', 'tertib', 'bebas', 'sulit'], a: 1, expl: 'Tujuan dibuatnya aturan atau hukum adalah untuk menciptakan ketertiban.' },
  { q: 'Contoh kewajiban siswa di sekolah adalah ....', o: ['mendapat nilai bagus', 'menggunakan fasilitas sekolah', 'menaati tata tertib sekolah', 'menerima penghargaan'], a: 2, expl: 'Menaati tata tertib adalah kewajiban mutlak setiap siswa.' },
  { q: 'Hak seorang anak di rumah adalah ....', o: ['membersihkan rumah', 'menghormati orang tua', 'mendapatkan kasih sayang', 'membantu adik belajar'], a: 2, expl: 'Mendapatkan kasih sayang adalah hak anak, sedangkan menghormati orang tua adalah kewajiban.' },
  { q: 'Musyawarah dilakukan untuk mencapai ....', o: ['pertengkaran', 'kemenangan pribadi', 'mufakat', 'hukuman'], a: 2, expl: 'Musyawarah bertujuan untuk menghasilkan keputusan bersama atau mufakat.' },
  { q: 'Sikap yang harus dihindari saat musyawarah adalah ....', o: ['menghargai pendapat orang lain', 'memaksakan kehendak', 'mendengarkan pendapat teman', 'berbicara sopan'], a: 1, expl: 'Memaksakan kehendak merusak esensi musyawarah yang demokratis.' },
  { q: 'Pemimpin hasil pemilihan disebut ....', o: ['ketua', 'rakyat', 'anggota', 'warga'], a: 0, expl: 'Pemimpin organisasi atau kelompok yang dipilih biasanya disebut ketua.' },
  { q: 'Contoh kerja sama di lingkungan masyarakat adalah ....', o: ['kerja bakti membersihkan selokan', 'belajar sendiri di rumah', 'bermain game sepanjang hari', 'menonton televisi bersama'], a: 0, expl: 'Kerja bakti adalah bentuk nyata gotong royong di masyarakat.' },
  { q: 'Keberagaman suku bangsa di Indonesia harus disikapi dengan ....', o: ['permusuhan', 'rasa bangga dan saling menghargai', 'saling mengejek', 'membandingkan budaya'], a: 1, expl: 'Keberagaman adalah kekayaan bangsa yang harus kita hargai dan banggakan.' },
  { q: 'Lagu kebangsaan Indonesia adalah ....', o: ['Garuda Pancasila', 'Indonesia Raya', 'Hari Merdeka', 'Tanah Airku'], a: 1, expl: 'Lagu kebangsaan kita adalah Indonesia Raya.' },
  { q: 'Bendera negara Indonesia berwarna ....', o: ['merah putih', 'merah biru', 'putih hijau', 'kuning merah'], a: 0, expl: 'Bendera negara kita adalah Sang Merah Putih.' },
  { q: 'Contoh pelaksanaan sila ketiga Pancasila adalah ....', o: ['beribadah tepat waktu', 'menghormati guru', 'mengikuti upacara bendera dengan tertib', 'membantu teman belajar'], a: 2, expl: 'Mengikuti upacara dengan tertib adalah wujud cinta tanah air dan persatuan.' },
  { q: 'Salah satu manfaat hidup rukun adalah ....', o: ['menambah permusuhan', 'lingkungan menjadi nyaman', 'pekerjaan menjadi sulit', 'banyak terjadi pertengkaran'], a: 1, expl: 'Hidup rukun menciptakan kedamaian dan kenyamanan.' },
  { q: 'Jika ada teman berbeda pendapat, sikap kita sebaiknya ....', o: ['marah', 'mengejek', 'menghargai pendapatnya', 'memutus pertemanan'], a: 2, expl: 'Menghargai perbedaan pendapat adalah cerminan sikap demokratis.' },
  { q: 'Contoh sikap cinta tanah air adalah ....', o: ['merusak fasilitas umum', 'memakai produk dalam negeri', 'membuang sampah sembarangan', 'tidak mengikuti upacara'], a: 1, expl: 'Mencintai dan menggunakan produk dalam negeri membantu perekonomian bangsa.' },
  { q: 'Dasar negara Indonesia adalah ....', o: ['UUD 1945', 'Garuda Pancasila', 'Pancasila', 'Bhinneka Tunggal Ika'], a: 2, expl: 'Pancasila adalah dasar negara atau landasan idiil Indonesia.' },
  { q: 'Lambang negara Indonesia adalah ....', o: ['harimau', 'Garuda Pancasila', 'pohon beringin', 'burung merpati'], a: 1, expl: 'Lambang negara kita adalah Burung Garuda Pancasila.' },
  { q: 'Sikap disiplin dapat dimulai dengan ....', o: ['datang terlambat', 'menaati aturan', 'melanggar tata tertib', 'membuang sampah sembarangan'], a: 1, expl: 'Disiplin berarti patuh dan taat pada aturan yang berlaku.' },
  { q: 'Menghormati guru termasuk pengamalan sila ke ....', o: ['satu', 'dua', 'tiga', 'empat'], a: 1, expl: 'Menghormati guru mencerminkan nilai kemanusiaan yang adil dan beradab (sila ke-2).' },
  { q: 'Contoh hak di sekolah adalah ....', o: ['menjaga kebersihan kelas', 'menaati tata tertib', 'mendapatkan pelajaran', 'mengikuti upacara'], a: 2, expl: 'Mendapatkan pelajaran dan ilmu adalah hak utama setiap siswa.' },
  { q: 'Jika melihat teman bertengkar, sebaiknya kita ....', o: ['ikut bertengkar', 'menonton saja', 'melerai and mendamaikan', 'memihak salah satu teman'], a: 2, expl: 'Melerai pertengkaran adalah tindakan terpuji untuk menjaga kedamaian.' },
  { q: 'Peraturan harus ditaati agar tercipta ....', o: ['kekacauan', 'ketidakadilan', 'ketertiban', 'perpecahan'], a: 2, expl: 'Ketaatan pada peraturan bermuara pada terciptanya ketertiban.' },
  { q: 'Salah satu contoh tanggung jawab di rumah adalah ....', o: ['bermain sepanjang hari', 'membantu orang tua', 'tidur seharian', 'menonton televisi terus-menerus'], a: 1, expl: 'Membantu orang tua adalah kewajiban dan tanggung jawab anak di rumah.' },
  { q: 'Mengutamakan kepentingan bersama mencerminkan nilai ....', o: ['egois', 'persatuan', 'kemalasan', 'permusuhan'], a: 1, expl: 'Mementingkan kepentingan umum di atas pribadi mencerminkan sila ke-3.' },
  { q: 'Pemilu merupakan sarana untuk memilih ....', o: ['hadiah', 'permainan', 'pemimpin', 'pekerjaan'], a: 2, expl: 'Pemilu (Pemilihan Umum) adalah sarana demokrasi untuk memilih pemimpin bangsa.' },
  { q: 'Contoh sikap toleransi adalah ....', o: ['menghina agama lain', 'menghormati teman yang beribadah', 'memaksakan keyakinan', 'mengejek budaya daerah lain'], a: 1, expl: 'Toleransi adalah menghargai perbedaan, termasuk perbedaan cara beribadah.' },
  { q: 'Salah satu contoh kewajiban terhadap lingkungan adalah ....', o: ['membuang sampah sembarangan', 'menjaga kebersihan lingkungan', 'mencoret fasilitas umum', 'merusak tanaman'], a: 1, expl: 'Menjaga kebersihan adalah tanggung jawab kita semua untuk kelestarian lingkungan.' },
  { q: 'Bela negara dapat dilakukan dengan cara ....', o: ['membuat kerusuhan', 'belajar dengan sungguh-sungguh', 'melanggar aturan sekolah', 'tidak menghormati guru'], a: 1, expl: 'Bagi pelajar, belajar sungguh-sungguh adalah wujud nyata bela negara.' },
  { q: 'Sikap yang sesuai dengan nilai keadilan adalah ....', o: ['pilih kasih terhadap teman', 'membagi tugas secara merata', 'mementingkan diri sendiri', 'tidak peduli terhadap orang lain'], a: 1, expl: 'Membagi tugas secara adil and merata mencerminkan nilai keadilan (sila ke-5).' },
  { q: 'Tuliskan 3 contoh sikap yang mencerminkan sila pertama Pancasila!', essay: true, sample: 'Beribadah sesuai agama masing-masing\nMenghormati teman yang berbeda agama\nTidak mengganggu teman saat beribadah', expl: 'Sila pertama menekankan pada ketaatan beragama dan toleransi antarumat beragama.' },
  { q: 'Mengapa kita harus menjaga persatuan dan kesatuan di sekolah?', essay: true, sample: 'Agar tercipta kerukunan, kenyamanan, dan tidak terjadi perpecahan di sekolah.', expl: 'Persatuan menciptakan suasana belajar yang kondusif, harmonis, dan bebas dari perselisihan.' },
  { q: 'Tuliskan 3 contoh hak dan kewajiban siswa di sekolah!', essay: true, sample: 'Hak:\nMendapat pelajaran\nMenggunakan fasilitas sekolah\nMendapat perlindungan guru\n\nKewajiban:\nMenaati tata tertib\nMenjaga kebersihan sekolah\nMenghormati guru', expl: 'Hak adalah apa yang layak kita terima, sedangkan kewajiban adalah apa yang harus kita lakukan dengan tanggung jawab.' },
  { q: 'Bagaimana sikapmu jika ada teman yang berbeda suku atau agama?', essay: true, sample: 'Menghormati, menghargai, and tetap berteman tanpa membeda-bedakan.', expl: 'Sikap terbaik adalah toleransi: tetap berteman baik dan saling menghargai perbedaan tersebut.' },
  { q: 'Tuliskan manfaat musyawarah dalam kehidupan sehari-hari!', essay: true, sample: 'Mempererat persatuan\nMendapat keputusan bersama\nMenghindari pertengkaran', expl: 'Musyawarah menghasilkan mufakat yang adil bagi semua pihak dan mencegah terjadinya konflik.' }
];

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
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [lockedAnswers, setLockedAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(3600);
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
  }, [started, submitted, timeLeft]);

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

  const handleSubmit = async () => {
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

      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: student.name,
          subject: getSubjectName(),
          pgScore: pgCorrect,
          essayData: essayData
        })
      });
    } catch (err) {
      console.error('Gagal menyimpan nilai ke database:', err);
    }

    // Clear current state
    localStorage.removeItem('current_quiz_state');
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

  const getSubjectName = () => {
    if (subject === 'pai') return 'PAI-BP';
    if (subject === 'math') return 'Matematika';
    if (subject === 'indo') return 'B. Indonesia';
    if (subject === 'ppkn') return 'PPKN';
    return '';
  };

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
              <div className={styles.subjectGrid}>
                <button
                  className={`${styles.subjectBtn} ${subject === 'pai' ? styles.selected : ''}`}
                  onClick={() => setSubject('pai')}
                >
                  1. PAI-BP
                </button>
                <button
                  className={`${styles.subjectBtn} ${subject === 'math' ? styles.selected : ''}`}
                  onClick={() => setSubject('math')}
                >
                  2. MATEMATIKA
                </button>
                <button
                  className={`${styles.subjectBtn} ${subject === 'indo' ? styles.selected : ''}`}
                  onClick={() => setSubject('indo')}
                >
                  3. B. INDONESIA
                </button>
                <button
                  className={`${styles.subjectBtn} ${subject === 'ppkn' ? styles.selected : ''}`}
                  onClick={() => setSubject('ppkn')}
                >
                  4. PPKN
                </button>
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

              <div className={styles.scoreDisplay}>{calculateScore()} / 100</div>

              <p style={{ color: '#8b949e', marginBottom: '2rem' }}>
                Skor di atas hanya berdasarkan soal pilihan ganda. Soal uraian akan dinilai oleh guru.
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
        <p>Asah Kemampuan, Raih Prestasi</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.2rem', opacity: 0.7 }}>@2026 Powered by DEVELZY</p>
        <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7, display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          <span>Versi 2.0 | Mode Cerdas</span>
          <span>|</span>
          <a href="/teacher" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 'bold' }}>Panel Guru</a>
        </div>
      </footer >
    </div >
  );
}
