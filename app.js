// DOM Imports
const addAlarm = document.getElementById('add-alarm')
const stopAlarm = document.getElementById('stop')
const time = document.getElementById('time')
const hours = document.getElementById('hours')
const minutes = document.getElementById('minutes')
const seconds = document.getElementById('seconds')
const AMPM = document.getElementById('AMPM')
const alarmInput = document.getElementById('alarm-input')
const inputTime = document.getElementById('input-time')
const closeBtn = document.getElementById('close')
const setTime = document.getElementById('set-time')
const resetTime = document.getElementById('reset-time')
const upcomingAlarms = document.getElementById('upcoming-alarms')

// Functional Constants
const alarmSound = new Audio('./sounds/alarm.mp3')
alarmSound.loop = true

// Event Listeners
addAlarm.addEventListener('click', () => {
  alarmInput.classList.add('active')
})

closeBtn.addEventListener('click', () => {
  alarmInput.classList.remove('active')
})

setTime.addEventListener('click', () => {
  setAlarmTime(inputTime.value)
})
resetTime.addEventListener('click', () => (inputTime.value = ''))

// Utility Functions
function setAlarmTime(time) {
  const timeString = new Date()
  let currentTime = timeString.toLocaleTimeString()
  document.write(currentTime, ' ', time)
  let alarmTime = time
  alarmTime = alarmTime + ':00'
  alarmTime = alarmTime.split(':')
  setAlarm(alarmTime)
}

function setAlarm(time) {
  let alarmActive = true
  let AP = ' am'
  if (+time[0] > 12) {
    time[0] = +time[0] - 12
    time = time.join(':')
    AP = ' pm'
    time += AP
  } else {
    time = time.join(':')
    time += AP
  }
  // main alarm
  const nextAlarm = document.createElement('div')
  nextAlarm.classList.add('next-alarm')
  nextAlarm.innerHTML = `
  <input type="text" value="${time}" id="edit-alarm">
    <button id='delete-alarm'> <i class='fa-solid fa-trash'></i> </button>
    <span>Click the time to edit alarm and trash to delete alarm</span>
  `
  upcomingAlarms.firstElementChild.classList.add('active')
  upcomingAlarms.appendChild(nextAlarm)
  addAlarm.disabled = true
  addAlarm.style.cursor = 'not-allowed'

  // edit alarm
  nextAlarm.firstElementChild.addEventListener('click', () => {
    const confirmDiv = document.createElement('div')
    confirmDiv.classList.add('confirm-div')
    confirmDiv.innerHTML = `
    <input type="time" id="input-time" />
    <i class="fa-solid fa-circle-check"></i>
    `
    nextAlarm.firstElementChild.value = ''
    nextAlarm.firstElementChild.nextElementSibling.remove()
    confirmDiv.lastElementChild.addEventListener('click', () => {
      if (confirmDiv.firstElementChild.value) {
        setAlarmTime(confirmDiv.firstElementChild.value)
        console.log(confirmDiv.firstElementChild.value)
        nextAlarm.remove()
      }
    })
    nextAlarm.appendChild(confirmDiv)
  })

  // delete alarm
  nextAlarm.firstElementChild.nextElementSibling.addEventListener(
    'click',
    () => {
      nextAlarm.remove()
      addAlarm.disabled = false
      upcomingAlarms.firstElementChild.classList.remove('active')
      addAlarm.style.cursor = 'pointer'
    }
  )

  // Function to check alarm time to current time
  const clearCheck = setInterval(() => {
    const timeString = new Date()
    let currentTime = timeString.toLocaleTimeString()
    if (currentTime == time) {
      alarmSound.play()
      alarmActive = false
      stopAlarm.style.display = 'block'
      nextAlarm.remove()
      upcomingAlarms.firstElementChild.classList.remove('active')
    }
  }, 1000)

  // Stop Button
  stopAlarm.addEventListener('click', () => {
    if (!alarmActive) {
      alarmSound.pause()
      clearInterval(clearCheck)
      addAlarm.disabled = false
      upcomingAlarms.firstElementChild.classList.remove('active')
      addAlarm.style.cursor = 'pointer'

      stopAlarm.style.display = 'none'
      nextAlarm.remove()
    }
  })

  inputTime.value = ''
  alarmInput.classList.remove('active')
}

// Function to display current time updating every second
function updateTime() {
  const dateObj = new Date()
  const currentHours = dateObj.getHours()
  const currentMinutes = dateObj.getMinutes()
  const currenSeconds = dateObj.getSeconds()
  const formatHours = currentHours % 12
  const currentAMPM = hours < 12 ? 'AM' : 'PM'

  hours.textContent = addZero(formatHours)
  minutes.textContent = addZero(currentMinutes)
  seconds.textContent = addZero(currenSeconds)
  AMPM.textContent = currentAMPM
}

function addZero(time) {
  if (time < 10) {
    return '0' + time
  }
  return time
}

setInterval(updateTime, 1000)
