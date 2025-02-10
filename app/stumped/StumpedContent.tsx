'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/shadcn/button'
import speechContent from './speech.md'

export default function StumpedContent() {
  const [speech, setSpeech] = useState<string>('')

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

      {/* Right side - Face */}
      <div className="w-1/2 p-8 bg-muted flex items-center justify-center">
        <div className="text-9xl">😊</div>
      </div>
    </>
  )
}
