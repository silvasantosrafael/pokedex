const imgSearch = document.querySelector('#img-search')
const inputText = document.querySelector('#input-text')
const pokemonName = document.querySelector('#pokemon-name')
const pokemonId = document.querySelector('#pokemon-id')
const imagePlaceholder = document.querySelector('#image-placeholder')
const types = document.querySelector('#types')
const stats = document.querySelector('#stats')
const pokedex = document.querySelector('#pokedex')

const MAX_STAT_VALUE = 255

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
 * Método que define a cor de destaque baseado no primeiro Tipo do pokémon
 * 
 * @param pokemon Dados do pokemon obtidos da API
 */
const setPokedexAccentColor = pokemon => {
  pokedex.style.backgroundColor = `var(--${pokemon.types[0].type.name})`
}

/**
 * Método que insere e formata o nome e ID do pokémon
 * 
 * @param pokemon Dados do pokemon obtidos da API
 */
const insertNameAndIdPokemon = pokemon => {
  pokemonName.innerText = pokemon.name.toUpperCase()
  pokemonId.innerText = '#' + formattedNumeral(pokemon.id)
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
 * Método que calcula o valor correto para inserir
 * 
 * @param value Valor base stat do pokémon
 * @returns Retorna o valor calculado
 */
const calculateStatValue = value => {
  const baseValue = MAX_STAT_VALUE
  const calculateValue = (value / baseValue) * 100
  const valueCalculated = Math.round(calculateValue)

  return valueCalculated
}

/**
 * Método que insere as estatísticas básicas do pokémon
 * 
 * @param pokemon Dados do pokémon obtidos da API
 */
const insertBaseStats = pokemon => {
  stats.innerHTML = `<h3 id="base-stats" style="color: var(--${pokemon.types[0].type.name})">Base Stats</h3>`
  pokemon.stats.forEach(st => {
    stats.innerHTML +=  
    `<div class="stat-row">
      <div class="stat-desc" style="color: var(--${pokemon.types[0].type.name})">${st.stat.name.toUpperCase()}</div>
        <div class="stat-value">${formattedNumeral(st.base_stat)}</div>
          <div class="stat-bar">
            <div class="bar-outer" style="background-color: var(--${pokemon.types[0].type.name +'Alpha'})">
            <div class="bar-inner" style="width: ${calculateStatValue(st.base_stat)}%; background-color: var(--${pokemon.types[0].type.name})"></div>
        </div>
      </div>
    </div>`
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
 * Método que formata o numero para 3 casas decimais
 * 
 * @param number Número que será formatado
 * @returns Retorna o numero no formato 000
 */
const formattedNumeral = number => {
  return number.toString().padStart(3, 0)
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
 * Listener de evento na imagem de lupa para capturar
 * o nome do pokémon ou ID
 */
imgSearch.addEventListener('click', async () => {
  const value = formattedInputText()
  if (!validateText(value)) {
    return
  }
  const pokemon = await fetchPokemon(value)
  setPokedexAccentColor(pokemon)
  insertNameAndIdPokemon(pokemon)
  insertPokemonImage(pokemon)
  insertPokemonTypes(pokemon)
  insertBaseStats(pokemon)
  inputText.value = ''
})