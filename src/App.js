import { useCallback, useEffect, useRef, useState } from "react";

const colors = [
  'red', 'green', 'yellow', 'black', 'blue'
]

function App() {
  const canvasRef = useRef(null)
  const ctx = useRef(null)
  const [selectedColor, setSelectedColor] = useState('black')
  const [lastPosition, setLastPosition] = useState({x:0,y:0})
  const [mouseDown, setMouseDown] = useState(false)


  const draw = useCallback((x,y) =>
  {
      if(mouseDown)
      {
          ctx.current.beginPath()
          ctx.current.strokeStyle = selectedColor
          ctx.current.lineWidth = 10
          ctx.current.lineJoin = 'round'
          ctx.current.moveTo(lastPosition.x, lastPosition.y)
          ctx.current.lineTo(x,y)
          ctx.current.closePath()
          ctx.current.stroke()

          setLastPosition({x, y})

      }
  },[lastPosition, setLastPosition, mouseDown, selectedColor])

  useEffect(()=>
  {
      if(canvasRef.current)
      {
        ctx.current = canvasRef.current.getContext('2d')
      }
  },[])


  const onMouseDown = (e) => 
  {
    setLastPosition({
        x:e.pageX, y:e.pageY
      })
      setMouseDown(true)
  }

  const onMouseUp = (e) =>
  {
    setMouseDown(false)
  }
  
  const onMouseLeave = (e) =>
  {
    setMouseDown(false)
  }

  const onMouseMove = (e) =>
  {
    draw(e.pageX, e.pageY)
  }

  const clear = () =>
  {
     ctx.current.clearRect(0,0,ctx.current.canvas.width, ctx.current.canvas.height)
  }

  const download = async () =>
  {
    const image = canvasRef.current.toDataURL('image.png')
    const blob = await (await fetch(image)).blob()
    const blobURL = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobURL
    link.download = 'image.png'
    link.click()
  }
  return (
    <div className="App">
      <canvas 
        style={{border:"1px solid #000"}}
        width={400}
        height={400}
        ref={canvasRef}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        />
        <br/>
        <select 
          value={selectedColor}
          onChange={(e)=>setSelectedColor(e.target.value)}
          >
          {
            colors.map((color)=>
            
                <option key={color} value={color}>{color}</option>
            )
          }        
        </select>
        <button onClick={clear}>Clear</button>
        <button onClick={download}>Download</button>
    </div>
  );
}

export default App;
