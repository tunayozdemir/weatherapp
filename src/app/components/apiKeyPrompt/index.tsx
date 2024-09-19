'use client'
import React, { useState, useEffect } from 'react'
import useApiKey from '../../hooks/useApiKey'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { ApiKeyPromptProps } from '../../types/apiKey'
import { Button, Input, Form, message, Spin } from 'antd'

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = () => {
  const router = useRouter()
  const { apiKey, setApiKey } = useApiKey();
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [isFetchingLocation, setIsFetchingLocation] = useState(true)

  const validateMessages = { required: 'Lütfen API Key giriniz' }

  useEffect(() => {
    if (apiKey) {
      router.push('/dashboard');
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setIsFetchingLocation(false);
        },
        (error) => {
          message.error(`Konum alınamadı, lütfen izin verin. Detay: ${error.message}`);
          setIsFetchingLocation(false);
        }
      );
    } else {
      setIsFetchingLocation(false);
    }
  }, []);

  const handleSubmit = async (values: { apiKey: string }) => {
    setLoading(true)
    const { apiKey } = values;

    if (!location) {
      form.setFields([
        {
          name: 'apiKey',
          errors: ['Konum bilgisi alınamadı. Lütfen konum bilgisine izin veriniz.'],
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: 'Turkey',
          // lat: location.latitude,
          // lon: location.longitude,
          appid: apiKey,
          // units: 'metric',
          lang: 'tr',
        },
      });

      if (response.status === 200) {
        sessionStorage.setItem('apiKey', apiKey);
        setApiKey(apiKey);
        message.success('API Key başarıyla kaydedildi.');
        router.push('/dashboard');
      }
      console.log('response :', response);
    } catch (error) {
      form.setFields([
        {
          name: 'apiKey',
          errors: ['Geçersiz API Key. Lütfen doğru API Key girin.'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (isFetchingLocation || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" tip="Yükleniyor..." />
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-4">
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="inline"
        validateMessages={validateMessages}
      >
        <Form.Item className="w-auto" name="apiKey" rules={[{ required: true }]}>
          <Input placeholder="API Key" />
        </Form.Item>
        <Form.Item className="w-auto">
          <Button type="primary" htmlType="submit">Tamam</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ApiKeyPrompt;
