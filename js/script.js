const imgSearch = document.querySelector('#img-search')
const inputText = document.querySelector('#input-text')
const pokemonName = document.querySelector('#pokemon-name')
const pokemonId = document.querySelector('#pokemon-id')
const imagePlaceholder = document.querySelector('#image-placeholder')
const types = document.querySelector('#types')
const about = document.querySelector('#about')
const stats = document.querySelector('#stats')
const pokedex = document.querySelector('#pokedex')
const baseStat = document.querySelector('#base-stat')
const pokemonData = document.querySelector('#pokemon-data')
const conteinerNav = document.querySelector('#conteiner-pokemon-nav')
const arrowLeft = document.querySelector('#arrow-left')
const arrowRight = document.querySelector('#arrow-right')
const topCard = document.querySelector('#top')
const containerNavArrowLeft = document.querySelector('#container-nav-arrow-left')
const frame = document.querySelector('#frame')

const MAX_STAT_VALUE = 255
const POKEMON_NOT_FOUND = 'Pokémon not found'
const NO_TEXT_INPUT = 'Insert a pokémon name or ID'


const validateResponseStatus = response => response.status == 200

const fetchPokemon = async value => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${value}`)
  if (!validateResponseStatus(response)) {
    messageModal(POKEMON_NOT_FOUND)

    return null
  }
  const pokemon = response.json()

  return pokemon
}

const setPokedexAccentColor = pokemon => {
  pokedex.style.backgroundColor = `var(--${pokemon.types[0].type.name})`
}

const insertNameAndIdPokemon = pokemon => {
  pokemonName.innerText = pokemon.name.toUpperCase()
  pokemonId.innerText = '#' + formattedNumeral(pokemon.id)
}

const insertPokemonImage = pokemon => {
  const img = document.createElement('img')
  const image = pokemon.sprites.other["official-artwork"].front_default
  img.setAttribute('id', 'pokemon-image')
  img.setAttribute('alt', pokemon.name)
  img.src = image
  conteinerNav.classList.remove('hiden')

  imagePlaceholder.innerHTML = ''
  imagePlaceholder.appendChild(img)
}

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

const calculateWeightOrHeight = value => value / 10

const createTemplateHTMLAboutPokemon = () => {
  about.innerHTML = ''
  about.innerHTML =
    `<h3 id="sub-title-about">About</h3>
    <div id="specs">
      <div id="weight" class="characteristics">
        <span class="icon">
          <img src="./assets/icon-weight.svg" alt="weight">
          <span id="value-weight"></span>
        </span>
        <span class="text-characteristics">Weight</span>
      </div>
      <div class="line-separator"></div>
      <div id="height" class="characteristics">
        <span class="icon">
        <img src="./assets/icon-scaler.svg" alt="scaler">
        <span id="value-height"></span>
        </span>
        <span class="text-characteristics">Height</span>
      </div>
      <div class="line-separator"></div>
      <div id="abilities" class="characteristics">
        <div id="abilities-texts"></div>
        <span class="text-characteristics">Abilities</span>
      </div>
    </div>
  </div>`
}

const insertPokemonAbilities = pokemon => {
  const abilitiesTexts = document.querySelector('#abilities-texts')
  const uniqueNameAbility = new Set()
  
  abilitiesTexts.innerHTML = ''
  pokemon.abilities.forEach(ab => {
    uniqueNameAbility.add(ab.ability.name)
  })

  const abilitiesPokemon = Array.from(uniqueNameAbility)
  
  abilitiesPokemon.forEach(abilityPokemon => {
    const ability = document.createElement('span')
    ability.classList.add('ability')
    ability.innerText = `${abilityPokemon}`
    abilitiesTexts.append(ability)
  })
} 

const insertAboutPokemon = pokemon => {

  createTemplateHTMLAboutPokemon()

  const subTitleAbout = document.querySelector('#sub-title-about')
  const valueWeight = document.querySelector('#value-weight')
  const valueHeight = document.querySelector('#value-height')

  subTitleAbout.style.color = `var(--${pokemon.types[0].type.name})`
  valueWeight.innerText = `${calculateWeightOrHeight(pokemon.weight)} kg`
  valueHeight.innerText = `${calculateWeightOrHeight(pokemon.height)} m`

  insertPokemonAbilities(pokemon)
}

const calculateStatValue = value => {
  const baseValue = MAX_STAT_VALUE
  const calculateValue = (value / baseValue) * 100
  const valueCalculated = Math.round(calculateValue)

  return valueCalculated
}

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

const validateBaseStatsHasFilled = () => !stats.hasChildNodes()

const insertPokemonBaseStats = pokemon => {
  if (validateBaseStatsHasFilled()) {
    createTemplateHTMLAndSetPokemonBaseStats(pokemon)
  } else {
    setPokemonBaseStats(pokemon)
  }
}

const validateText = text => {
  if (text.length < 1) {
    messageModal(NO_TEXT_INPUT)

    return false
  }

  return true
}

const formattedNumeral = number => number.toString().padStart(3, 0)

const formattedInputText = value => {
  value.toString().toLowerCase().trim().split(' ').join('-')
  return value
}

const insertMessageModal = value => {
  const modalBody = document.querySelector('.modal-body')
  modalBody.innerText = value
}

const toggleModal = () => {
  const fade = document.querySelector('#fade')
  const modal = document.querySelector('#modal')
  fade.classList.toggle('hide')
  modal.classList.toggle('hide')
}

const hideMessageModal = () => {
  const closeModal = document.querySelector('#close-modal')
  closeModal.addEventListener('click', toggleModal)
}

const messageModal = value => {
  insertMessageModal(value)
  toggleModal()
  hideMessageModal()
}

const cleanInputText = () => inputText.value = ''

const getPokemonId = () => {
  const id = Math.abs(pokemonId.innerText.slice(1))
  return id
}

const toggleArrowLeft = () => {
  const id = getPokemonId()
  if (id > 1) {
    containerNavArrowLeft.classList.remove('hiden')
  } else {
    containerNavArrowLeft.classList.add('hiden')
  }
}

const init = async (value) => {
  value = formattedInputText(value)
  const pokemon = await fetchPokemon(value)
  if (pokemon == null) {
    return
  }
  pokemonData.classList.remove('hiden')
  topCard.style.height = '35%'
  setPokedexAccentColor(pokemon)
  insertNameAndIdPokemon(pokemon)
  insertPokemonImage(pokemon)
  insertPokemonTypes(pokemon)
  insertAboutPokemon(pokemon)
  insertPokemonBaseStats(pokemon)
  cleanInputText()
  toggleArrowLeft()
}

imgSearch.addEventListener('click', () => {
  if (!validateText(inputText.value)) {
    return
  }
  init(inputText.value)
})

inputText.addEventListener('keydown', event => {
  if (event.keyCode === 13) {
    if (!validateText(inputText.value)) {
      return
    }
    init(inputText.value)
  }
})

arrowLeft.addEventListener('click', () => {
  const id = getPokemonId() - 1
  init(id)
})

arrowRight.addEventListener('click', () => {

  const id = getPokemonId() + 1
  init(id)
})