'use client';

import React, { useState, useEffect } from 'react';
import useApiKey from '../../hooks/useApiKey';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ApiKeyPromptProps } from '../../types/apiKey';
import { Button, Input, Form, notification } from 'antd';
import { Loading } from '../../components';

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = () => {
  const router = useRouter();
  const { apiKey, setApiKey } = useApiKey();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(true);

  const validateMessages = { required: 'Lütfen API Key giriniz' };

  useEffect(() => {

    notification.config({
      placement: 'topRight',
      bottom: 50,
      duration: 5,
    });

    if (apiKey) {
      router.push('/dashboard')
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude })
          setIsFetchingLocation(false);
        },
        (error) => {
          setIsFetchingLocation(false);
          notification.error({
            type: 'error',
            message: 'Hata',
            description: `Konum alınamadı, lütfen izin verin. Detay: ${error.message}`,
          });
        }
      );
    } else {
      setIsFetchingLocation(false);
    }
  }, []);

  const handleSubmit = async (values: { apiKey: string }) => {
    setLoading(true)
    const { apiKey } = values

    if (!location) {
      form.setFields([
        {
          name: 'apiKey',
          errors: ['Konum bilgisi alınamadı. Lütfen konum bilgisine izin veriniz.'],
        },
      ])
      notification.error({
        type: 'error',
        message: 'Hata',
        description: `Konum bilgisi alınamadı. Lütfen konum bilgisine izin veriniz.`,
      });
      setLoading(false)
      return
    }

    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: 'Turkey',
          appid: apiKey,
          lang: 'tr',
        },
      });

      if (response.status === 200) {
        sessionStorage.setItem('apiKey', apiKey);
        setApiKey(apiKey)
        notification.success({
          message: 'API Key Doğru',
          description: `API Key başarıyla kaydedildi.`,
        })
        router.push('/dashboard')
      }
    } catch (error) {
      form.setFields([
        {
          name: 'apiKey',
          errors: ['Geçersiz API Key. Lütfen doğru API Key girin.'],
        },
      ])
      notification.error({
        message: 'Hata',
        description: `Geçersiz API Key. Lütfen doğru API Key girin.`,
      })
    } finally {
      setLoading(false)
    }
  };

  if (isFetchingLocation || loading) {
    return <Loading />
  }

  return (
<div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 transition-all duration-1000">
  <div className="bg-white bg-opacity-40 p-8 rounded-lg shadow-lg max-w-lg w-full transition-transform transform hover:scale-105">
    <h1 className="text-3xl text-center text-gray-900 mb-6">API Key Giriniz</h1>
    <Form form={form} onFinish={handleSubmit} layout="vertical" validateMessages={validateMessages}>
      <Form.Item name="apiKey" rules={[{ required: true }]}>
        <Input
          placeholder="API Key"
          className="p-4 w-full rounded-md bg-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full p-3 bg-blue-500 hover:bg-blue-400 text-white rounded-md transition-all duration-300"
        >
          Tamam
        </Button>
      </Form.Item>
    </Form>
  </div>
</div>
  );
};

export default ApiKeyPrompt;
