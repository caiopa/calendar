import App from '@/components/app';
import { Suspense } from 'react';
import Loading from './loading';


export default async function Home() {
 

  return (
    <main className="h-screen m-auto">
        <div className='bg-gray-400'>
          <div className='w-[75%] m-auto h-screen flex flex-col justify-center'>
           <Suspense fallback={<Loading />}>
             <App view="month" />
           </Suspense>
          </div>
        </div>
    </main>
  );
}
