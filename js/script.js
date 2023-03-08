const imgSearch = document.querySelector('#img-search')
const inputText = document.querySelector('#input-text')
const pokemonName = document.querySelector('#pokemon-name')
const pokemonId = document.querySelector('#pokemon-id')
const imagePlaceholder = document.querySelector('#image-placeholder')
const types = document.querySelector('#types')


/**
 * Método que obtém os dados do pokémon
 * 
 * @param value Nome ou ID do pokemon
 * @returns Retorna os dados do pokemon
 */
const fetchPokemon = async value => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${value}`)
  if (response.status != 200) {
    alert('Pokemon not found')
  }
  const pokemonData = response.json()
  return pokemonData

}

/**
 * Método que insere e formata o nome e ID do pokémon
 * 
 * @param pokemon Dados do pokemon obtidos da API
 */
const insertNameAndIDPokemon = pokemon => {
  pokemonName.innerText = pokemon.name.toUpperCase()
  pokemonId.innerText = '#' + pokemon.id.toString().padStart(3, 0)
}

/**
 * Método que formata o texto obtido no input
 * 
 * @returns Texto formatado digitado no input
 */
const formattedInputText = () => {
  const value = inputText.value.toLowerCase().split(' ').join('-')

  return value
}

/**
 * Método que insere a imagem do pokémon
 * 
 * @param pokemon Dados do pokemon obtidos da API
 */
const insertPokemonImage = pokemon => {
  const img = document.createElement('img')
  const image = pokemon.sprites.other["official-artwork"].front_default
  img.setAttribute('id', 'pokemon-image')
  img.setAttribute('alt', pokemon.name)
  img.src = image
  imagePlaceholder.innerHTML = ''
  imagePlaceholder.appendChild(img)
}

/**
 * Método que insere o(s) tipo(s) do pokémon
 * 
 * @param pokemon Dados do pokemon obtidos da API
 */
const insertPokemonTypes = pokemon => {
  types.innerHTML = ''
  pokemon.types.forEach(tp => {
    const type = document.createElement('span')
    type.classList.add('type')
    type.innerText = tp.type.name
    type.style.backgroundColor = `var(--${tp.type.name})`
    types.appendChild(type)
  })
}

/**
 * Método que verifica se o campo texto input está vazio
 * 
 * @param text Texto digitado no input
 * @returns true caso o comprimento do texto seja maior que 1 e
 *          false caso contrário
 */
const validateText = text => {
  if (text.length < 1) {
    alert('Insert a pokémon name or ID')
    return false
  }
  return true
}

/**
 * Listener de evento na imagem de lupa para capturar
 * o nome do pokémon ou ID
 */
imgSearch.addEventListener('click', async () => {
  const value = formattedInputText()
  if (!validateText(value)) {
    return
  }
  const pokemon = await fetchPokemon(value)
  insertNameAndIDPokemon(pokemon)
  insertPokemonImage(pokemon)
  insertPokemonTypes(pokemon)
})