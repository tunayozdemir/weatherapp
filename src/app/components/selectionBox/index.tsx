import { Select } from 'antd'
import { useEffect, useState } from 'react'
import { configMessages } from '../../utils'
import { LocationData } from '../../types/location'
import turkeyLocations from '../../data/turkeyLocations.json'

interface SelectionBoxProps {
  onSelectionChange: (selection: { city: string; district: string | undefined }) => void
  resetSelection: boolean | null
}

const locations: LocationData = turkeyLocations

const SelectionBox: React.FC<SelectionBoxProps> = ({ onSelectionChange, resetSelection }) => {
  const [cities, setCities] = useState<string[]>([])
  const [districts, setDistricts] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(undefined)

  useEffect(() => {
    setCities(Object.keys(locations))
  }, [])

  const handleCityChange = (value: string) => {
    setSelectedCity(value)
    setDistricts(locations[value])
    setSelectedDistrict(undefined)
    onSelectionChange({ city: value, district: undefined })
  }

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value)
    onSelectionChange({ city: selectedCity, district: value })
  }

  useEffect(() => {

    if (resetSelection === true) {
      setSelectedCity('')
      setSelectedDistrict(undefined)
      setDistricts([])
    }
  }, [resetSelection])

  return (
    <div className='relative block justify-between items-center max-w-[500px] w-full m-auto pt-4 text-white z-10'>
      <div>
        <div className='border-gray-300 text-white rounded-2xl cursor-pointer'>
          <Select
            variant="borderless"
            size='large'
            className='w-full border border-gray-300 text-white rounded-2xl m-auto z-20 transition-shadow duration-200 ease-in-out hover:shadow-lg'
            onChange={handleCityChange}
            options={cities.map(city => ({
              label: city,
              value: city,
            }))}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            placeholder={configMessages.text_placeholder_city[0]}
            value={selectedCity ? selectedCity : undefined}
            style={{ color: 'white' }}
            dropdownStyle={{ color: 'black' }}
          />
        </div>
      </div>

      {selectedCity && (
        <div className='border-gray-300 text-white rounded-2xl mt-4 cursor-pointer'>
          <Select
            variant="borderless"
            size='large'
            className='w-full border border-gray-300 text-white rounded-2xl m-auto z-20 transition-shadow duration-200 ease-in-out hover:shadow-lg'
            onChange={handleDistrictChange}
            options={districts.map(district => ({
              label: district,
              value: district,
            }))}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            placeholder={configMessages.text_placeholder_city[1]}
            value={selectedDistrict}
          />
        </div>
      )}
    </div>
  )
}

export default SelectionBox
