import React, { useMemo } from "react";

export default function ResultPage({ state, onRestart }) {
  const summary = useMemo(() => {
    const correct = state.answers.filter((a) => a.isCorrect).length;
    const wrong = state.answers.filter((a) => !a.isCorrect).length;
    const answered = state.answers.length;
    return { correct, wrong, answered };
  }, [state.answers]);

  return (
    <div className="card">
      <h2>Hasil Kuis</h2>
      <p className="muted">
        Kuis selesai. Ini ringkasan pengerjaan kamu.
      </p>

      <div className="grid">
        <div className="stat">
          <div className="muted small">Jumlah Benar</div>
          <div className="statValue">{summary.correct}</div>
        </div>
        <div className="stat">
          <div className="muted small">Jumlah Salah</div>
          <div className="statValue">{summary.wrong}</div>
        </div>
        <div className="stat">
          <div className="muted small">Jumlah Dijawab</div>
          <div className="statValue">{summary.answered}</div>
        </div>
      </div>

      <hr />

      <h3>Review Jawaban</h3>
      <div className="review">
        {state.answers.map((a) => (
          <div key={a.questionIndex} className="reviewItem">
            <div className="muted small">Soal #{a.questionIndex + 1}</div>
            <div>
              Jawaban kamu: <b>{a.selected}</b>
            </div>
            <div>
              Jawaban benar: <b>{a.correct}</b>
            </div>
            <div className={a.isCorrect ? "ok" : "bad"}>
              {a.isCorrect ? "✅ Benar" : "❌ Salah"}
            </div>
          </div>
        ))}
      </div>

      <button className="btn" onClick={onRestart}>
        Kuis Baru
      </button>
    </div>
  );
}
