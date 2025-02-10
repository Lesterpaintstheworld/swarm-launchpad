import PlaywiseContent from './PlaywiseContent'
import { Toaster } from 'sonner'

export default function PlaywisePage() {
  return (
    <div className="min-h-screen flex">
      <PlaywiseContent />
      <Toaster />
    </div>
  )
}
