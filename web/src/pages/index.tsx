import React, { useState } from 'react'
import Image from 'next/image'
import { api } from '../lib/axios'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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

  async function handleCreatePool (ev: React.FormEvent) {
    ev.preventDefault()

    try {
      const response = await api.post<CreatePoolResponse>('/pools', {
        title: poolTitle
      })
      const { pool } = response.data

      await navigator.clipboard.writeText(pool)

      toast.success('Pool code copyied to your clipboard, thanks!', { theme: 'colored' })

      setpoolTitle('')
    } catch (err) {
      toast.error('Sorry, could not create your pool. Please try again later!', { theme: 'colored' })
    }
  }

  function handleChange (ev: React.ChangeEvent<HTMLInputElement>) {
    setpoolTitle(ev.target.value)
  }

  return (
    <div className='flex h-screen items-center justify-center max-w-[1124px] mx-auto gap-28'>
      <main className='flex flex-col gap-10 flex-1'>
        <Image src={logoImage} alt='Logo NLW Copa' className='mb-5 hover:animate-pulse'/>
        <h1 className='text-white text-5xl leading-tight font-bold'>Create your own sweepstake of the 2022 World Cup and share with your friends</h1>

        <div className='flex text-white items-center gap-2 font-bold'>
          <Image src={usersAvatarImage} alt='Users profile icon' />
          <p className='text-xl'><strong className='text-greenPrimary'>+{userCount}</strong> people are already using</p>
        </div>

        <div className='flex gap-4 flex-col'>
          <form action="#" className='flex gap-2 w-full' onSubmit={handleCreatePool}>
            <input
              type="text"
              className='flex-1 bg-[#202024] rounded py-4 px-6 border-[#323238] border-solid border text-[#C4C4CC] text-base'
              required
              placeholder="What's the sweepstake name?"
              value={poolTitle}
              onChange={handleChange}
            />
            <button
              className='bg-yellowPrimary rounded py-4 px-6 text-[#09090A] text-sm font-bold inline-flex items-center hover:scale-105 transition-all'
            >CREATE ONE
            </button>
          </form>
          <small className='text-[#8D8D99] max-w-[80%] inline-block leading-6 text-sm'>After you create your sweepstake, you will receive a unique code that you can send to all of your friends 🚀</small>
        </div>

        <hr className='border-[#323238]'/>

        <div className='flex'>
          <div className='flex-1 flex items-center gap-6 justify-start border-r-[#323238] border-solid border-r'>
            <Image src={iconCheckImage} alt='Check icon' />
            <p className='text-[#E1E1E6]'><strong className='text-2xl'>+{poolCount}</strong><br />Created sweepstakes</p>
          </div>
          <div className='flex-1 flex items-center gap-6 justify-end'>
            <Image src={iconCheckImage} alt='Check icon' />
            <p className='text-[#E1E1E6]'><strong className='text-2xl'>+{guessCount}</strong><br />Shared guesses</p>
          </div>
        </div>

      </main>
      <aside className='flex-1'>
        <Image src={appPreviewImage} alt="App previewed on a phone" quality={100}/>
      </aside>
      <ToastContainer />
    </div>
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
