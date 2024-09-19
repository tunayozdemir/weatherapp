export interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
}

export interface ApiKeyPromptProps {
  // Eğer bileşen için özel props varsa burada tanımlanabilir
}
