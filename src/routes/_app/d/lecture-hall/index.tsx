import { createFileRoute } from '@tanstack/react-router'

function DLectureHallComponent() {
  return (
    <div>
      <h1>Desktop Lecture Hall</h1>
      <p>Welcome to the lecture hall! This is where you can access all your lectures.</p>
    </div>
  )
}

export const Route = createFileRoute('/_app/d/lecture-hall/')({
  component: DLectureHallComponent
})