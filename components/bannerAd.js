import { useEffect, useState } from "react"
import useWindowDimensions from "./useWindowDimensions";

const AD_REFRESH_MS = 30000 // refresh ad every 30 seconds

function findAdType(screenW, screenH, types, vertThresh) {
  let type = 0
  for (let i = 0; i < types.length; i++) {
    if (types[i][0] <= screenW * 0.9 && types[i][1] <= screenH * vertThresh) {
      type = i
    }
  }

  if (types[type][0] > screenW || types[type][1] > screenH * vertThresh)
    return -1

  return type
}

export default function Ad({
  types,
  centerOnOverflow,
  vertThresh = 0.3,
  screenW,
  screenH
}) {
  // just a div for now with optimal ad size, null if none are good
  const [type, setType] = useState(
    findAdType(screenW, screenH, types, vertThresh)
  )
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    console.log(window.location.hostname)
    if(window.location.hostname === "localhost") setIsClient("debug")
    else setIsClient(true)
  }, [])

  useEffect(() => {
    setType(findAdType(screenW, screenH, types, vertThresh))
  }, [screenW, screenH, types, vertThresh])

  useEffect(() => {
    const windowAny = window
    // clear ads
    const displayNewAd = () => {
      try {
        if (windowAny.aipDisplayTag && windowAny.aipDisplayTag.clear) {
          for (const type of types) {
            windowAny.aipDisplayTag.clear(
              `worldguessr-com_${type[0]}x${type[1]}`
            )
          }
        }
      } catch (e) {
        alert("error clearing ad")
      }
      if (type === -1) return
      setTimeout(() => {

      if (
        windowAny.aiptag &&
        windowAny.aiptag.cmd &&
        windowAny.aiptag.cmd.display
      ) {

        console.log(
          `requesting worldguessr-com_${types[type][0]}x${types[type][1]}`
        )

        windowAny.aiptag.cmd.display.push(function() {
          windowAny.aipDisplayTag.display(
            `worldguessr-com_${types[type][0]}x${types[type][1]}`
          )
        })
      } else {
      }
    }, 100)

    }

    let timerId = setInterval(() => {
      displayNewAd()
    }, AD_REFRESH_MS)
    displayNewAd()
    return () => clearInterval(timerId)
  }, [type])

  if (type === -1) return null
  if(!isClient) return null
  // if((window as any).adProvider === "gamemonetize") return null;

  return (
    <div
      style={{
        backgroundColor: (isClient==="debug") ? "gray" : undefined,
        height: (isClient==="debug") ? types[type][1] : undefined,
        width: (isClient==="debug") ? types[type][0] : undefined,
        // transform:
        //   centerOnOverflow && centerOnOverflow < types[type][0]
        //     ? `translateX(calc(-1 * (${types[type][0]}px - ${centerOnOverflow}px) / 2))`
        //     : undefined
      }}
      id={`worldguessr-com_${types[type][0]}x${types[type][1]}`}
    >
      {isClient==="debug" && (
        <>
          <h3>Banner Ad Here</h3>
          <p>
            Ad size: {types[type][0]} x {types[type][1]}
          </p>
        </>
      )}
    </div>
  )
}
