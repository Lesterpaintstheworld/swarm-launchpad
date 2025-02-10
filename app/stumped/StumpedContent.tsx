'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/shadcn/dialog'
import speechContent from './speech.md'

export default function StumpedContent() {
  const [speech, setSpeech] = useState<string>('')
  const [showIntro, setShowIntro] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const analyzerRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>()

  const drawVolume = useCallback(() => {
    if (!canvasRef.current || !analyzerRef.current) return
    
    const analyzer = analyzerRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dataArray = new Uint8Array(analyzer.frequencyBinCount)
    analyzer.getByteTimeDomainData(dataArray)
    
    // Calculate volume
    let sum = 0
    for (let i = 0; i < dataArray.length; i++) {
      sum += Math.abs(dataArray[i] - 128)
    }
    const volume = sum / dataArray.length
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw volume bar
    const barHeight = (volume / 128) * canvas.height
    ctx.fillStyle = '#22c55e' // green-500
    ctx.fillRect(0, canvas.height - barHeight, canvas.width, barHeight)
    
    animationFrameRef.current = requestAnimationFrame(drawVolume)
  }, [])

  useEffect(() => {
    setSpeech(speechContent)
  }, [])

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      setIsListening(true)
      toast('Microphone connected!')
      
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyzer = audioContext.createAnalyser()
      analyzer.fftSize = 256
      source.connect(analyzer)
      analyzerRef.current = analyzer
      
      drawVolume()
      
    } catch (error) {
      toast('Error accessing microphone')
      console.error(error)
    }
  }

  const stopListening = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop())
      setIsListening(false)
      toast('Microphone disconnected')
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }

  const readSpeech = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(speech)
      window.speechSynthesis.speak(utterance)
      toast('Reading speech...')
    } else {
      toast('Speech synthesis not supported in this browser')
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <Dialog open={showIntro} onOpenChange={setShowIntro}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to Toast Speech!</DialogTitle>
            <DialogDescription className="pt-2">
              This is a fun tool that lets you type or paste any text and have it read aloud using your browser&apos;s speech synthesis.
              Try editing the text on the left and click &quot;Read Speech&quot; to hear it!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button 
              variant="destructive" 
              onClick={() => setShowIntro(false)}
            >
              I&apos;m ready to get STUMPED
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="flex flex-1">
        {/* Left side - Speech */}
        <div className="w-1/2 p-8 bg-background border-r">
          {/* Microphone Section */}
          <div className="mb-6 p-4 border rounded-lg bg-card">
            <h3 className="text-lg font-medium mb-2">Microphone Input</h3>
            <div className="flex items-center gap-4">
              <Button 
                onClick={isListening ? stopListening : startListening}
                variant={isListening ? "destructive" : "default"}
              >
                {isListening ? 'Disconnect Mic' : 'Connect Mic'}
              </Button>
              {isListening && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-muted-foreground">Microphone Active</span>
                  </div>
                  <canvas 
                    ref={canvasRef}
                    width={100}
                    height={30}
                    className="border rounded"
                  />
                </div>
              )}
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">Toast Speech</h2>
          <textarea
            value={speech}
            onChange={(e) => setSpeech(e.target.value)}
            className="w-full h-[calc(100vh-300px)] p-4 rounded-md border bg-card"
          />
          <Button 
            onClick={readSpeech}
            className="mt-4"
          >
            Read Speech
          </Button>
        </div>

        {/* Right side - Video */}
        <div className="w-1/2 bg-muted flex items-center justify-center">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/stumped/loop.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-sm text-muted-foreground bg-background/80 backdrop-blur-sm">
        Built by XForge
      </div>
    </div>
  )
}
