import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'


import React, {useRef, useState, useEffect} from 'react'
import * as tf from '@tensorflow/tfjs'
import * as facemesh from '@tensorflow-models/facemesh'
import Webcam from 'react-webcam'


import { drawMesh } from './utilities'



export default function Home() {

  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  const [faceIsShowing, setFaceIsShowing] = useState(true)

  const [gatherData, setGatherData] = useState()

  const [net , setNet] = useState()

  const [faceData, setFaceData] = useState()

  const runFacemesh = async () => {
      const net = await facemesh.load({
        inputResolution:{width:640, height:480}, 
        // inputResolution:{width:1280, height:960}, 
        scale:.5
      })
      
      setInterval(() => {
          detectFace(net)
        }, 300)
      
    }
    
    const detectFace = async (net) => {
      if (
        typeof webcamRef.current !=='undefined' && 
        webcamRef.current !== null && 
        webcamRef.current.video.readyState === 4
        ) {
      // if (typeof webcamRef.current !=='undefined' && webcamRef.current !== null) {
        // console.log('you are seeing this')
        const video = webcamRef.current.video
        const videoWidth = webcamRef.current.video.videoWidth
        const videoHeight = webcamRef.current.video.videoHeight

      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight

      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight
      
      
        // console.log(gatherData)
        const face = await net.estimateFaces(video)
        // if (face)
        // console.log(face[0])
        if (face[0]) {
          setFaceData(face[0])
          // console.log('NICE FACE BRO')
          setFaceIsShowing(true)
        } else {
          // console.log('SHOW YOURSELF')
          setFaceIsShowing(false)
        }
  
        const ctx = canvasRef.current.getContext("2d")
        drawMesh(face, ctx)
      


    }
  }

  useEffect(() => {
    runFacemesh()
  }, [])
    
  // runFacemesh()
  const collectFaceData = async () => {

  }

  const check = () => {
    if (faceData.boundingBox.topLeft[0] > 240) {
      console.log('you are on the left side of the webcam')
    } else {
      console.log('you are on the right side of the webcam')
    }
    // console.log(faceData.boundingBox.topLeft[0])
  }
    

  return (
    <div className={styles.container}>
      <Head>
        <title>xktensormesh</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <h1>{faceIsShowing ? 'LOOKING GOOD' : 'SHOW YOUR FACE!!!!'}</h1>
      <main className={styles.main}>

        {/* <div className='app-header'> */}
          {/* <button onClick={() => check()}>CHECK</button>
        <button onClick={() => collectFaceData()}>{faceIsShowing ? 'gathering' : 'not gathering'}</button> */}
        {/* {
          faceData &&
          <h1
            style={{
              position: 'absolute',
              fontSize: '32px',
              height:'100px',
              width: '100px',
              // left:'500px'
              left: `${faceData.boundingBox.topLeft[0] + 200}px`
            }}
          >👽</h1>
        } */}
        <Webcam ref={webcamRef} style={
          {
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex:9,
            width: 640,
            height: 480,
            // width: 1280,
            // height: 960,
          }
        }/>
        <canvas ref={canvasRef} style={
          {
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex:9,
            width: 640,
            height: 480,
            // width: 1280,
            // height: 960,
            // backgroundColor: 'blue'
          }
        }/>
        {/* </div> */}
      </main>
    </div>
  )
}
