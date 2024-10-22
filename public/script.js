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
    {
      /* <p>${movie.overview}</p> line 26 */
    }
    const container = document.getElementById("movies-container");
    container.innerHTML = "";
    fmovies.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.className = "movie-card";
      movieCard.setAttribute("data-id", movie.id);
      movieCard.innerHTML = `
                <h3>${movie.title}</h3>
                <img src="${movie.poster_image}" alt="${movie.title}">
                
                <p>Rating: ${movie.vote_average}</p>
                <div class="buttons">
                    <button class="like-button">
                        <img class="like-icon" src="${
                          movie.liked === "yes" ? "likeb-on.png" : "likeb.png"
                        }" alt="${movie.liked === "yes" ? "Unlike" : "Like"}">
                    </button>
                    <button class="bookmark-button">
                        <img class="bookmark-icon" src="${
                          movie.bookmarked === "yes"
                            ? "bookb-on.png"
                            : "bookb.png"
                        }" alt="${
        movie.bookmarked === "yes" ? "Unbookmark" : "Bookmark"
      }">
                    </button>
                    <button class="watchlist-button">
                        <img class="watchlist-icon" src="${
                          movie.watchlist === "yes" ? "favb-on.png" : "favb.png"
                        }" alt="${
        movie.watchlist === "yes" ? "Remove from Watchlist" : "Add to Watchlist"
      }">
                    </button>
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

  const likedButton = movieCard.querySelector(".like-button img");
  const bookmarkedButton = movieCard.querySelector(".bookmark-button img");
  const watchlistButton = movieCard.querySelector(".watchlist-button img");

  let liked = likedButton.src.includes("likeb.png") ? "no" : "yes";
  let bookmarked = bookmarkedButton.src.includes("bookb.png") ? "no" : "yes";
  let watchlist = watchlistButton.src.includes("favb.png") ? "no" : "yes";

  if (action === "liked") {
    liked = liked === "yes" ? "no" : "yes";
    likedButton.src = liked === "yes" ? "likeb-on.png" : "likeb.png";
  } else if (action === "bookmarked") {
    bookmarked = bookmarked === "yes" ? "no" : "yes";
    bookmarkedButton.src = bookmarked === "yes" ? "bookb-on.png" : "bookb.png";
  } else if (action === "watchlist") {
    watchlist = watchlist === "yes" ? "no" : "yes";
    watchlistButton.src = watchlist === "yes" ? "favb-on.png" : "favb.png";
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
const userBtn = document.getElementById("user-btn");

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  // Change the icon based on the theme
  if (document.body.classList.contains("dark-mode")) {
    themeIcon.src = "light.png"; // Switch to dark icon
    langBtn.src = "langw.png";
    userBtn.src = "userw.png";

    // Update button icons for dark mode
    document.querySelectorAll(".like-button img").forEach((img) => {
      img.src = img.src.includes("likeb-on.png") ? "likeb-on.png" : "likeb.png";
    });
    document.querySelectorAll(".bookmark-button img").forEach((img) => {
      img.src = img.src.includes("bookb-on.png") ? "bookb-on.png" : "bookb.png";
    });
    document.querySelectorAll(".watchlist-button img").forEach((img) => {
      img.src = img.src.includes("favb-on.png") ? "favb-on.png" : "favb.png";
    });
  } else {
    themeIcon.src = "dark.png"; // Switch to light icon
    langBtn.src = "langb.png";
    userBtn.src = "userb.png";

    // Update button icons for light mode
    document.querySelectorAll(".like-button img").forEach((img) => {
      img.src = img.src.includes("likeb.png") ? "likeb.png" : "likeb-on.png";
    });
    document.querySelectorAll(".bookmark-button img").forEach((img) => {
      img.src = img.src.includes("bookb.png") ? "bookb.png" : "bookb-on.png";
    });
    document.querySelectorAll(".watchlist-button img").forEach((img) => {
      img.src = img.src.includes("favb.png") ? "favb.png" : "favb-on.png";
    });
  }
});
