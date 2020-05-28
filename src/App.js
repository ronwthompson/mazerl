import React, { useEffect, useState } from 'react';

function App() {
  const [values, setValues] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1]
  ])

  const world =  [
    ["R", "O", "O", "O", "O", "O", "O", "O"],
    ["O", "X", "X", "X", "X", "X", "X", "O"],
    ["O", "X", "O", "O", "O", "O", "O", "O"],
    ["O", "X", "O", "X", "X", "X", "X", "X"],
    ["O", "O", "O", "X", "O", "O", "O", "O"],
    ["O", "O", "O", "X", "O", "X", "O", "O"],
    ["O", "O", "O", "O", "O", "X", "O", "O"],
    ["O", "O", "O", "O", "O", "X", "O", "E"]
  ]

  const [worldIteration, setWorldIteration] =  useState(world)

  const [iteration, setIteration] = useState(0)

  const discount = 0.8

  const generateMap = worldIteration.map((row, rowIndex) => {
    return <div key={`row-${rowIndex}`}>
      {
        row.map((column,  columnIndex) => {
          if(column === "O" || column ===  "E"){
            return (
              <div key={`space-${rowIndex}-${columnIndex}`} style={{
                display: "inline-block",
                height: "30px",
                width: "30px",
                textAlign: "center",
                border: "solid 1px",
                boxSizing: "border-box",
                backgroundColor: `rgba(0, 204, 0, ${values[rowIndex][columnIndex]})`,
                fontSize: "0.5em",
                marginRight: "5px"
              }}>
                {Math.round(values[rowIndex][columnIndex] * 100) / 100}
              </div>
            )
          } else if(column === "R"){
            return (
              <div key={`space-${rowIndex}-${columnIndex}`} style={{
                display: "inline-block",
                height: "30px",
                width: "30px",
                textAlign: "center",
                border: "solid 1px",
                boxSizing: "border-box",
                backgroundColor: `rgba(0, 204, 0, ${values[rowIndex][columnIndex]})`,
                fontSize: "0.5em",
                boxShadow: "inset 0px 0px 10px green",
                marginRight: "5px"
              }}>
                {Math.round(values[rowIndex][columnIndex] * 100) / 100}
              </div>
            )
          } else if(column === "D"){
            return (
              <div key={`space-${rowIndex}-${columnIndex}`} style={{
                display: "inline-block",
                height: "30px",
                width: "30px",
                textAlign: "center",
                border: "solid 1px",
                boxSizing: "border-box",
                backgroundColor: `rgba(0, 204, 0, ${values[rowIndex][columnIndex]})`,
                fontSize: "0.5em",
                boxShadow: "inset 0px 0px 10px red",
                marginRight: "5px"
              }}>
                {Math.round(values[rowIndex][columnIndex] * 100) / 100}
              </div>
            )
          } else if (column === "X"){
            return (
              <div key={`space-${rowIndex}-${columnIndex}`}  style={{
                display: "inline-block",
                backgroundColor: "red",
                height: "30px",
                width: "30px",
                border: "solid 1px red",
                boxSizing: "border-box",
                textAlign: "center",
                fontSize: "0.5em",
                marginRight: "5px"
              }}>
                X
              </div>
            )
          }
        })
      }
    </div>
  })

  useEffect(() => {
    runIteration()
  }, [worldIteration]);

  const resetWorld = () => {
    setWorldIteration(world)
  }

  const runIteration = () => {
    const currentSpot = [0,0]
    const currentWorldMap = worldIteration
    let steps = 0

    while(steps < 64){
      let nextSpots = []
      const row = currentSpot[0]
      const column = currentSpot[1]
      const moveLeft = currentWorldMap[row][column - 1]
      const moveRight = currentWorldMap[row][column + 1]
      const moveUp = currentWorldMap[row + 1] ? currentWorldMap[row + 1][column] : "X"
      const moveDown = currentWorldMap[row - 1] ? currentWorldMap[row - 1][column] : "X"

      if(moveLeft && (moveLeft === "O" || moveLeft === "E")){
        nextSpots.push([row, column - 1, values[row][column - 1]])
      }
      if(moveRight && (moveRight === "O" || moveRight === "E")){
        nextSpots.push([row, column + 1, values[row][column + 1]])
      }
      if(moveUp && (moveUp === "O" || moveUp === "E")){
        nextSpots.push([row + 1, column, values[row + 1][column]])
      }
      if(moveDown && (moveDown === "O" || moveDown === "E")){
        nextSpots.push([row - 1, column, values[row - 1][column]])
      }

      nextSpots.sort((a,b) => {
        return b[2] - a[2]
      })

      let nextRow
      let nextCol

      if (nextSpots.length === 0){
        worldIteration[row][column] = "D"
        console.log('Dead End')
        break
      } else if (nextSpots.length === 1) {
        nextRow = nextSpots[0][0]
        nextCol = nextSpots[0][1]
      } else {
        let spliceIndex = nextSpots.length

        for(let i = 1; i < nextSpots.length; i++){
          if (nextSpots[i][2] !== nextSpots[i - 1][2]){
            spliceIndex = i
          }
        }

        nextSpots = nextSpots.slice(0, spliceIndex)
        const numOfNextSpots = nextSpots.length
        const randomNextIndex =  Math.floor(Math.random() * Math.floor(numOfNextSpots));

        nextRow = nextSpots[randomNextIndex][0]
        nextCol = nextSpots[randomNextIndex][1]
      }

      if(values[nextRow][nextCol] > 0){
        values[row][column] = values[nextRow][nextCol] * discount
        if(values[nextRow][nextCol] === 1){
          console.log('Exit Found')
          break
        }
      }

      worldIteration[row][column] = "R"
      currentSpot[0] = nextRow
      currentSpot[1] = nextCol

      steps++
    }

    setIteration(iteration + 1)
  }

  return (
    <div style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    }}>
      {generateMap}
      <p>{`Current Iteration: ${iteration}`}</p>
      <button onClick={resetWorld}>Run Iteration</button>
    </div>
  );
}

export default App;
