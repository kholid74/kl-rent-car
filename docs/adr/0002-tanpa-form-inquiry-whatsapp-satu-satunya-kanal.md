# Tidak ada form inquiry; WhatsApp satu-satunya kanal tanya

`SPEC.md` meminta form kontak di `/kontak` (§5.4) dan form inquiry di halaman
korporat serta rental bulanan (§4.3). Semuanya kami hapus. Satu-satunya form
yang tersisa di situs ini adalah form booking, dan itu pun berakhir dengan
tombol yang mengembalikan pelanggan ke WhatsApp.

Riset yang mendasari spec ini sendiri menyimpulkan WhatsApp adalah kanal
konversi utama pasar rental Indonesia. Form kontak generik yang dipasang di
sebelah tombol WhatsApp adalah pilihan yang lebih buruk yang ditawarkan ke
pengunjung: balasannya lebih lambat, dan pengirimnya tidak pernah tahu apakah
pesannya sampai. Untuk klien korporat justru makin timpang — mereka lebih
menghargai balasan manusia dalam hitungan menit daripada formulir.

Ada juga alasan yang lebih memalukan kalau diabaikan: form yang disimpan ke
database tanpa halaman admin untuk membacanya adalah fitur mati, dan form
`mailto:` sering gagal membuka apa pun di ponsel. Keduanya menghasilkan form
yang tampak berfungsi tapi tidak mengirim apa-apa — hal terburuk yang bisa
ditemukan calon klien saat menjelajahi demo Anda sendiri.

## Konsekuensi

Tidak ada model `ContactMessage`, tidak ada endpoint kontak, tidak ada layar
admin untuk pesan masuk. Halaman `/kontak` berisi NAP, jam operasional, peta,
tombol WhatsApp, dan link email. Halaman korporat dan bulanan memakai CTA
WhatsApp dengan template pesan berisi baris isian yang relevan (nama
perusahaan, jumlah unit, durasi).

Konsekuensi yang tidak enak: satu-satunya jalur masuk lead ada di luar sistem,
jadi tidak ada lead yang bisa dihitung atau dilaporkan dari dalam aplikasi.
Untuk demo ini dapat diterima. Untuk klien sungguhan yang butuh atribusi lead,
keputusan ini yang pertama harus ditinjau ulang.
