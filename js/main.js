const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

let gElCanvas
let gCtx
let gCurrShape = {
  shape: 'rect',
  fillColor: '#ffffff',
  strokeColor: '#000000',
  startPosX: 0,
  startPosY: 0,
  offsetX: 0,
  offsetY: 0,
  dX: 0,
  dY: 0,
  isDrag: false,
}

function init() {
  gElCanvas = document.querySelector('.canvas')
  gCtx = gElCanvas.getContext('2d')
  console.log('gCtx', gCtx)

  resizeCanvas()
  addListeners()
}

function resizeCanvas() {
  const elContainer = document.querySelector('.canvas-container')
  gElCanvas.width = elContainer.offsetWidth
  gElCanvas.height = elContainer.offsetHeight
}

function addListeners() {
  addMouseListeners()
  addTouchListeners()
  // Listen for resize ev
  window.addEventListener('resize', () => {
    init()
  })
}

function addMouseListeners() {
  gElCanvas.addEventListener('mousedown', onDown)
  gElCanvas.addEventListener('mousemove', onMove)
  gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
  gElCanvas.addEventListener('touchstart', onDown)
  gElCanvas.addEventListener('touchmove', onMove)
  gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
  gCurrShape.isDrag = true
  // Get the ev pos from mouse or touch
  getEvPos(ev)
  //Save the pos we start from
  gCurrShape.startPosX = gCurrShape.offsetX
  gCurrShape.startPosY = gCurrShape.offsetY
  document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
  if (!gCurrShape.isDrag) return

  getEvPos(ev)
  // Calc the delta , the diff we moved
  gCurrShape.dX = Math.abs(gCurrShape.offsetX - gCurrShape.startPosX) * 3
  gCurrShape.dY = Math.abs(gCurrShape.offsetY - gCurrShape.startPosY) * 3

  // Save the last pos , we remember where we`ve been and move accordingly
  gCurrShape.startPosX = gCurrShape.offsetX
  gCurrShape.startPosY = gCurrShape.offsetY

  draw(ev)
}

function onUp() {
  gCurrShape.isDrag = false
  document.body.style.cursor = 'grab'
}

function getEvPos(ev) {
  // Gets the offset pos , the default pos
  gCurrShape.offsetX = ev.offsetX
  gCurrShape.offsetY = ev.offsetY
  // Check if its a touch ev
  if (TOUCH_EVS.includes(ev.type)) {
    //soo we will not trigger the mouse ev
    ev.preventDefault()
    //Gets the first touch point
    ev = ev.changedTouches[0]
    //Calc the right pos according to the touch screen
    gCurrShape.offsetX = ev.pageX - ev.target.offsetLeft - ev.target.clientLeft
    gCurrShape.offsetX = ev.pageY - ev.target.offsetTop - ev.target.clientTop
  }
}

function setFillColor(fillColor) {
  gCurrShape.fillColor = fillColor
}

function setStrokeColor(strokeColor) {
  gCurrShape.strokeColor = strokeColor
}

function clearCanvas() {
  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function setShape(shape) {
  gCurrShape.shape = shape
}

function draw() {
  switch (gCurrShape.shape) {
    case 'line':
      drawLine(gCurrShape.offsetX, gCurrShape.offsetY)
      break
    case 'triangle':
      drawTriangle(gCurrShape.offsetX, gCurrShape.offsetY)
      break
    case 'rect':
      drawRect(gCurrShape.offsetX, gCurrShape.offsetY)
      break
    case 'arc':
      drawArc(gCurrShape.offsetX, gCurrShape.offsetY)
      break
    case 'pencil':
      drawPencil(gCurrShape.offsetX, gCurrShape.offsetY)
      break
    case 'text':
      drawText('Hello', gCurrShape.offsetX, gCurrShape.offsetY)
      break
  }
}

function drawLine(x, y, xEnd = gCurrShape.dX, yEnd = gCurrShape.dY) {
  gCtx.beginPath() // Starts a new path -> Call this method when you want to create a new path.
  gCtx.moveTo(x, y) // Moves the starting point of a new path to the (x, y) coordinates.
  gCtx.lineTo(xEnd, yEnd) // Connects the last point in the current path to the specified (x, y) coordinates with a straight line.
  gCtx.lineWidth = 3
  gCtx.strokeStyle = gCurrShape.strokeColor // Color or style to use for the lines around shapes. Default #000 (black).
  gCtx.stroke() // Strokes the current paths with the current stroke style.
}

function drawTriangle(x, y) {
  gCtx.beginPath()
  gCtx.lineWidth = 5
  gCtx.moveTo(x, y)
  gCtx.lineTo(getRandomInt(0, gElCanvas.width), gCurrShape.dX)
  gCtx.lineTo(getRandomInt(0, gElCanvas.width), gCurrShape.dY)

  gCtx.closePath()
  gCtx.strokeStyle = gCurrShape.strokeColor // Color or style to use for the lines around shapes. Default #000 (black).
  gCtx.stroke() // Strokes the current paths with the current stroke style.
  gCtx.fillStyle = gCurrShape.fillColor // Color or style to use inside shapes. Default #000 (black).
  gCtx.fill() // Fills the current paths with the current fill style.
}

function drawRect(x, y) {
  gCtx.lineWidth = 5
  gCtx.strokeStyle = gCurrShape.strokeColor
  gCtx.strokeRect(x, y, gCurrShape.dX, gCurrShape.dY)
  gCtx.fillStyle = gCurrShape.fillColor
  gCtx.fillRect(x, y, gCurrShape.dX, gCurrShape.dY)
}

function drawArc(x, y) {
  gCtx.beginPath()
  gCtx.lineWidth = 5
  // The x,y cords of the center , The radius, The starting angle, The ending angle, in radians
  gCtx.arc(x, y, gCurrShape.dX + gCurrShape.dY, 0, 2 * Math.PI) // Used to create a circle
  gCtx.strokeStyle = gCurrShape.strokeColor
  gCtx.stroke()
  gCtx.fillStyle = gCurrShape.fillColor
  gCtx.fill()
}

function drawPencil(x, y) {
  gCtx.beginPath()
  gCtx.lineWidth = 5
  // The x,y cords of the center , The radius, The starting angle, The ending angle, in radians
  gCtx.arc(x, y, 5, 0, 2 * Math.PI) // Used to create a circle
  gCtx.strokeStyle = gCurrShape.strokeColor
  // gCtx.stroke()
  gCtx.fillStyle = gCurrShape.fillColor
  gCtx.fill()
}

function drawText(text, x, y) {
  gCtx.lineWidth = 2
  gCtx.strokeStyle = gCurrShape.strokeColor
  gCtx.fillStyle = gCurrShape.fillColor
  gCtx.font = `${gCurrShape.dX + gCurrShape.dY}px Arial`
  gCtx.textAlign = 'center'
  gCtx.textBaseline = 'middle'

  gCtx.fillText(text, x, y) // Draws (fills) a given text at the given (x, y) position.
  gCtx.strokeText(text, x, y) // Draws (strokes) a given text at the given (x, y) position.
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}
