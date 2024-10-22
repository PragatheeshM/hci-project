// Initial fetch to load movies
fetchMovies();

async function fetchMovies() {
  try {
    const response = await fetch("/api/movies");
    const movies = await response.json();
    const fmovies = movies.filter((movie) => movie.adult === false);

    fmovies.sort((a, b) => {
      if (a.liked === "yes" && b.liked === "no") return -1;
      if (a.bookmarked === "yes" && b.bookmarked === "no") return -1;
      if (a.watchlist === "yes" && b.watchlist === "no") return -1;
      return 0;
    });

    const container = document.getElementById("movies-container");
    container.innerHTML = "";
    fmovies.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.className = "movie-card";
      movieCard.setAttribute("data-id", movie.id);
      movieCard.innerHTML = `
                <h3>${movie.title}</h3>
                <img src="${movie.poster_image}" alt="${movie.title}">
                <p>${movie.overview}</p>
                <p>Rating: ${movie.vote_average}</p>
                <div class="buttons">
                    <button class="like-button">${
                      movie.liked === "yes" ? "Unlike" : "Like"
                    }</button>
                    <button class="bookmark-button">${
                      movie.bookmarked === "yes" ? "Unbookmark" : "Bookmark"
                    }</button>
                    <button class="watchlist-button">${
                      movie.watchlist === "yes"
                        ? "Remove from Watchlist"
                        : "Add to Watchlist"
                    }</button>
                </div>
            `;
      container.appendChild(movieCard);
    });

    addEventListeners();
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

async function updateMovieStatus(movieId, action) {
  const movieCard = document.querySelector(`.movie-card[data-id='${movieId}']`);

  const likedButton = movieCard.querySelector(".like-button");
  const bookmarkedButton = movieCard.querySelector(".bookmark-button");
  const watchlistButton = movieCard.querySelector(".watchlist-button");

  let liked = likedButton.innerText === "Like" ? "no" : "yes";
  let bookmarked = bookmarkedButton.innerText === "Bookmark" ? "no" : "yes";
  let watchlist =
    watchlistButton.innerText === "Add to Watchlist" ? "no" : "yes";

  if (action === "liked") {
    liked = liked === "yes" ? "no" : "yes";
    likedButton.innerText = liked === "yes" ? "Unlike" : "Like";
  } else if (action === "bookmarked") {
    bookmarked = bookmarked === "yes" ? "no" : "yes";
    bookmarkedButton.innerText =
      bookmarked === "yes" ? "Unbookmark" : "Bookmark";
  } else if (action === "watchlist") {
    watchlist = watchlist === "yes" ? "no" : "yes";
    watchlistButton.innerText =
      watchlist === "yes" ? "Remove from Watchlist" : "Add to Watchlist";
  }

  await fetch(`/api/movies/${movieId}/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      liked: liked,
      bookmarked: bookmarked,
      watchlist: watchlist,
    }),
  });

  fetchMovies();
}

function addEventListeners() {
  document.querySelectorAll(".like-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const movieId = e.target.closest(".movie-card").getAttribute("data-id");
      updateMovieStatus(movieId, "liked");
    });
  });

  document.querySelectorAll(".bookmark-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const movieId = e.target.closest(".movie-card").getAttribute("data-id");
      updateMovieStatus(movieId, "bookmarked");
    });
  });

  document.querySelectorAll(".watchlist-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const movieId = e.target.closest(".movie-card").getAttribute("data-id");
      updateMovieStatus(movieId, "watchlist");
    });
  });
}

// Language Options
const languageToggle = document.getElementById("language-toggle");
const languageOptions = document.getElementById("language-options");

// Toggle dropdown visibility on button click
languageToggle.addEventListener("click", () => {
  languageOptions.style.display =
    languageOptions.style.display === "block" ? "none" : "block";
});

// Close dropdown if clicking outside
window.addEventListener("click", (event) => {
  if (
    !languageToggle.contains(event.target) &&
    !languageOptions.contains(event.target)
  ) {
    languageOptions.style.display = "none";
  }
});

// Sidebar open by default
const sideNav = document.getElementById("side-nav");
const mainContent = document.querySelector(".main-content");

// Set initial state of the sidebar
document.body.classList.toggle("dark-mode");
sideNav.style.left = "0px"; // Sidebar starts open
mainContent.style.paddingLeft = "220px"; // Adjust main content padding for open sidebar

// Sidebar toggle
document.getElementById("nav-toggle").addEventListener("click", () => {
  if (sideNav.style.left === "0px") {
    sideNav.style.left = "-200px"; // Close sidebar
    mainContent.style.paddingLeft = "120px"; // Adjust padding for closed sidebar
    document.getElementById("nav-toggle").innerText = "❯"; // Update toggle button text
  } else {
    sideNav.style.left = "0px"; // Open sidebar
    mainContent.style.paddingLeft = "220px"; // Adjust padding for open sidebar
    document.getElementById("nav-toggle").innerText = "❮"; // Update toggle button text
  }
});

// Dark/Light mode toggle
const darkModeToggle = document.getElementById("dark-mode-toggle");
const themeIcon = document.getElementById("theme-icon");
const langBtn = document.getElementById("lang-btn");

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  // Change the icon based on the theme
  if (document.body.classList.contains("dark-mode")) {
    themeIcon.src = "light.png"; // Switch to dark icon
    langBtn.src = "langw.png";
  } else {
    themeIcon.src = "dark.png"; // Switch to light icon
    langBtn.src = "langb.png";
  }
});
