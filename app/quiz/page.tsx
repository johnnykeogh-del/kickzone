'use client'

import { useState, useEffect, useCallback } from 'react'

interface Question {
  q: string
  options: string[]
  answer: number
  emoji: string
  difficulty: 'easy' | 'medium' | 'hard'
}

const ALL_QUESTIONS: Question[] = [
  { q: "Which player has won the most Ballon d'Or awards?", options: ['Cristiano Ronaldo', 'Lionel Messi', 'Ronaldo Nazário', 'Zinedine Zidane'], answer: 1, emoji: '🏅', difficulty: 'easy' },
  { q: "Which country won the 2022 FIFA World Cup?", options: ['France', 'Brazil', 'Argentina', 'Germany'], answer: 2, emoji: '🏆', difficulty: 'easy' },
  { q: "Erling Haaland plays for which English club?", options: ['Arsenal', 'Liverpool', 'Manchester City', 'Chelsea'], answer: 2, emoji: '⚽', difficulty: 'easy' },
  { q: "Kylian Mbappé moved to Real Madrid from which club?", options: ['Lyon', 'Marseille', 'Monaco', 'Paris Saint-Germain'], answer: 3, emoji: '⭐', difficulty: 'easy' },
  { q: "What is the nickname of Manchester United?", options: ['The Reds', 'The Red Devils', 'The Red Army', 'The Red Giants'], answer: 1, emoji: '😈', difficulty: 'easy' },
  { q: "How many players are on a football team on the pitch?", options: ['10', '11', '12', '9'], answer: 1, emoji: '👥', difficulty: 'easy' },
  { q: "Which Italian club plays at the San Siro stadium?", options: ['Juventus', 'Napoli', 'AC Milan / Inter Milan', 'Roma'], answer: 2, emoji: '🏟', difficulty: 'easy' },
  { q: "Bukayo Saka plays for which club?", options: ['Chelsea', 'Arsenal', 'Tottenham', 'Liverpool'], answer: 1, emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', difficulty: 'easy' },
  { q: "Which tournament do the top European club teams compete in every year?", options: ['Copa América', 'Champions League', 'Europa League', 'Club World Cup'], answer: 1, emoji: '⭐', difficulty: 'easy' },
  { q: "Jude Bellingham plays for which club?", options: ['Borussia Dortmund', 'Barcelona', 'Real Madrid', 'Bayern Munich'], answer: 2, emoji: '🎸', difficulty: 'easy' },
  { q: "How long is a standard football match (in minutes)?", options: ['80', '90', '100', '85'], answer: 1, emoji: '⏱', difficulty: 'easy' },
  { q: "Lamine Yamal plays for which club?", options: ['Real Madrid', 'Barcelona', 'Atlético Madrid', 'Sevilla'], answer: 1, emoji: '🌟', difficulty: 'easy' },
  { q: "Which club has won the most Champions League trophies?", options: ['Barcelona', 'Bayern Munich', 'AC Milan', 'Real Madrid'], answer: 3, emoji: '👑', difficulty: 'medium' },
  { q: "What nationality is Erling Haaland?", options: ['Swedish', 'Danish', 'Norwegian', 'Finnish'], answer: 2, emoji: '🇳🇴', difficulty: 'medium' },
  { q: "Which country does Mohamed Salah represent?", options: ['Morocco', 'Tunisia', 'Egypt', 'Algeria'], answer: 2, emoji: '🌍', difficulty: 'medium' },
  { q: "What year did Messi join Inter Miami?", options: ['2022', '2023', '2024', '2021'], answer: 1, emoji: '🇺🇸', difficulty: 'medium' },
  { q: "What is the maximum number of substitutes allowed in a Premier League match?", options: ['3', '4', '5', '6'], answer: 2, emoji: '🔄', difficulty: 'medium' },
  { q: "Which Spanish club is nicknamed 'Los Blancos'?", options: ['Barcelona', 'Atlético Madrid', 'Sevilla', 'Real Madrid'], answer: 3, emoji: '⚪', difficulty: 'medium' },
  { q: "Florian Wirtz plays for which German club?", options: ['Bayern Munich', 'Borussia Dortmund', 'Bayer Leverkusen', 'RB Leipzig'], answer: 2, emoji: '🇩🇪', difficulty: 'medium' },
  { q: "Which club does Harry Kane play for?", options: ['Tottenham', 'Bayern Munich', 'Manchester City', 'Chelsea'], answer: 1, emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', difficulty: 'medium' },
  { q: "What does 'VAR' stand for in football?", options: ['Video Action Review', 'Virtual Assistance Replay', 'Video Assistant Referee', 'Visual Analysis Review'], answer: 2, emoji: '📺', difficulty: 'medium' },
  { q: "Which country does Vinicius Jr. represent?", options: ['Portugal', 'Spain', 'Brazil', 'Argentina'], answer: 2, emoji: '🇧🇷', difficulty: 'medium' },
  { q: "In which year was the Premier League founded?", options: ['1988', '1990', '1992', '1995'], answer: 2, emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', difficulty: 'hard' },
  { q: "What is the offside rule about?", options: ['Being behind the ball when it is passed', 'Being nearer to the goal than the second-last defender when the ball is played', 'Standing in the penalty area', 'Running faster than the defender'], answer: 1, emoji: '🚩', difficulty: 'hard' },
  { q: "Which club is known as 'Die Roten Bullen'?", options: ['Bayern Munich', 'RB Leipzig', 'Bayer Leverkusen', 'Borussia Dortmund'], answer: 1, emoji: '🐂', difficulty: 'hard' },
  { q: "How many clubs play in La Liga?", options: ['18', '19', '20', '22'], answer: 2, emoji: '🇪🇸', difficulty: 'hard' },
  { q: "Pedri González plays for which club?", options: ['Real Madrid', 'Atlético Madrid', 'Barcelona', 'Sevilla'], answer: 2, emoji: '🇪🇸', difficulty: 'hard' },
  { q: "In which country do Benfica, Sporting and Porto all play?", options: ['Spain', 'Portugal', 'Brazil', 'Italy'], answer: 1, emoji: '🇵🇹', difficulty: 'hard' },
  { q: "What is the name of Real Madrid's home stadium?", options: ['Camp Nou', 'Bernabéu', 'Vicente Calderón', 'Mestalla'], answer: 1, emoji: '🏟', difficulty: 'hard' },
  { q: "Which goalkeeper holds the record for most clean sheets in Champions League history?", options: ['Gianluigi Buffon', 'Iker Casillas', 'Manuel Neuer', 'Peter Schmeichel'], answer: 1, emoji: '🧤', difficulty: 'hard' },
]

const TIMER_SECONDS = 20

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function QuizPage() {
  const [started, setStarted] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [storedXP, setStoredXP] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('kickzone_xp')
    if (saved) setStoredXP(parseInt(saved))
  }, [])

  const startQuiz = () => {
    const picked = shuffle(ALL_QUESTIONS).slice(0, 10)
    setQuestions(picked)
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
    setTimeLeft(TIMER_SECONDS)
    setAnswers([])
    setStarted(true)
  }

  const handleAnswer = useCallback((idx: number | null) => {
    if (selected !== null) return
    setSelected(idx)
    const q = questions[current]
    const isCorrect = idx === q.answer
    if (isCorrect) setScore(s => s + 1)
    setAnswers(prev => [...prev, idx])

    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setFinished(true)
        const xpEarned = (isCorrect ? score + 1 : score) * 5
        const newTotal = storedXP + xpEarned
        setStoredXP(newTotal)
        localStorage.setItem('kickzone_xp', String(newTotal))
      } else {
        setCurrent(c => c + 1)
        setSelected(null)
        setTimeLeft(TIMER_SECONDS)
      }
    }, 1200)
  }, [selected, questions, current, score, storedXP])

  useEffect(() => {
    if (!started || finished || selected !== null) return
    if (timeLeft <= 0) {
      handleAnswer(null)
      return
    }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000)
    return () => clearTimeout(t)
  }, [started, finished, selected, timeLeft, handleAnswer])

  const xpEarned = score * 5
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="text-center">
          <div className="text-7xl mb-4">🧠</div>
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Quiz <span className="text-pitch-400">Zone</span>
          </h1>
          <p className="text-white/50 text-lg mb-2">10 football questions. 20 seconds each.</p>
          <p className="text-white/30 text-sm mb-8">Earn 5 XP for every correct answer!</p>
          <div className="inline-flex items-center gap-2 bg-volt-400/10 border border-volt-400/20 rounded-full px-4 py-1.5 mb-8">
            <span className="text-volt-400 font-bold text-sm">⚡ Your XP: {storedXP}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { emoji: '🎯', label: 'Easy', color: 'text-pitch-400', desc: 'Know your players' },
            { emoji: '🔥', label: 'Medium', color: 'text-volt-400', desc: 'Know your leagues' },
            { emoji: '💎', label: 'Hard', color: 'text-fire-400', desc: 'Know your history' },
          ].map(d => (
            <div key={d.label} className="card text-center">
              <div className="text-3xl mb-2">{d.emoji}</div>
              <div className={`font-bold ${d.color} text-sm`}>{d.label}</div>
              <div className="text-white/30 text-xs mt-1">{d.desc}</div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button onClick={startQuiz} className="btn-primary px-10 py-4 text-lg">
            🧠 Start Quiz!
          </button>
        </div>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="text-center">
          <div className="text-7xl mb-4">
            {percentage >= 90 ? '🏆' : percentage >= 70 ? '🥇' : percentage >= 50 ? '🥈' : '⚽'}
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-2">
            {percentage >= 90 ? 'PERFECT! 🎉' : percentage >= 70 ? 'Great job! 🔥' : percentage >= 50 ? 'Not bad!' : 'Keep practising!'}
          </h2>
          <p className="text-white/50 text-lg mb-6">{score} / {questions.length} correct</p>
          <div className="flex justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-volt-400">+{xpEarned} XP</div>
              <div className="text-white/40 text-sm">This quiz</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-pitch-400">{storedXP}</div>
              <div className="text-white/40 text-sm">Total XP</div>
            </div>
          </div>
        </div>

        {/* Answer review */}
        <div className="card space-y-3">
          <h3 className="font-bold text-white mb-2">📋 Review your answers</h3>
          {questions.map((q, i) => {
            const userAnswer = answers[i]
            const correct = userAnswer === q.answer
            return (
              <div key={i} className={`rounded-xl p-3 border ${correct ? 'border-pitch-500/30 bg-pitch-900/30' : 'border-red-500/30 bg-red-900/10'}`}>
                <div className="flex items-start gap-2">
                  <span className="text-lg shrink-0">{correct ? '✅' : '❌'}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white/80">{q.q}</p>
                    {!correct && (
                      <p className="text-xs text-pitch-400 mt-1">✓ {q.options[q.answer]}</p>
                    )}
                    {!correct && userAnswer !== null && (
                      <p className="text-xs text-red-400 mt-0.5">✗ You said: {q.options[userAnswer]}</p>
                    )}
                    {!correct && userAnswer === null && (
                      <p className="text-xs text-white/30 mt-0.5">⏱ Ran out of time!</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <button onClick={startQuiz} className="btn-primary px-8 py-3">🔄 Play Again</button>
        </div>
      </div>
    )
  }

  const q = questions[current]
  const progress = ((current) / questions.length) * 100
  const timerColor = timeLeft <= 5 ? 'text-red-400' : timeLeft <= 10 ? 'text-volt-400' : 'text-pitch-400'
  const timerBg = timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-volt-400' : 'bg-pitch-500'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/50 text-sm font-semibold">Question {current + 1} / {questions.length}</span>
          <span className={`text-2xl font-extrabold ${timerColor}`}>⏱ {timeLeft}s</span>
        </div>
        <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
          <div className="h-full bg-pitch-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="h-1 bg-dark-700 rounded-full overflow-hidden mt-1">
          <div
            className={`h-full ${timerBg} rounded-full transition-all duration-1000`}
            style={{ width: `${(timeLeft / TIMER_SECONDS) * 100}%` }}
          />
        </div>
      </div>

      {/* Score */}
      <div className="flex justify-between items-center">
        <div className="text-sm font-semibold text-white/40">Score: <span className="text-volt-400">{score}</span></div>
        <div className="text-sm font-semibold">
          <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${q.difficulty === 'easy' ? 'bg-pitch-500/20 text-pitch-400' : q.difficulty === 'medium' ? 'bg-volt-400/20 text-volt-400' : 'bg-fire-400/20 text-fire-400'}`}>
            {q.difficulty === 'easy' ? '🎯 Easy' : q.difficulty === 'medium' ? '🔥 Medium' : '💎 Hard'}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="card py-6">
        <div className="text-4xl text-center mb-4">{q.emoji}</div>
        <h2 className="text-xl font-bold text-white text-center leading-snug">{q.q}</h2>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.answer
          const isSelected = selected === i
          let style = 'border-white/10 bg-dark-700/50 text-white/80 hover:border-pitch-500/40 hover:bg-pitch-900/30 cursor-pointer'
          if (selected !== null) {
            if (isCorrect) style = 'border-pitch-500 bg-pitch-900/50 text-white'
            else if (isSelected && !isCorrect) style = 'border-red-500 bg-red-900/30 text-red-300'
            else style = 'border-white/5 bg-dark-700/30 text-white/30 cursor-default'
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
              className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-semibold transition-all ${style}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{opt}</span>
                {selected !== null && isCorrect && <span className="ml-auto text-pitch-400">✓</span>}
                {selected !== null && isSelected && !isCorrect && <span className="ml-auto text-red-400">✗</span>}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
