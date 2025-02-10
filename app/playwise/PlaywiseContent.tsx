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
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-2">PlayWise Demo</h1>
        <p className="text-muted-foreground">
          Experience how PlayWise adapts its teaching style based on age and context
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Animated Answer Display */}
        <Card className={cn(
          "p-6 transition-all duration-300",
          animatedText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <p className="text-xl font-medium leading-relaxed min-h-[80px]">
            {animatedText}
          </p>
        </Card>

        {/* Controls Group */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Age Selection */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">1. Select Child's Age</h2>
              <div className="px-4">
                <Slider
                  defaultValue={[age]}
                  max={8}
                  min={4}
                  step={1}
                  onValueChange={handleAgeChange}
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>4 years</span>
                  <span>8 years</span>
                </div>
              </div>
            </Card>

            {/* Topic Selection */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">2. Choose a Topic</h2>
              <div className="flex gap-4">
                {topics.map(topic => (
                  <Button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={cn(
                      "flex-1",
                      selectedTopic === topic.id && topic.color
                    )}
                  >
                    <span>{topic.icon}</span>
                    {topic.name}
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Mode Selection */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">3. Select Learning Mode</h2>
              <div className="flex gap-4">
                {modes.map(mode => (
                  <Button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={cn(
                      "flex-1",
                      selectedMode === mode.id && mode.color
                    )}
                  >
                    <span>{mode.icon}</span>
                    {mode.name}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Sample Questions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">4. Try Sample Questions</h2>
              <div className="grid gap-4">
                {Object.entries(responses.questions).map(([key, question]) => (
                  <Button
                    key={key}
                    variant="secondary"
                    className="justify-start text-left"
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
