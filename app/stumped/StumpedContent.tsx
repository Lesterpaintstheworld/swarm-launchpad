'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/shadcn/button'

export default function StumpedContent() {
  const [speech, setSpeech] = useState<string>(`
    Distinguished colleagues and valued friends...

    Standing before you today is not easy. As your leader, I must acknowledge some difficult truths. Our Q4 numbers fell short of projections by 32% - a shortfall that can be traced directly to decisions I made in June. I overestimated our market readiness and underestimated our competitors' agility.

    More painfully, I must address the recent departures of several key team members. While it would be comfortable to attribute this to industry-wide turnover, the exit interviews tell a different story. My management style, which I've long defended as "demanding excellence," has been described as rigid and uninspiring. This feedback has been... particularly hard to accept.

    The failed Shanghai expansion, which cost us $3.2 million, was my initiative. I pushed it through despite the concerns raised by our regional experts. Their warnings about local market conditions proved accurate, and my stubborn optimism proved expensive.

    Looking at the faces in this room - some skeptical, some supportive, some perhaps disappointed - I'm reminded of the trust you've placed in me. Trust that, in some cases, I've strained or broken.

    However, acknowledging these failures is only the first step. I've initiated executive coaching sessions, and I'm learning to listen more than I speak. We're restructuring our decision-making process to be more collaborative, and I'm committed to rebuilding the trust I've damaged.

    The path forward will be challenging. It requires not just strategic changes, but personal ones. I stand before you not just as your CEO, but as someone who must grow to deserve that position.

    Thank you for your patience as we navigate this difficult but necessary transformation. I'm ready to take your questions, even the uncomfortable ones.
  `)

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
