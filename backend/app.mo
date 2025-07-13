import LLM "mo:llm";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Random "mo:base/Random";
import Time "mo:base/Time";
import Bool "mo:base/Bool";
import Char "mo:base/Char";

// Actor untuk menghitung karakter (jika diperlukan)
actor characterCount {
    public func test(text: Text) : async Bool {
        let size = Text.size(text);
        return size % 2 == 0;
    };
};

// Actor utama untuk aplikasi quiz
actor QuizApp {
    // Tipe data untuk pertanyaan
    type Question = {
        soal: Text;
        jawaban: Text;
        kategori: Text;
    };

    // Variabel untuk menyimpan soal saat ini dan skor
    private var currentQuestion : ?Question = null;
    private var userScore : Nat = 0;
    private var totalQuestions : Nat = 0;

    // Kategori soal untuk anak SD
    private let categories = [
        "matematika dasar",
        "bahasa indonesia",
        "ilmu pengetahuan alam",
        "sejarah indonesia",
        "geografi indonesia"
    ];

    // Fungsi untuk menghasilkan prompt yang sesuai anak SD
    private func generatePrompt(category: Text) : Text {
        switch (category) {
            case ("matematika dasar") {
                "Buatkan satu soal matematika sederhana untuk anak SD kelas 1-6 (penjumlahan, pengurangan, perkalian, atau pembagian dengan angka 1-100). Format: 'Soal: ... Jawaban: ...'";
            };
            case ("bahasa indonesia") {
                "Buatkan satu soal bahasa Indonesia untuk anak SD tentang sinonim, antonim, atau makna kata sederhana. Format: 'Soal: ... Jawaban: ...'";
            };
            case ("ilmu pengetahuan alam") {
                "Buatkan satu soal IPA sederhana untuk anak SD tentang hewan, tumbuhan, atau alam. Format: 'Soal: ... Jawaban: ...'";
            };
            case ("sejarah indonesia") {
                "Buatkan satu soal sejarah Indonesia sederhana untuk anak SD tentang tokoh pahlawan atau peristiwa penting. Format: 'Soal: ... Jawaban: ...'";
            };
            case ("geografi indonesia") {
                "Buatkan satu soal geografi Indonesia sederhana untuk anak SD tentang pulau, kota, atau provinsi. Format: 'Soal: ... Jawaban: ...'";
            };
            case (_) {
                "Buatkan satu soal pengetahuan umum sederhana untuk anak SD. Format: 'Soal: ... Jawaban: ...'";
            };
        };
    };

    // Fungsi untuk memilih kategori secara acak
    private func getRandomCategory() : Text {
        let now = Time.now();
        let seed = Int.abs(now) % categories.size();
        categories[seed];
    };

    // Fungsi generate soal quiz
    public func generateQuestion(category: ?Text) : async {soal: Text; kategori: Text} {
        let selectedCategory = switch (category) {
            case (?cat) cat;
            case null getRandomCategory();
        };

        let prompt = generatePrompt(selectedCategory);
        let result = await LLM.prompt(#Llama3_1_8B, prompt);

        // Pisahkan soal dan jawaban
        let iter = Text.split(result, #text "Jawaban:");
        let parts = Iter.toArray(iter);

        if (parts.size() >= 2) {
            let soal = Text.trim(parts[0], #char ' ');
            let jawaban = Text.trim(parts[1], #char ' ');
            
            currentQuestion := ?{
                soal = soal;
                jawaban = jawaban;
                kategori = selectedCategory;
            };

            return {
                soal = soal;
                kategori = selectedCategory;
            };
        } else {
            // Fallback jika parsing gagal
            let fallbackQuestion = {
                soal = "Soal: Berapa hasil dari 5 + 3?";
                jawaban = "8";
                kategori = selectedCategory;
            };
            
            currentQuestion := ?fallbackQuestion;
            
            return {
                soal = fallbackQuestion.soal;
                kategori = selectedCategory;
            };
        };
    };

    // Fungsi untuk memeriksa jawaban
    public func checkAnswer(userAnswer : Text) : async {
        isCorrect: Bool;
        correctAnswer: Text;
        message: Text;
        score: Nat;
        total: Nat;
    } {
        switch (currentQuestion) {
            case (?question) {
                let userAnswerLower = Text.map(userAnswer, func(c: Char) : Char {
                    if (c >= 'A' and c <= 'Z') {
                        Char.fromNat32(Char.toNat32(c) + 32)
                    } else { c }
                });
                
                let correctAnswerLower = Text.map(question.jawaban, func(c: Char) : Char {
                    if (c >= 'A' and c <= 'Z') {
                        Char.fromNat32(Char.toNat32(c) + 32)
                    } else { c }
                });

                totalQuestions += 1;
                
                let isCorrect = Text.contains(correctAnswerLower, #text userAnswerLower) or
                               Text.contains(userAnswerLower, #text correctAnswerLower);
                
                if (isCorrect) {
                    userScore += 1;
                    return {
                        isCorrect = true;
                        correctAnswer = question.jawaban;
                        message = "🎉 Benar! Kamu hebat!";
                        score = userScore;
                        total = totalQuestions;
                    };
                } else {
                    return {
                        isCorrect = false;
                        correctAnswer = question.jawaban;
                        message = "❌ Belum tepat. Jangan menyerah, coba lagi!";
                        score = userScore;
                        total = totalQuestions;
                    };
                };
            };
            case null {
                return {
                    isCorrect = false;
                    correctAnswer = "";
                    message = "Tidak ada soal yang aktif. Silakan generate soal baru!";
                    score = userScore;
                    total = totalQuestions;
                };
            };
        };
    };

    // Fungsi untuk reset skor
    public func resetScore() : async {score: Nat; total: Nat} {
        userScore := 0;
        totalQuestions := 0;
        return {
            score = userScore;
            total = totalQuestions;
        };
    };

    // Fungsi untuk mendapatkan skor saat ini
    public query func getScore() : async {score: Nat; total: Nat} {
        {
            score = userScore;
            total = totalQuestions;
        };
    };

    // Fungsi untuk mendapatkan daftar kategori
    public query func getCategories() : async [Text] {
        categories;
    };

    // Fungsi chat untuk interaksi umum
    public func chat(messages : [LLM.ChatMessage]) : async Text {
        let response = await LLM.chat(#Llama3_1_8B).withMessages(messages).send();

        switch (response.message.content) {
            case (?text) text;
            case null "";
        };
    };
};