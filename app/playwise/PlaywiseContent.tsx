'use client'

import { useState, useEffect } from 'react'
import responses from '@/data/playwise/responses.json'
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
  { id: 'math', name: 'Math', icon: '🔢', color: 'bg-blue-500/10 text-blue-500' },
  { id: 'science', name: 'Science', icon: '🔬', color: 'bg-green-500/10 text-green-500' },
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
    <div className="flex-1 p-8 bg-gradient-to-b from-background via-background to-accent-1/20">
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
          <Card className="p-4 rounded-2xl border-2 border-purple-500/20 flex-1">
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
          <Card className="p-4 rounded-2xl border-2 border-purple-500/20 flex-1">
            <h2 className="text-lg font-bold mb-4">Choose a Topic</h2>
            <div className="flex gap-2">
                {topics.map(topic => (
                  <Button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={cn(
                      "flex-1 text-sm py-2 rounded-xl",
                      "transition-all duration-300 hover:scale-105",
                      selectedTopic === topic.id && topic.color
                    )}
                  >
                    <span>{topic.icon}</span>
                    {topic.name}
                  </Button>
                ))}
              </div>
            </Card>
          </Card>

          {/* Mode Selection */}
          <Card className="p-4 rounded-2xl border-2 border-purple-500/20 flex-1">
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

          {/* Sample Questions */}
          <div className="flex gap-4 mb-6">
                {Object.entries(responses.questions).map(([key, question]) => (
                  <Button
                    key={key}
                    variant="secondary"
                    className={cn(
                      "flex-1 justify-start text-left p-4 text-lg rounded-xl",
                      "transition-all duration-300 hover:scale-102",
                      "border-2 border-purple-500/20 hover:border-purple-500/40",
                      isAnimating && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={isAnimating}
                    onClick={() => {
                      const ageGroup = age >= 8 ? "8" : age >= 6 ? "6-7" : "4-5";
                      const response = question.responses[ageGroup][selectedMode];
                      animateText(response);
                    }}
                  >
                    {question.question}
                  </Button>
                ))}
          </div>

          {/* Animated Answer Display */}
          <Card className={cn(
            "p-8 transition-all duration-300",
            "border-2 border-purple-500/20 hover:border-purple-500/30",
            "rounded-2xl shadow-lg",
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
