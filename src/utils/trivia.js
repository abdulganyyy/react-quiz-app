export function decodeHtml(str) {
	const txt = document.createElement("textarea");
	txt.innerHTML = str;
	return txt.value;
}

export function shuffleArray(arr) {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

export async function fetchQuestions(amount, type) {
	const category = 9; // General Knowledge
	const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&type=${type}`;

	const res = await fetch(url);
	if (!res.ok) throw new Error("Fetch error");

	const data = await res.json();
	if (!data?.results?.length) throw new Error("No questions");

	return data.results;
}
