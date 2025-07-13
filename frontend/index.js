import React, { useState, useEffect } from 'react';
import { Star, Trophy, BookOpen, Brain, Sparkles, RotateCcw } from 'lucide-react';

const QuizGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentCategory, setCurrentCategory] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [categories] = useState([
    'matematika dasar',
    'bahasa indonesia', 
    'ilmu pengetahuan alam',
    'sejarah indonesia',
    'geografi indonesia'
  ]);

  // Simulasi fungsi backend (replace dengan actual API calls)
  const generateQuestion = async (category = null) => {
    setIsLoading(true);
    setShowResult(false);
    setUserAnswer('');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const questions = {
      'matematika dasar': [
        'Soal: Berapa hasil dari 15 + 27?',
        'Soal: Jika ada 24 apel dan dimakan 9, berapa sisa apelnya?',
        'Soal: Berapa hasil dari 8 × 7?'
      ],
      'bahasa indonesia': [
        'Soal: Apa sinonim dari kata "gembira"?',
        'Soal: Apa antonim dari kata "tinggi"?',
        'Soal: Apa arti dari kata "rajin"?'
      ],
      'ilmu pengetahuan alam': [
        'Soal: Hewan apa yang bernapas dengan insang?',
        'Soal: Tumbuhan apa yang bisa makan serangga?',
        'Soal: Planet apa yang terdekat dengan matahari?'
      ],
      'sejarah indonesia': [
        'Soal: Siapa proklamator kemerdekaan Indonesia?',
        'Soal: Kapan Indonesia merdeka?',
        'Soal: Siapa pahlawan wanita dari Aceh?'
      ],
      'geografi indonesia': [
        'Soal: Apa ibu kota Indonesia?',
        'Soal: Pulau apa yang terbesar di Indonesia?',
        'Soal: Gunung apa yang tertinggi di Indonesia?'
      ]
    };

    const selectedCategory = category || categories[Math.floor(Math.random() * categories.length)];
    const questionList = questions[selectedCategory];
    const randomQuestion = questionList[Math.floor(Math.random() * questionList.length)];
    
    setCurrentQuestion(randomQuestion);
    setCurrentCategory(selectedCategory);
    setIsLoading(false);
  };

  const checkAnswer = async () => {
    if (!userAnswer.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simple answer checking (replace with actual backend logic)
    const correctAnswers = {
      'Soal: Berapa hasil dari 15 + 27?': '42',
      'Soal: Jika ada 24 apel dan dimakan 9, berapa sisa apelnya?': '15',
      'Soal: Berapa hasil dari 8 × 7?': '56',
      'Soal: Apa sinonim dari kata "gembira"?': 'senang',
      'Soal: Apa antonim dari kata "tinggi"?': 'rendah',
      'Soal: Apa arti dari kata "rajin"?': 'tekun',
      'Soal: Hewan apa yang bernapas dengan insang?': 'ikan',
      'Soal: Tumbuhan apa yang bisa makan serangga?': 'kantong semar',
      'Soal: Planet apa yang terdekat dengan matahari?': 'merkurius',
      'Soal: Siapa proklamator kemerdekaan Indonesia?': 'soekarno',
      'Soal: Kapan Indonesia merdeka?': '17 agustus 1945',
      'Soal: Siapa pahlawan wanita dari Aceh?': 'cut nyak dhien',
      'Soal: Apa ibu kota Indonesia?': 'jakarta',
      'Soal: Pulau apa yang terbesar di Indonesia?': 'kalimantan',
      'Soal: Gunung apa yang tertinggi di Indonesia?': 'puncak jaya'
    };

    const correctAnswer = correctAnswers[currentQuestion] || '';
    const isCorrect = userAnswer.toLowerCase().includes(correctAnswer.toLowerCase()) || 
                     correctAnswer.toLowerCase().includes(userAnswer.toLowerCase());

    const newTotal = totalQuestions + 1;
    const newScore = isCorrect ? score + 1 : score;
    
    setTotalQuestions(newTotal);
    setScore(newScore);
    
    setLastResult({
      isCorrect,
      correctAnswer,
      message: isCorrect ? '🎉 Benar! Kamu hebat!' : '❌ Belum tepat. Jangan menyerah, coba lagi!',
      userAnswer
    });
    
    setShowResult(true);
    setIsLoading(false);
  };

  const resetScore = () => {
    setScore(0);
    setTotalQuestions(0);
    setLastResult(null);
    setShowResult(false);
    setCurrentQuestion('');
    setUserAnswer('');
  };

  const getScoreColor = () => {
    if (totalQuestions === 0) return 'text-gray-500';
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'matematika dasar': return '🔢';
      case 'bahasa indonesia': return '📝';
      case 'ilmu pengetahuan alam': return '🔬';
      case 'sejarah indonesia': return '📜';
      case 'geografi indonesia': return '🌍';
      default: return '📚';
    }
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Brain className="text-yellow-300" size={48} />
            Quiz Pintar
            <Sparkles className="text-yellow-300" size={48} />
          </h1>
          <p className="text-xl text-white/90">Game Pengetahuan untuk Anak SD</p>
        </div>

        {/* Score Board */}
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 mb-8 border border-white/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-400 rounded-full p-3">
                <Trophy className="text-yellow-900" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Skor Kamu</h2>
                <p className={`text-3xl font-bold ${getScoreColor()}`}>
                  {score} / {totalQuestions}
                </p>
              </div>
            </div>
            <button
              onClick={resetScore}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full flex items-center gap-2 transition-colors"
            >
              <RotateCcw size={20} />
              Reset
            </button>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          {currentCategory && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{getCategoryIcon(currentCategory)}</span>
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold capitalize">
                {currentCategory}
              </span>
            </div>
          )}

          {isLoading && !showResult ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Sedang membuat soal...</p>
            </div>
          ) : currentQuestion ? (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
                {currentQuestion}
              </h3>
              
              {!showResult ? (
                <div className="space-y-6">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Ketik jawabanmu di sini..."
                    className="w-full p-4 border-2 border-gray-300 rounded-2xl text-lg focus:border-blue-500 focus:outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                  />
                  
                  <button
                    onClick={checkAnswer}
                    disabled={isLoading || !userAnswer.trim()}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-4 px-6 rounded-2xl text-lg font-semibold transition-colors"
                  >
                    {isLoading ? 'Memeriksa...' : 'Kirim Jawaban'}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className={`p-6 rounded-2xl ${lastResult?.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                    <p className="text-xl font-bold mb-2">{lastResult?.message}</p>
                    <p className="text-gray-700">
                      <strong>Jawaban kamu:</strong> {lastResult?.userAnswer}
                    </p>
                    {!lastResult?.isCorrect && (
                      <p className="text-gray-700 mt-2">
                        <strong>Jawaban yang benar:</strong> {lastResult?.correctAnswer}
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => generateQuestion()}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white py-4 px-6 rounded-2xl text-lg font-semibold transition-colors"
                  >
                    Soal Berikutnya
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
              <p className="text-lg text-gray-600">Tekan tombol untuk mulai quiz!</p>
            </div>
          )}
        </div>

        {/* Category Selector */}
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 border border-white/30">
          <h3 className="text-xl font-bold text-white mb-4">Pilih Kategori:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => generateQuestion(category)}
                className="bg-white/30 hover:bg-white/50 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all capitalize flex items-center gap-2"
              >
                <span className="text-lg">{getCategoryIcon(category)}</span>
                {category}
              </button>
            ))}
            <button
              onClick={() => generateQuestion()}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
            >
              <Star size={16} />
              Acak
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizGame;