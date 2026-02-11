import React, { useEffect, useMemo, useState } from "react";
import { saveState, loadState } from "../utils/penyimpanan.js";
import { fetchQuestions, decodeHtml, shuffleArray } from "../utils/trivia.js";

export default function QuizPage({ initialState, onFinish, onBackToLogin }) {
	const [state, setState] = useState(initialState);
	const [loading, setLoading] = useState(false);
	const [timeLeft, setTimeLeft] = useState(0);
	const [error, setError] = useState("");

	// Load saved state kalau ada (biar resume beneran)
	useEffect(() => {
		const saved = loadState();
		if (saved?.inProgress && !saved?.finished) {
			setState(saved);
		}
	}, []);

	// Fetch questions kalau belum ada
	useEffect(() => {
		const run = async () => {
			if (state.questions?.length) return;
			setError("");
			setLoading(true);
			try {
				const questions = await fetchQuestions(state.amount, state.type);
				setState((prev) => {
					const next = { ...prev, questions };
					saveState(next);
					return next;
				});
			} catch (err) {
				console.error("Fetch questions error:", err);
				setError("Gagal mengambil soal dari OpenTDB. Cek koneksi internet, lalu coba Start lagi.");
			} finally {
				setLoading(false);
			}
		};
		run();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.questions?.length]);

	// Timer loop
	useEffect(() => {
		const tick = () => {
			const msLeft = state.endAt - Date.now();
			const secLeft = Math.max(0, Math.ceil(msLeft / 1000));
			setTimeLeft(secLeft);

			if (secLeft <= 0) {
				finishDueToTime();
			}
		};

		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.endAt, state.answers.length, state.finished]);

	const currentQuestion = state.questions?.[state.currentIndex];

	const options = useMemo(() => {
		if (!currentQuestion) return [];
		const all = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers].map(decodeHtml);

		return shuffleArray(all);
	}, [currentQuestion]);

	const answeredCount = state.answers.length;
	const total = state.amount;

	const chooseAnswer = (selected) => {
		const correct = decodeHtml(currentQuestion.correct_answer);
		const isCorrect = selected === correct;

		const answerObj = {
			questionIndex: state.currentIndex,
			selected,
			correct,
			isCorrect,
		};

		const nextIndex = state.currentIndex + 1;
		const nextState = {
			...state,
			answers: [...state.answers, answerObj],
			currentIndex: nextIndex,
		};

		// Kalau sudah selesai semua soal
		if (nextIndex >= state.questions.length) {
			const finalState = {
				...nextState,
				inProgress: false,
				finished: true,
			};
			saveState(finalState);
			onFinish(finalState);
			return;
		}

		saveState(nextState);
		setState(nextState);
	};

	const finishDueToTime = () => {
		// Hindari double finish
		if (state.finished) return;

		const finalState = {
			...state,
			inProgress: false,
			finished: true,
		};
		saveState(finalState);
		onFinish(finalState);
	};

	const formatTime = (sec) => {
		const m = String(Math.floor(sec / 60)).padStart(2, "0");
		const s = String(sec % 60).padStart(2, "0");
		return `${m}:${s}`;
	};

	if (loading || !currentQuestion) {
		if (error) {
			return (
				<div className="card">
					<h2>Terjadi Error</h2>
					<p className="muted">{error}</p>
					<button
						className="btn secondary"
						onClick={onBackToLogin}
					>
						Kembali
					</button>
				</div>
			);
		}
		return (
			<div className="card">
				<h2>Loading Kuis...</h2>
				<p className="muted">Sedang mengambil soal dari OpenTDB.</p>
				<button
					className="btn secondary"
					onClick={onBackToLogin}
				>
					Back
				</button>
			</div>
		);
	}

	return (
		<div className="card">
			<div className="topbar">
				<div>
					<div className="badge">User: {state.username}</div>
					<div className="muted small">
						Total soal: <b>{total}</b> • Sudah dijawab: <b>{answeredCount}</b>
					</div>
				</div>

				<div className="timer">
					<div className="muted small">Timer</div>
					<div className="time">{formatTime(timeLeft)}</div>
				</div>
			</div>

			<hr />

			<div className="muted small">
				Soal {state.currentIndex + 1} dari {total}
			</div>

			<h2 className="question">{decodeHtml(currentQuestion.question)}</h2>

			<div className="options">
				{options.map((opt) => (
					<button
						key={opt}
						className="option"
						onClick={() => chooseAnswer(opt)}
					>
						{opt}
					</button>
				))}
			</div>

			<div className="muted small">
				Kategori: {decodeHtml(currentQuestion.category)} • Kesulitan: {decodeHtml(currentQuestion.difficulty)}
			</div>

			<div className="actions">
				<button
					className="btn secondary"
					onClick={onBackToLogin}
				>
					Back to Start Page
				</button>
				<button
					className="btn danger"
					onClick={finishDueToTime}
				>
					Finish Now
				</button>
			</div>

			<div className="tips">
				<strong>Info challenge:</strong> Satu halaman hanya menampilkan satu soal. Setelah klik jawaban, langsung lanjut soal berikutnya.
			</div>
		</div>
	);
}
