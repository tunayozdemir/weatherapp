
import { Fragment, useState } from 'react';
import { Select } from '@headlessui/react';
import clsx from 'clsx';

interface SelectionBoxProps {
  items?: { value: string; text: string }[]
  placeholder?: string;
  onChange?: (value: any) => void;
  value?: string;
}

const SelectBoxHeadless: React.FC<SelectionBoxProps> = ({
  items,
  placeholder = "Seçim Yapınız",
  onChange,
  value
}) => {

  const [selectedValue, setSelectedValue]=useState<any>()


  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const isValue = e.target.value;

    console.log('selectedValue :',selectedValue)
    if (onChange) {
      onChange(selectedValue);
      setSelectedValue(isValue)
    }
  };

  return (
    <div className='relative block bg-transparent justify-between items-center max-w-[500px] w-full m-auto pt-4 text-white z-10'>
    <Select as={Fragment}>
      {({ focus, hover }) => (
        <div className='relative'>
          <select
            onChange={handleChange}
            className={clsx(
              'border rounded-2xl flex items-center bg-transparent w-full m-auto text-white z-10 h-10 pl-3 pr-8 appearance-none cursor-pointer transition-all duration-200',
              focus && 'bg-blue-100',
              hover && 'shadow-lg',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent'
            )}
          >
           {placeholder}
            {items && items.map((item, index) => (
              <option key={index} value={item.value}>
                {item.text}
              </option>
            ))}
          </select>
          <span
            className={clsx(
              "absolute right-3 top-1/2 transform -translate-y-1/2 transition-transform duration-300",
            )}>
            <svg width="16" height="16" viewBox="0 0 10 10" fill="none">
              <path d="M2 4L5 7L8 4" stroke="white" strokeWidth="1" />
            </svg>
          </span>
        </div>
      )}
    </Select>
  </div>
  );
};

export default SelectBoxHeadless;
