import { StaticImageData } from 'next/image';

export interface ImageComponentProps {
  src: StaticImageData;
  alt?: string | undefined | any;
  className?: string;
  loading?: boolean
}