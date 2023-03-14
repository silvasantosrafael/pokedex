const imgSearch = document.querySelector('#img-search')
const inputText = document.querySelector('#input-text')
const pokemonName = document.querySelector('#pokemon-name')
const pokemonId = document.querySelector('#pokemon-id')
const imagePlaceholder = document.querySelector('#image-placeholder')
const types = document.querySelector('#types')
const stats = document.querySelector('#stats')
const pokedex = document.querySelector('#pokedex')
const baseStat = document.querySelector('#base-stat')
const pokemonData = document.querySelector('#pokemon-data')

const MAX_STAT_VALUE = 255
const POKEMON_NOT_FOUND = 'Pokémon not found'
const NO_TEXT_INPUT = 'Insert a pokémon name or ID'


const validateResponseStatus = response => response.status == 200

/**
 * Função que obtém os dados do pokémon
 * 
 * @param value Nome ou ID do pokemon
 * @returns Retorna os dados do pokemon
 */
const fetchPokemon = async value => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${value}`)
  if (!validateResponseStatus(response)) {
    messageModal(POKEMON_NOT_FOUND)
    
    return null
  }
  const pokemon = response.json()

  return pokemon
}

/**
 * Função que define a cor de destaque baseado no primeiro Tipo do pokémon
 * 
 * @param pokemon Dados do pokemon obtidos da API
 */
const setPokedexAccentColor = pokemon => {
  pokedex.style.backgroundColor = `var(--${pokemon.types[0].type.name})`
}

/**
 * Função que insere e formata o nome e ID do pokémon
 * 
 * @param pokemon Dados do pokemon obtidos da API
 */
const insertNameAndIdPokemon = pokemon => {
  pokemonName.innerText = pokemon.name.toUpperCase()
  pokemonId.innerText = '#' + formattedNumeral(pokemon.id)
}

/**
 * Função que insere a imagem do pokémon
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
 * Função que insere o(s) tipo(s) do pokémon
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
 * Função que calcula o valor correto para inserir
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
 * Função que cria os elementos HTML e insere as estatísticas básicas do pokémon
 * 
 * @param pokemon Dados do pokemon obtidos da API
 */
const createTemplateHTMLAndSetPokemonBaseStats = pokemon => {
  stats.innerHTML = `<h3 id="sub-title-base-stat">Base Stats</h3>`
  pokemon.stats.forEach(st => {
    stats.innerHTML +=
      `<div class="stat-row">
    <div class="stat-desc"></div>
    <div class="stat-value"></div>
    <div class="stat-bar">
     <div class="bar-outer">
       <div class="bar-inner"></div>
     </div>
    </div>
   </div>`
  })

  setPokemonBaseStats(pokemon)
}

/**
 * Função que insere as estatísticas básicas do pokémon
 * 
 * @param pokemon Dados do pokemon obtidos da API
 */
const setPokemonBaseStats = pokemon => {
  const titleH3 = document.querySelector('#sub-title-base-stat')
  const statDesc = document.querySelectorAll('.stat-desc')
  const statValue = document.querySelectorAll('.stat-value')
  const barOuter = document.querySelectorAll('.bar-outer')
  const barInner = document.querySelectorAll('.bar-inner')

  titleH3.style.color = `var(--${pokemon.types[0].type.name})`
  pokemon.stats.forEach((st, index) => {
    statDesc[index].innerText = `${st.stat.name.toUpperCase()}`
    statDesc[index].style.color = `var(--${pokemon.types[0].type.name})`
    statValue[index].innerText = `${formattedNumeral(st.base_stat)}`
    barOuter[index].style.backgroundColor = `var(--${pokemon.types[0].type.name + 'Alpha'})`
    barInner[index].style.backgroundColor = `var(--${pokemon.types[0].type.name})`
    barInner[index].style.width = `${calculateStatValue(st.base_stat)}%`
  })
}

/**
 * Função que valida se a div possui elementos filhos
 * 
 * @returns Retorna true se houver(em) elementos filhos e false caso contrário 
 */
const validateBaseStatsHasFilled = () => !stats.hasChildNodes()

/**
 * Função que insere as estatísticas básicas do pokémon
 * 
 * @param pokemon Dados do pokémon obtidos da API
 */
const insertPokemonBaseStats = pokemon => {
  if (validateBaseStatsHasFilled()) {
    createTemplateHTMLAndSetPokemonBaseStats(pokemon)
  } else {
    setPokemonBaseStats(pokemon)
  }
}

/**
 * Função que verifica se o campo texto input está vazio
 * 
 * @param text Texto digitado no input
 * @returns true caso o comprimento do texto seja maior que 1 e
 *          false caso contrário
 */
const validateText = text => {
  if (text.length < 1) {
    messageModal(NO_TEXT_INPUT)

    return false
  }

  return true
}

/**
 * Função que formata o numero para 3 casas decimais
 * 
 * @param number Número que será formatado
 * @returns Retorna o numero no formato 000
 */
const formattedNumeral = number => number.toString().padStart(3, 0)

/**
 * Função que formata o texto obtido no input
 * 
 * @returns Texto formatado digitado no input
 */
const formattedInputText = () => {
  const value = inputText.value.toLowerCase().trim().split(' ').join('-')

  return value
}

/**
 * Função que insere um texto no modal
 * 
 * @param value Texto que será inserido no modal
 */
const insertMessageModal = value => {
  const modalBody = document.querySelector('.modal-body')
  modalBody.innerText = value
}

/**
 * Função que exibe ou exibe o modal
 */
const toggleModal = () => {
  const fade = document.querySelector('#fade')
  const modal = document.querySelector('#modal')
  fade.classList.toggle('hide')
  modal.classList.toggle('hide')
}

/**
 * Função que oculta o modal
 */
const hideMessageModal = () => {
  const closeModal = document.querySelector('#close-modal')
  closeModal.addEventListener('click', toggleModal)
}

/**
 * Função que cria a mensagem modal
 * 
 * @param value Texto que será utilizado no modal
 */
const messageModal = value => {
  insertMessageModal(value)
  toggleModal()
  hideMessageModal()
}

/**
 * Função que realiza a limpeza do campo input text
 * 
 * @returns Retorna uma string vazia para o valor do input
 */
const cleanInputText = () => inputText.value = ''

/**
 * Função principal que invoca as demais funções
 * 
 * @returns Retorna para a função chamadora
 */
const init = async () => {
  const value = formattedInputText()
  if (!validateText(value)) {
    return
  }
  const pokemon = await fetchPokemon(value)
  if (pokemon == null) {
    return
  }
  setPokedexAccentColor(pokemon)
  insertNameAndIdPokemon(pokemon)
  insertPokemonImage(pokemon)
  insertPokemonTypes(pokemon)
  insertPokemonBaseStats(pokemon)
  cleanInputText()
}

/**
 * Listener de evento na imagem de lupa para capturar
 * o nome do pokémon ou ID
 */
imgSearch.addEventListener('click', () => {
  init()
})

/**
 * Listener de evento no input que captura se o usuário pressionou a tecla Enter
 */
inputText.addEventListener('keydown', event => {
  if (event.keyCode === 13) {
    init()
  }
})