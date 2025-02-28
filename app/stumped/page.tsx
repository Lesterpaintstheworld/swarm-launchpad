import StumpedContent from './StumpedContent'
import { Toaster } from 'sonner'

export default function StumpedPage() {
  return (
    <div className="min-h-screen flex">
      <StumpedContent />
      <Toaster />
    </div>
  )
}
