import router from 'next/router';
import PrimaryLogo from '../../../public/assets/svg/primary-logo';
import { BACK_HOME, THANK_YOU, WAIT_ORDER } from '@/constants/texts';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';

export default function OrderSuccess() {
  return (
    <>
      <div className="mobile:hidden fixed top-0 left-0 shadow-sm w-full p-4">
        <PrimaryLogo width={120} height={40} primaryColor="var(--brand-color)" />
      </div>
      <div className="min-h-screen flex flex-col justify-between md:justify-center p-4 md:p-8">
        <div className="w-full max-w-md mx-auto mobile:!mt-auto mobile:!mb-auto mobile:pb-[50px]">
          <div className="text-center">
            <div className=" flex justify-center">
              <div className="inline-block rounded-full  p-3">
                <div className="rounded-full  p-4 dark:bg-white">
                  <Image
                    src={IMAGES.ORDER_SUCCESS}
                    alt="success-icon"
                    width={224}
                    height={224}
                    className="mix-blend-multiply"
                  />
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2 dark:text-white lg:mt-4">{THANK_YOU}</h1>
            <p className="text-gray-600 mb-8">{WAIT_ORDER}</p>
            <div className="hidden md:block" >
              <button onClick={() => router.push('/')} className="w-full bg-brand-color  text-white font-bold py-3 px-4 rounded">{BACK_HOME}</button>
            </div>
          </div>
        </div>
        <div className="w-full md:hidden">
          <button
            className="bg-brand-color  text-white font-bold py-3 px-4 rounded fixed bottom-4 left-4 right-4"
            onClick={() => (window.location.href = '/')}
          >
            {BACK_HOME}
          </button>
        </div>
      </div>
    </>
  );
}
