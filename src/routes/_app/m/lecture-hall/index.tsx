import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/m/lecture-hall/')({
  component: MLectureHallComponent,
})

function MLectureHallComponent() {
  return <div>Hello "/_app/m/lectureHall/"!</div>
}
