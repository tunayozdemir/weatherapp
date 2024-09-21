import { StaticImageData } from 'next/image';

export interface ImageComponentProps {
  src: StaticImageData; 
  alt?: string; 
  className?: string;     
}