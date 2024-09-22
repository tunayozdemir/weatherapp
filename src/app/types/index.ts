export interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
}

export interface LayoutProps {
  children: React.ReactNode;
}

