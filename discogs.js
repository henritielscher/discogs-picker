import { TOKEN, USER, FOLDER } from "./credentials.js";
const choice = document.querySelector("#choice");
const button = document.querySelector(".shuffle");
const img = document.querySelector("img");

button.addEventListener("click", getRecord);

let records = [];
let url = `https://api.discogs.com/users/${USER}/collection/folders/${FOLDER}/releases?per_page=100&token=${TOKEN}`;

async function getRecord() {
	button.disabled = true;
	choice.innerText = "";
	img.classList.add("spinning-animation");
	if (!records.length) {
		await fetch(url)
			.then((res) => res.json())
			.then((data) => {
				return data.pagination.pages;
			})
			.then((pages) => {
				fetchRecords(pages);
			})
			.catch((err) => (choice.innerText = `${err}`));
	} else {
		setTimeout(function () {
			makeChoice();
		}, 2500);
	}
}

async function fetchRecords(pages) {
	for (let i = 1; i <= pages; i++) {
		await fetch(url + `&page=${i}`)
			.then((res) => res.json())
			.then((data) => {
				let releases = data.releases;
				releases.forEach((r) => {
					records.push(
						`${r.basic_information.artists[0].name} - ${r.basic_information.title}`
					);
				});
			});
	}
	makeChoice();
}

function makeChoice() {
	button.disabled = false;
	img.classList.remove("spinning-animation");
	let randNum = Math.floor(Math.random() * records.length);
	choice.innerText = records[randNum];
}
