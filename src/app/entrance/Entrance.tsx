'use client'

import axios from 'axios'
import * as Form from '@radix-ui/react-form'
import useApiKey from '../hooks/useApiKey'
import React, { useState, useEffect } from 'react'
import { notification } from 'antd'
import { Loading } from '../components'
import { useRouter } from 'next/navigation'
import { configMessages } from '../utils'
import { Button, Input } from '@headlessui/react'
import { useGeolocation } from '../hooks/useGeolocation'

const Entrance: React.FC = () => {
  const router = useRouter()
  const { apiKey, setApiKey } = useApiKey()
  const [loading, setLoading] = useState(false)
  const { location, isFetching, error } = useGeolocation()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const apiKey = formData.get('apiKey') as string

    if (!location) {
      notification.error({
        message: configMessages.notification_error_message,
        description: configMessages.invalid_Borowser_Location_Not_Support,
      })
      setLoading(false)
      return;
    }

    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: 'Turkey',
          appid: apiKey,
          lang: 'tr',
        },
      })

      if (response.status === 200) {
        sessionStorage.setItem('apiKey', apiKey)
        setApiKey(apiKey)
        notification.success({
          message: configMessages.notification_success_message,
          description: configMessages.notification_success_description,
        })
        router.push('/dashboard')
      }
    } catch {
      router.push('/')
      notification.error({
        message: configMessages.notification_error_message,
        description: configMessages.invalid_ApiKey,
      })
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!apiKey) {
        router.push('/')
      }
      else {
        if (isFetching) {
          setLoading(false)
        }

        if (error) {
          setLoading(false)
          notification.error({
            message: configMessages.notification_error_message,
            description: error,
          })
        }
      }
    }

  }, [apiKey, isFetching, error, router])


  if (loading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 transition-all duration-1000">
      <div className="bg-white bg-opacity-40 p-8 rounded-lg shadow-lg max-w-lg w-full transition-transform transform hover:scale-105">
        <h1 className="text-3xl text-center text-gray-900 mb-6">{configMessages.title_apikey}</h1>
        <Form.Root
          className="w-full"
          onSubmit={handleSubmit}
        >
          <Form.Field name="apiKey">
            <Form.Control asChild>
              <Input
                type="text"
                required
                placeholder="API Key"
                className="p-4 w-full rounded-md bg-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
              />
            </Form.Control>
            <Form.Message className="text-red-600 mt-4" match="valueMissing">
              {configMessages.invalid_ApiKey}
            </Form.Message>
          </Form.Field>
          <Form.Submit asChild>
            <Button className="rounded w-full bg-sky-600 py-2 px-4 text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700 mt-4">
              {configMessages.text_confirm}
            </Button>
          </Form.Submit>
        </Form.Root>
      </div>
    </div>
  )
}

export default Entrance
