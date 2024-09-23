import { StaticImageData } from 'next/image';

export interface ImageComponentProps {
  src: StaticImageData | string;
  alt?: string;
  className?: string;
  loading?: boolean
}