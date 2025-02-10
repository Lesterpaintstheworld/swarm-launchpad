'use client'

import { useState } from 'react'
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
      <div className="max-w-4xl mx-auto grid gap-6">
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
            <Button 
              variant="secondary"
              className="justify-start text-left"
              onClick={() => toast('Coming soon: AI responses adapted to age and mode!')}
            >
              Why is the sky blue? 🌤️
            </Button>
            <Button
              variant="secondary" 
              className="justify-start text-left"
              onClick={() => toast('Coming soon: AI responses adapted to age and mode!')}
            >
              How do plants grow? 🌱
            </Button>
            <Button
              variant="secondary"
              className="justify-start text-left"
              onClick={() => toast('Coming soon: AI responses adapted to age and mode!')}
            >
              What makes rainbows? 🌈
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
