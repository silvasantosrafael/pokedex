
const generateURL = id => `https://pokeapi.co/api/v2/pokemon/${id}`

const fetchPokemon = () => {
  const pokemonPromises = []

  for (let index = 1; index <= 1010; index++) {
    pokemonPromises.push(fetch(generateURL(index)).then(response => response.json()))
  }

  Promise.all(pokemonPromises)
    .then(pokemon => {
      const responsePokemon = pokemon.reduce((acc, pokemon) => {
        const srcImg = pokemon.sprites.other['official-artwork'].front_default
        acc +=
          `  <div class="card">
          <div class="image">
            <img src="${srcImg}" alt="">
          </div>
          <div class="id">Nº ${pokemon.id.toString().padStart(4, 0)}</div>
          <div class="name">${pokemon.name}</div>
          <div class="types">${pokemon.types.map(tp => `<span class="type" style="background-color: var(--${tp.type.name})"">${tp.type.name}</span>`).join(' ')}</div>
        </div>`

        return acc
      }, '')

      const pokemonDiv = document.querySelector('[data-js="pokemon"]')
      pokemonDiv.innerHTML = responsePokemon
    })
}

fetchPokemon()