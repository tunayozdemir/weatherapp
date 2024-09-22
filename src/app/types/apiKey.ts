export default interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
}