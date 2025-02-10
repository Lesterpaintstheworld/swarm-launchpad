'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/shadcn/dialog'
import speechContent from './speech.md'

export default function StumpedContent() {
  const [speech, setSpeech] = useState<string>('')
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    setSpeech(speechContent)
  }, [])

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
    <>
      <Dialog open={showIntro} onOpenChange={setShowIntro}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to Toast Speech!</DialogTitle>
            <DialogDescription className="pt-2">
              This is a fun tool that lets you type or paste any text and have it read aloud using your browser&apos;s speech synthesis.
              Try editing the text on the left and click &quot;Read Speech&quot; to hear it!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* Left side - Speech */}
      <div className="w-1/2 p-8 bg-background border-r">
        <h2 className="text-2xl font-bold mb-4">Toast Speech</h2>
        <textarea
          value={speech}
          onChange={(e) => setSpeech(e.target.value)}
          className="w-full h-[calc(100vh-200px)] p-4 rounded-md border bg-card"
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
    </>
  )
}
