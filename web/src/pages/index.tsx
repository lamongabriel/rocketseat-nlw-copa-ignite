import React, { useState } from 'react'
import Image from 'next/image'
import { api } from '../lib/axios'

import ReactModal from 'react-modal'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Copy } from 'phosphor-react'

import appPreviewImage from '../assets/app-preview.png'
import logoImage from '../assets/logo.svg'
import usersAvatarImage from '../assets/users.png'
import iconCheckImage from '../assets/icon-check.svg'

interface CountResponse {
  count: number
}

interface CreatePoolResponse {
  pool: string
}

interface HomeProps {
  poolCount: number
  guessCount: number
  userCount: number
}

export default function Home ({ poolCount, guessCount, userCount }: HomeProps) {
  const [poolTitle, setpoolTitle] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [poolCode, setPoolCode] = useState('')

  async function handleCreatePool (ev: React.FormEvent) {
    ev.preventDefault()

    try {
      const response = await api.post<CreatePoolResponse>('/pools', {
        title: poolTitle
      })
      const { pool } = response.data
      setPoolCode(pool)

      setModalIsOpen(true)

      setpoolTitle('')
    } catch (err) {
      toast.error('Sorry, could not create your pool. Please try again later!', { theme: 'colored' })
    }
  }

  function handleChange (ev: React.ChangeEvent<HTMLInputElement>) {
    setpoolTitle(ev.target.value)
  }

  async function handleCopyCode (ev: React.MouseEvent<HTMLElement>) {
    try {
      await navigator.clipboard.writeText(poolCode)
      toast.success('Code copyied to your clipboard!', { theme: 'colored' })
    } catch (error) {
      toast.error('Sorry, could not copy to your clipboard.', { theme: 'colored' })
    }
  }

  return (
    <>
      <div className='flex h-screen items-center justify-center max-w-[1120px] mx-auto gap-28 desktopSmall:max-w-[900px] desktopSmall:gap-10 tablet:flex-col tablet:max-w-full px-5 tablet:h-full py-10'>
        <main className='flex flex-col gap-10 flex-1 tablet:order-2'>
          <Image src={logoImage} alt='Logo NLW Copa' className='mb-5 hover:animate-pulse'/>
          <h1 className='text-white text-5xl leading-tight font-bold phone:text-4xl'>Create your own sweepstake of the 2022 World Cup and share with your friends</h1>

          <div className='flex text-white items-center gap-2 font-bold'>
            <Image src={usersAvatarImage} alt='Users profile icon' />
            <p className='text-xl'><strong className='text-greenPrimary'>+{userCount}</strong> people are already using</p>
          </div>

          <div className='flex gap-4 flex-col'>
            <form action="#" className='flex gap-2 w-full smallPhone:flex-col' onSubmit={handleCreatePool}>
              <input
                type="text"
                className='flex-1 bg-[#202024] rounded py-4 px-6 border-[#323238] border-solid border text-[#C4C4CC] text-base'
                required
                placeholder="What's the sweepstake name?"
                value={poolTitle}
                onChange={handleChange}
              />
              <button
                className='bg-yellowPrimary justify-center rounded py-4 px-6 text-[#09090A] text-sm font-bold inline-flex items-center hover:scale-105 transition-all'
              >CREATE ONE
              </button>
            </form>
            <small className='text-[#8D8D99] max-w-[80%] inline-block leading-6 text-sm tablet:max-w-full'>After you create your sweepstake, you will receive a unique code that you can send to all of your friends 🚀</small>
          </div>

          <hr className='border-[#323238]'/>

          <div className='flex smallPhone:flex-col smallPhone:gap-4'>
            <div className='flex-1 flex items-center gap-6 justify-start border-r-[#323238] border-solid border-r smallPhone:justify-start smallPhone:border-none'>
              <Image src={iconCheckImage} alt='Check icon' />
              <p className='text-[#E1E1E6]'><strong className='text-2xl'>+{poolCount}</strong><br />Created sweepstakes</p>
            </div>
            <div className='flex-1 flex items-center gap-6 justify-end smallPhone:justify-start'>
              <Image src={iconCheckImage} alt='Check icon' />
              <p className='text-[#E1E1E6]'><strong className='text-2xl'>+{guessCount}</strong><br />Shared guesses</p>
            </div>
          </div>

        </main>
        <aside className='flex-1 tablet:order-1 tablet:flex-none'>
          <Image src={appPreviewImage} alt="App previewed on a phone" quality={100}/>
        </aside>
      </div>
      <ToastContainer />
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          },
          content: {
            background: '#121214',
            maxWidth: '600px',
            position: 'relative',
            border: 'solid 1px #323238',
            inset: 0,
            borderRadius: '4px'
          }
        }}
      >
        <h2 className='text-white text-5xl leading-tight font-bold'>Sweepstake created!</h2>
        <small className='text-[#8D8D99] inline-block leading-6 text-sm'>Now go and share this code with all of your friends so they can join too. ✨ <br/> You will need our app 📱 to join, you can find it in Google Playstore and Apple App Store, go ahead and <span className='text-greenPrimary'>download it!</span></small>
        <div className='flex mt-6 gap-2'>
          <strong
            className='flex-1 bg-[#202024] text-center rounded py-4 px-6 border-yellowPrimary border-dashed border-4 text-white text-xl cursor-pointer'
          >
            {poolCode}
          </strong>
          <button className='bg-greenPrimary rounded w-14 flex justify-center items-center' onClick={handleCopyCode}>
            <Copy size={32} color='#fff'/>
          </button>
        </div>
      </ReactModal>
    </>
  )
}

export async function getServerSideProps () {
  try {
    const [poolCountResponse, guessCountResponse, userCountResponse] = await Promise.all([
      api.get<CountResponse>('pools/count'),
      api.get<CountResponse>('guesses/count'),
      api.get<CountResponse>('users/count')
    ])

    return {
      props: {
        poolCount: poolCountResponse.data.count,
        guessCount: guessCountResponse.data.count,
        userCount: userCountResponse.data.count
      }
    }
  } catch (err) {
    return {
      props: {
        poolCount: 0,
        guessCount: 0,
        userCount: 0
      }
    }
  }
}
