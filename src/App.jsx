import React, { useState } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import StartPage from "./pages/StartPage.jsx";
import QuizPage from "./pages/KuisPage.jsx";
import ResultPage from "./pages/HasilPage.jsx";
import { loadState, clearState } from "./utils/penyimpanan.js";
import { loadAuthUser, saveAuthUser, clearAuthUser } from "./utils/auth.js";

export default function App() {
	const [quizState, setQuizState] = useState(() => loadState());
	const [user, setUser] = useState(() => loadAuthUser()); // { username } | null
	const [page, setPage] = useState(() => {
		const savedQuiz = loadState();
		// kalau ada kuis yang masih berjalan, langsung ke StartPage (untuk resume)
		return savedQuiz?.inProgress && !savedQuiz?.finished ? "start" : "login";
	});

	const hasResume = !!(quizState?.inProgress && !quizState?.finished && user?.username && quizState?.username === user.username);

	const onLogin = ({ username }) => {
		setUser({ username });
		saveAuthUser(username);
		setPage("start");
	};

	const startNew = ({ amount = 10, type = "multiple" }) => {
		if (!user?.username) {
			alert("Silakan login dulu.");
			setPage("login");
			return;
		}

		const timeLimitSec = 120;

		const init = {
			username: user.username,
			questions: [],
			currentIndex: 0,
			answers: [],
			amount,
			type,
			timeLimitSec,
			endAt: Date.now() + timeLimitSec * 1000,
			inProgress: true,
			finished: false,
		};

		setQuizState(init);
		setPage("quiz");
	};

	const resume = () => {
		const saved = loadState();
		if (saved?.inProgress && !saved?.finished) {
			if (!user?.username) {
				alert("Silakan login dulu untuk resume kuis.");
				setPage("login");
				return;
			}

			if (saved.username !== user.username) {
				alert("User yang login tidak sesuai dengan kuis yang tersimpan.");
				return;
			}

			setQuizState(saved);
			setPage("quiz");
		} else {
			alert("Tidak ada kuis yang bisa di-resume.");
		}
	};

	const onFinish = (finalState) => {
		setQuizState(finalState);
		setPage("result");
	};

	const restartToStartPage = () => {
		clearState();
		setQuizState(null);
		setPage("start");
	};

	const logout = () => {
		setUser(null);
		clearAuthUser();
		setPage("login");
	};

	return (
		<div className="container">
			<h1 className="title">Quiz App</h1>

			{page === "login" && <LoginPage onLogin={onLogin} />}

			{page === "start" && user && (
				<StartPage
					username={user.username}
					onStart={startNew}
					onResume={resume}
					hasResume={hasResume}
					onLogout={logout}
				/>
			)}

			{page === "quiz" && quizState && (
				<QuizPage
					initialState={quizState}
					onFinish={onFinish}
					onBackToLogin={() => setPage("start")}
				/>
			)}

			{page === "result" && quizState && (
				<ResultPage
					state={quizState}
					onRestart={restartToStartPage}
				/>
			)}

			<footer className="footer">Paid Internship Challenge - OpenTDB</footer>
		</div>
	);
}
