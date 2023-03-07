const imgSearch = document.querySelector('#img-search')
const inputText = document.querySelector('#input-text')

/**
 * Método que obtém os dados do pokemon
 * 
 * @param value Nome ou ID do pokemon
 * @returns Retorna os dados do pokemon
 */
const fetchPokemon = async value => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${value}`)
  const pokemonData = response.json()

  return pokemonData
}

/**
 * Listener de evento na imagem de lupa para capturar
 * o nome do pokemon ou ID
 */
imgSearch.addEventListener('click', async () => {
  const pokemon = await fetchPokemon(inputText.value)
})

