
import { configMessages } from "../../utils";

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-900 bg-opacity-90">
      <div className="flex flex-col items-center">
        <div className="animate-spin mb-4 w-16 h-16 border-8 border-blue-600 border-t-transparent rounded-full"></div>
        <p className="text-white text-xl opacity-75">{configMessages.text_loading}</p>
      </div>
    </div>
  )
}

export default LoadingScreen;
