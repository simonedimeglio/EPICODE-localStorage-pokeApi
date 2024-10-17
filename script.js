// ELEMENTI DOM
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultContainer = document.getElementById("resultContainer");
const favoritesList = document.getElementById("favoritesList");

// ARRAY PER I POKEMON PREFERITI
let favorites = [];

// LOCALSTORAGE
// Il localStorage è un API del browser che ci permette di salvare dati come STRINGHE
// Salva i dati anche dopo che la pagina è stata chiusa ed il browser riavviato
// Lo utilizzeremo per ricordare i Pokémon preferiti dell'utente tra una sessione e l'altra
const storedFavorites = localStorage.getItem("pokemonFavorites");

if (storedFavorites) {
  // Se trovo la lista salvata, la converto in JSON (Array) per usarla con js
  favorites = JSON.parse(storedFavorites);
  updateFavoritesList(); // Aggiorniamo la visualizzazione della lista dei Pokémon preferiti
}

// FUNZIONE PER AGGIORNARE LA LISTA DEI PREFERITI
function updateFavoritesList() {
  // Prima di fare qualsiasi cosa, pulisco la lista dei preferiti
  favoritesList.innerHTML = "";

  // Ciclo su ogni Pokémon nell'array "favorites"
  favorites.forEach((pokemon, index) => {
    // Creo un nuovo elemento <li> da inserire nella lista
    const li = document.createElement("li");

    // Inserisco nel <li> il nome del Pokemon e un bottone per rimuoverlo dai preferiti
    li.innerHTML = `
        <span class="remove-favorite" data-index="${index}">❌</span>
        ${pokemon}
    `;

    // Aggiungo l'elemento <li> appena popolato alla mia lista
    favoritesList.appendChild(li);
  });

  // Quando clicco ❌, ci sarà un event listener
  // document.querySelectorAll ci permetterà di selezionare tutti gli elementi con la classe "remove-favorite"
  document.querySelectorAll(".remove-favorite").forEach((button) => {
    // Assegno la funzione removeFavorite() al click;
    button.addEventListener("click", removeFavorite);
  });
}

// FUNZIONE PER RIMUOVERE UN POKEMON DAI PREFERITI
function removeFavorite(event) {
  // Cerco di ottenere l'indice del Pokémon da rimuovere dalla lista dei preferiti
  // tramite l'attributo "data-index"
  const index = event.target.getAttribute("data-index");

  // Utilizzo splice per rimuovere il Pokémon dall'array dei preferiti
  favorites.splice(index, 1);

  // Aggiorno il localStorage (attenti all'array, usiamo JSON.stringify())
  localStorage.setItem("pokemonFavorites", JSON.stringify(favorites));

  // Aggiorno nuovamente la lista nel DOM.
  updateFavoritesList();
}

// ASYNC / AWAIT

// La funzione asnyc ci permette di lavorare con operazione asincrone in maniera più semplice rispetto alle Promise "classiche"
// Possiamo aspettare che una funzione (tipo una fetch) termini prima di continuare l'esecuzione del codice.

async function searchPokemon(name) {
  // Gestione degli errori -> try catch
  // ci permette di gestire gli errori che si verificano durante codice asincrono
  try {
    // Chiamata di rete con fetch per ottenere dati di pokemon da PokeAPI
    // userò await per aspettare la response
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
    );

    // Controllo se la risposta HTTP è positiva (200-299)
    if (!response.ok) {
      throw new Error("Pokémon non trovato");
    }

    // Attendo la conversione in JSON
    const data = await response.json();

    // Aggiorniamo il contenitore HTML dei risultati con le info del pokémon trovato
    resultContainer.innerHTML = `
        <h2>${data.name}</h2>
        <img src="${data.sprites.front_default}" alt="${data.name}">
        <p>Altezza: ${data.height / 10} m</p>
        <p>Peso: ${data.weight / 10} kg</p>
        <button id="addFavorite">Aggiungi ai preferiti</button>
    `;

    // Aggiungo un event listener al bottone per aggiungere il pokemon nella lista dei preferiti
    document.getElementById("addFavorite").addEventListener("click", () => {
      if (!favorites.includes(data.name)) {
        // Se il pokémon non è nei preferiti, lo pusho nell'array
        favorites.push(data.name);

        // Se non è nei preferiti, aggiorno il localStorage con il nuovo array dei preferiti
        localStorage.setItem("pokemonFavorites", JSON.stringify(favorites));

        // Aggiorno il dom
        updateFavoritesList();
      }
    });
  } catch (error) {
    console.error(error);
    resultContainer.innerHTML = `<p>Errore: ${error.message}</p>`;
  }
}

// GESTIONE DELL'EVENTO DI CLICK SUL BOTTONE DI RICERCA
// Quando l'utente clicca sul bottone "Cerca il Pokémon", iniziamo la ricerca

searchButton.addEventListener("click", () => {
  // Ottengo il valore inserito nell'input, togliendo i vari spazi
  const pokemonName = searchInput.value.trim();

  // Se l'utente ha inserito qualcosa
  if (pokemonName) {
    searchPokemon(pokemonName);
  }
});

// Salviamo l'ultima ricerca
const lastSearch = localStorage.getItem("lastSearch");

if (lastSearch) {
  searchInput.value = lastSearch;
  console.log("lastSearch:", lastSearch);
}

// Ogni volta che l'utente digita qualcosa, aggiorno il localStorage con il nuovo valore
searchInput.addEventListener("input", (e) => {
  localStorage.setItem("lastSearch", e.target.value);
  console.log("Listener lastSearch", e.target.value);
});

// PULIAMO IL CAMPO DI INPUT
// window.addEventListener("load", () => {
//   searchInput.value = "";
// });
