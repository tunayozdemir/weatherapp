import Image from 'next/image'
import { Loading } from '../../components'
import { ImageComponentProps } from '../../types/bg'

const Bg: React.FC<ImageComponentProps> = ({ src, alt, className, loading }) => {
  return (
    <>
      {
        !loading ?
          <div>
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/40 z-[1]" />
            <Image src={src} layout="fill" alt={alt} className={className || 'object-cover'} />
          </div> :
          <Loading />
      }
    </>
  )
}


export default Bg