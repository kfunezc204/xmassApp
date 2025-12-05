const cards = [...document.querySelectorAll('.card')]
const spinBtn = document.getElementById('spinBtn')
const resetBtn = document.getElementById('resetBtn')
const modal = document.getElementById('modal')
const prizeBox = document.getElementById('prizeBox')
const modalTitle = document.getElementById('modalTitle')

// Config probabilidades
const premios = [
  { nombre: 'Ganaste una Ristra de Perla de río', peso: 10, real: true },
  { nombre: 'Ganaste una Ristra de Murano', peso: 20, real: true },
  { nombre: 'Ganaste un Exhibidor de Aritos', peso: 20, real: true },
  { nombre: 'Ganaste una Pana Organizadora', peso: 10, real: true },
  { nombre: 'Ganaste una Ristra de cristal de forma', peso: 20, real: true },
  { nombre: 'Gracias por participar', peso: 20, real: false },
]

let spinning = false
let chosenIndex = null

// Random con peso
function weightedRandomIndex(items) {
  const total = items.reduce((s, i) => s + i.peso, 0)
  let r = Math.random() * total
  for (let i = 0; i < items.length; i++) {
    r -= items[i].peso
    if (r <= 0) return i
  }
  return 0
}

function clearAll() {
  cards.forEach((c) => {
    c.classList.remove('active', 'dim', 'winner')
  })
}

function showResult() {
  const p = premios[chosenIndex]

  prizeBox.textContent = p.nombre
  modalTitle.textContent = p.real ? '¡Felicidades!' : '¡Gracias!'

  modal.classList.add('show')

  // Confetti solo si es premio real
  if (p.real) launchConfetti()
}

function hideResult() {
  modal.classList.remove('show')
}

// Animación shuffle → 4 segundos
async function spinAnimation() {
  const tEnd = Date.now() + 3000
  let i = 0
  while (Date.now() < tEnd) {
    clearAll()
    cards[i % 6].classList.add('dim')
    await new Promise((r) => setTimeout(r, 100))
    i++
  }
}

spinBtn.onclick = async () => {
  if (spinning) return
  spinning = true

  spinBtn.disabled = true
  resetBtn.disabled = true

  chosenIndex = weightedRandomIndex(premios)
  await spinAnimation()

  clearAll()

  const winningCard = cards[chosenIndex]

  // Voltear carta ganadora
  winningCard.classList.add('active', 'winner')
  winningCard.querySelector('.card-inner').style.transform = 'rotateY(180deg)'

  // Esperar 2s antes de mostrar popup
  setTimeout(() => {
    showResult()
    spinning = false
  }, 2000)
}

resetBtn.onclick = () => {
  hideResult()
  clearAll()

  // Resetear transform de TODAS las cartas
  cards.forEach(
    (c) => (c.querySelector('.card-inner').style.transform = 'rotateY(0deg)')
  )

  spinBtn.disabled = false
  resetBtn.disabled = false
}

document.getElementById('okBtn').onclick = () => {
  hideResult()
  resetBtn.onclick()
}

// 🎉 CONFETTI 🎉
function launchConfetti() {
  const duration = 1800
  const end = Date.now() + duration

  ;(function frame() {
    // Disparo doble para más explosión
    confetti({ particleCount: 5, spread: 70, origin: { x: 0.3, y: 0.4 } })
    confetti({ particleCount: 5, spread: 70, origin: { x: 0.7, y: 0.4 } })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  })()
}
// ❄️ SNOW EFFECT ❄️
function startSnow() {
  const snowContainer = document.getElementById('snow')
  if (!snowContainer) {
    console.error('❗ No existe el div #snow')
    return
  }

  setInterval(() => {
    const flake = document.createElement('span')
    flake.classList.add('snowflake')
    flake.textContent = '❄︎'
    flake.style.left = Math.random() * 150 + 'vw'
    flake.style.fontSize = 10 + Math.random() * 20 + 'px'
    flake.style.animationDuration = 10 + Math.random() * 5 + 's'
    flake.style.opacity = 0.5 + Math.random() * 0.5

    snowContainer.appendChild(flake)

    setTimeout(() => {
      flake.remove()
    }, 9000)
  }, 150)
}

document.addEventListener('DOMContentLoaded', startSnow)
