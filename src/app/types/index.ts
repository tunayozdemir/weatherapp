// useApiKey.ts hook'u için örnek tipler
export interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
}

// ApiKeyPrompt bileşeni için örnek tipler
export interface ApiKeyPromptProps {
  // Eğer bileşen için özel props varsa burada tanımlanabilir
}

// Global stil ve layout için örnek tipler
export interface LayoutProps {
  children: React.ReactNode;
}

// Diğer türler ve arayüzler
