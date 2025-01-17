import { auth } from '@/lib/auth';

export default async function TestPage() {
  const session = await auth()
  // console.log(session?.user);
  return (
    <>
      test
    </>
  )
}