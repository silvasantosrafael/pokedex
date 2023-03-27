const pokemonLogo = document.querySelector('#pokemon-logo')
const containerMenu = document.querySelector('.container-menu')
const buttonBack = document.querySelector('.button-back')
const imgSearch = document.querySelector('#img-search')
const inputText = document.querySelector('#input-text')
const container = document.querySelector('.container')
const frame = document.querySelector('#frame')
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
const arrowLeft = document.querySelector('#container-nav-arrow-left')
const arrowRight = document.querySelector('#container-nav-arrow-right')
const topCard = document.querySelector('#top')
const containerNavArrow = document.querySelectorAll('.container-nav-arrow')
const containerNavArrowLeft = document.querySelector('#container-nav-arrow-left')
const allPokemons = document.querySelector('[data-js="pokemon"]')
const buttonLoadMore = document.querySelector('#button-loading-more')


const MAX_STAT_VALUE = 255
const POKEMON_NOT_FOUND = 'Pokémon not found'
const NO_TEXT_INPUT = 'Insert a pokémon name or ID'


const fetchPokemon = async value => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${value}`)
  const validateResponseStatus = response => response.status == 200

  if (!validateResponseStatus(response)) {
    messageModal(POKEMON_NOT_FOUND)

    return null
  }
  const pokemon = response.json()

  return pokemon
}

const generatePromises = () => {
  const pokemonPromises = []
  for (let index = 1; index <= 12; index++) {
    pokemonPromises.push(fetchPokemon(index))
  }
  return pokemonPromises
}

//TODO Refatorar template string
const insertPokemonsIntoDOM = responses => {
  const pokemons = responses.reduce((acc, pokemon, index) => {
    const srcImg = pokemon.sprites.other['official-artwork'].front_default
    acc +=
      `  <div class="card" loading="lazy">
        <div data-card="${index + 1}" class="image" style="background-color: var(--${pokemon.types[0].type.name})">
          <img data-card="${index + 1}" src="${srcImg}" alt="${pokemon.name}" loading="lazy"/>
        </div>
        <div data-card="${index + 1}" class="id">Nº ${pokemon.id.toString().padStart(4, 0)}</div>
        <div data-card="${index + 1}" class="name">${pokemon.name}</div>
        <div data-card="${index + 1}" class="types">${pokemon.types.map(tp => `<span data-card="${index + 1}" class="type" style="background-color: var(--${tp.type.name})"">${tp.type.name}</span>`).join(' ')}</div>
      </div>`

    return acc
  }, '')

  allPokemons.innerHTML = ''
  allPokemons.innerHTML = pokemons
}

//TODO Refatorar função(Desacoplar função showPokemon)
const fetchAllPokemon = async () => {
  const responsePromises = await Promise.all(generatePromises())
  insertPokemonsIntoDOM(responsePromises)

  const showPokemon = () => {
    const card = document.querySelectorAll('.card')
    card.forEach(c => {
      c.addEventListener('click', (event) => {
        showPokemonCard(event)
      })
    })
  }
  showPokemon()
}

fetchAllPokemon()

//TODO Refatorar função(Desacoplar função showPokemon) e remover duplicidade de template string
buttonLoadMore.addEventListener('click', async () => {
  const pokemonPromises = []
  const totalPokemonCards = allPokemons.querySelectorAll('.card').length

  for (let index = totalPokemonCards + 1; index <= totalPokemonCards + 12; index++) {
    pokemonPromises.push(fetchPokemon(index))
  }

  const responses = await Promise.all(pokemonPromises)

  const pokemons = responses.reduce((acc, pokemon, index) => {
    const srcImg = pokemon.sprites.other['official-artwork'].front_default
    acc +=
      `  <div class="card" loading="lazy">
          <div data-card="${ index + totalPokemonCards + 1}" class="image" style="background-color: var(--${pokemon.types[0].type.name})">
            <img data-card="${ index + totalPokemonCards + 1}" src="${srcImg}" alt="${pokemon.name}" loading="lazy"/>
          </div>
          <div data-card="${ index + totalPokemonCards + 1}" class="id">Nº ${pokemon.id.toString().padStart(4, 0)}</div>
          <div data-card="${ index + totalPokemonCards + 1}" class="name">${pokemon.name}</div>
          <div data-card="${ index + totalPokemonCards + 1}" class="types">${pokemon.types.map(tp => `<span data-card="${ index + totalPokemonCards + 1}" class="type" style="background-color: var(--${tp.type.name})"">${tp.type.name}</span>`).join(' ')}</div>
        </div>`

    return acc
  }, '')

  allPokemons.innerHTML += pokemons

  const showPokemon = () => {
    const card = document.querySelectorAll('.card')
    console.log(card);
    card.forEach(c => {
      c.addEventListener('click', (event) => {
        showPokemonCard(event)
      })
    })
  }
  showPokemon()
})

const setPokedexAccentColor = ({ types }) => {
  pokedex.style.backgroundColor = `var(--${types[0].type.name})`
}

const insertNameAndIdPokemon = pokemon => {
  pokemonName.innerText = pokemon.name.toUpperCase()
  pokemonId.innerText = 'Nº ' + formattedNumeral(pokemon.id)
}

const insertPokemonImage = ({ sprites, name }) => {
  const img = document.createElement('img')
  const image = sprites.other["official-artwork"].front_default
  img.setAttribute('id', 'pokemon-image')
  img.setAttribute('alt', name)
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

const setPokemonBaseStats = ({ stats, types }) => {
  const titleH3 = document.querySelector('#sub-title-base-stat')
  const statDesc = document.querySelectorAll('.stat-desc')
  const statValue = document.querySelectorAll('.stat-value')
  const barOuter = document.querySelectorAll('.bar-outer')
  const barInner = document.querySelectorAll('.bar-inner')

  titleH3.style.color = `var(--${types[0].type.name})`
  stats.forEach((st, index) => {
    statDesc[index].innerText = `${st.stat.name.toUpperCase()}`
    statDesc[index].style.color = `var(--${types[0].type.name})`
    statValue[index].innerText = `${st.base_stat.toString().padStart(3, 0)}`
    barOuter[index].style.backgroundColor = `var(--${types[0].type.name + 'Alpha'})`
    barInner[index].style.backgroundColor = `var(--${types[0].type.name})`
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

const formattedNumeral = number => number.toString().padStart(4, 0)

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
  const id = Math.abs(pokemonId.innerText.slice(3))
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

const showPokemonCard = (event) => {
  const showAll = document.querySelectorAll('.hiden')
  buttonLoadMore.classList.add('hiden')
  allPokemons.classList.add('hiden')
  container.classList.remove('show-all-pokemons')
  showAll.forEach(item => {
    item.classList.toggle('hiden')
  })
  init(event.target.dataset.card);
}

const showAllPokemons = () => {
  containerMenu.classList.toggle('hiden')
  frame.classList.toggle('hiden')
  pokedex.classList.toggle('hiden')
  buttonLoadMore.classList.toggle('hiden')
  allPokemons.classList.toggle('hiden')
  containerNavArrow.forEach(item => {
    item.classList.add('hiden')
  })
  container.classList.toggle('show-all-pokemons')
}

const init = async (value) => {
  value = formattedInputText(value)
  const pokemon = await fetchPokemon(value)
  if (!pokemon) {
    return
  }
  pokemonData.classList.remove('hiden')
  topCard.style.height = '43%'
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

//TODO Refatorar função(Crescimento de código para frente)
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

buttonBack.addEventListener('click', () => {
  showAllPokemons()
})