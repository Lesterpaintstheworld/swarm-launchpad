'use client'

import { useState, useEffect } from 'react'
import responses from '@/data/playwise/responses.json'
import type { Responses } from '@/types/playwise'
import { toast } from 'sonner'
import { Button } from '@/components/shadcn/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/shadcn/slider'
import { cn } from '@/lib/utils'

interface Topic {
  id: string
  name: string
  icon: string
  color: string
}

interface Mode {
  id: string
  name: string
  icon: string
  color: string
}

const topics: Topic[] = [
  { id: 'feelings', name: 'Feelings', icon: '🫂', color: 'bg-pink-500/10 text-pink-500' },
  { id: 'science', name: 'Science', icon: '🔬', color: 'bg-blue-500/10 text-blue-500' },
  { id: 'stories', name: 'Stories', icon: '📚', color: 'bg-purple-500/10 text-purple-500' }
]

const modes: Mode[] = [
  { id: 'playful', name: 'Playful', icon: '🎮', color: 'bg-yellow-500/10 text-yellow-500' },
  { id: 'learning', name: 'Learning', icon: '📝', color: 'bg-blue-500/10 text-blue-500' },
  { id: 'bedtime', name: 'Bedtime', icon: '🌙', color: 'bg-purple-500/10 text-purple-500' }
]

export default function PlaywiseContent() {
  const [age, setAge] = useState(5)
  const [selectedTopic, setSelectedTopic] = useState<string>('science')
  const [selectedMode, setSelectedMode] = useState<string>('playful')
  const [animatedText, setAnimatedText] = useState<string>('')
  const [isAnimating, setIsAnimating] = useState(false)

  const animateText = (text: string) => {
    setIsAnimating(true)
    setAnimatedText('')
    let index = 0
    
    const interval = setInterval(() => {
      setAnimatedText((current) => current + text[index])
      index++
      
      if (index === text.length) {
        clearInterval(interval)
        setIsAnimating(false)
      }
    }, 30)
  }

  const handleAgeChange = (value: number[]) => {
    setAge(value[0])
    toast(`Age set to ${value[0]} years`)
  }

  return (
    <div className="flex-1 p-8 bg-gradient-to-b from-background via-background/95 to-purple-900/10 animate-gradient-shift">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
          PlayWise Demo
        </h1>
        <p className="text-xl text-muted-foreground/80">
          Experience how PlayWise adapts its teaching style based on age and context
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Controls Group */}
        <div className="flex gap-4 mb-8">
          {/* Age Selection */}
          <Card className={cn(
            "p-4 rounded-2xl flex-1",
            "bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10",
            "border-2 border-purple-500/20 hover:border-purple-500/30",
            "transition-all duration-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]",
            "backdrop-blur-sm"
          )}>
            <h2 className="text-lg font-bold mb-4">Select Child's Age</h2>
            <div className="px-2">
              <Slider
                defaultValue={[age]}
                max={8}
                min={4}
                step={1}
                onValueChange={handleAgeChange}
                className="py-2"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>4 years</span>
                <span>8 years</span>
              </div>
            </div>
          </Card>

          {/* Topic Selection */}
          <Card className={cn(
            "p-4 rounded-2xl flex-1",
            "bg-gradient-to-br from-green-500/10 via-blue-500/5 to-purple-500/10",
            "border-2 border-purple-500/20 hover:border-purple-500/30",
            "transition-all duration-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]",
            "backdrop-blur-sm"
          )}>
            <h2 className="text-lg font-bold mb-4">Choose a Topic</h2>
            <div className="flex gap-2">
              {topics.map(topic => (
                <Button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={cn(
                    "flex-1 text-sm py-2 rounded-xl",
                    "transition-all duration-300",
                    "hover:scale-105 hover:shadow-lg",
                    "bg-gradient-to-r",
                    selectedTopic === topic.id ? [
                      topic.id === 'feelings' && "from-pink-500/20 to-pink-600/20 text-pink-400",
                      topic.id === 'science' && "from-blue-500/20 to-blue-600/20 text-blue-400",
                      topic.id === 'stories' && "from-purple-500/20 to-purple-600/20 text-purple-400",
                    ] : "hover:bg-white/5"
                  )}
                >
                  <span>{topic.icon}</span>
                  {topic.name}
                </Button>
              ))}
            </div>
          </Card>

          {/* Mode Selection */}
          <Card className={cn(
            "p-4 rounded-2xl flex-1",
            "bg-gradient-to-br from-yellow-500/10 via-purple-500/5 to-blue-500/10",
            "border-2 border-purple-500/20 hover:border-purple-500/30",
            "transition-all duration-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]",
            "backdrop-blur-sm"
          )}>
            <h2 className="text-lg font-bold mb-4">Learning Mode</h2>
            <div className="flex gap-2">
                {modes.map(mode => (
                  <Button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={cn(
                      "flex-1 text-sm py-2 rounded-xl",
                      "transition-all duration-300 hover:scale-105",
                      selectedMode === mode.id && mode.color
                    )}
                  >
                    <span>{mode.icon}</span>
                    {mode.name}
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Mode Illustration */}
          <div className="w-full aspect-[16/9] mb-6 rounded-xl overflow-hidden relative">
            <img 
              src={`/playwise/${selectedMode}.png`}
              alt={`${selectedMode} mode illustration`}
              className={cn(
                "w-full h-full object-cover",
                "transition-all duration-500",
                "rounded-xl",
                "border-2 border-purple-500/20"
              )}
            />
          </div>

          {/* Sample Questions */}
          <div className="flex gap-4 mb-6">
                {Object.entries(responses.questions)
                  .filter(([key, question]) => {
                    switch (selectedTopic) {
                      case 'feelings':
                        return ['feelings', 'friendship'].includes(key);
                      case 'science':
                        return ['sky', 'rainbow'].includes(key);
                      case 'stories':
                        return ['adventure_story', 'bored'].includes(key);
                      default:
                        return true;
                    }
                  })
                  .map(([key, question]) => (
                    <Button
                      key={key}
                      variant="secondary"
                      className={cn(
                        "flex-1 justify-start text-left p-4 text-lg rounded-xl",
                        "transition-all duration-300",
                        "bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20",
                        "border-2 border-purple-500/30",
                        "hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]",
                        "hover:scale-[1.02] hover:bg-gradient-to-r hover:from-purple-500/30 hover:via-blue-500/30 hover:to-purple-500/30",
                        "text-white/90",
                        "font-medium",
                        isAnimating && "opacity-50 cursor-not-allowed"
                      )}
                      disabled={isAnimating}
                      onClick={() => {
                        const ageGroup = age >= 8 ? "8" : age >= 6 ? "6-7" : "4-5";
                        const responses = question.responses[ageGroup as AgeGroup];
                        const response = responses[selectedMode as Mode];
                        animateText(response);
                      }}
                    >
                      <span>{question.question}</span>
                    </Button>
                  ))}
          </div>

          {/* Animated Answer Display */}
          <Card className={cn(
            "p-8 transition-all duration-500",
            "bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-purple-500/10",
            "border-2 border-purple-500/20 hover:border-purple-500/30",
            "rounded-2xl shadow-lg backdrop-blur-sm",
            "hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
            animatedText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <p className="text-2xl font-medium leading-relaxed min-h-[100px]">
              {animatedText}
            </p>
          </Card>
      </div>
    </div>
  )
}
