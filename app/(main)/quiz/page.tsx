import { redirect } from 'next/navigation'
import { getQuizUser } from '@/app/action/profile'
import { QuizClient } from '@/app/(main)/quiz/_components/QuizClient'

export default async function QuizPage() {
  const user = await getQuizUser()

  if (!user || !user.id) {
    redirect('/login')
  }



  return (
    <QuizClient user={user} />
  )
}