import FormInput from '@/components/form/form-input';
import PhoneNumberInput from '@/components/form/phone-number-input';
import LableWithTextArea from '@/components/ui/lable-with-text-area';
// import InputWithLable from '@/components/Ui/InputWithLable';
// import SelectWithLable from '@/components/Ui/SelectWithLable';
import SelectedLocation from '@/components/ui/selected-location';
import React, { ChangeEvent, FC, useMemo } from 'react';
import OfficeIcon from '../../../../public/assets/svg/office-icon';
import HouseIcon from '../../../../public/assets/svg/house-icon';
import RadioWidthLable from '@/components/ui/radio-width-lable';
import { useTheme } from '@/hooks/theme';
import { ErrorStateType,  } from '@/pages/profile/address';
import Select, { MultiValue, StylesConfig }  from 'react-select';
import { UserInfoType } from '@/store/types/profile-type';
// import { MultiValue } from 'react-select';


type Props={
  formData:UserInfoType,
  changeFormData:(_e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void,
  onPhoneChange:(_value: string, _data: { dialCode: string, name: string })=>void,
  errorState: ErrorStateType,
  showEditSection?:boolean,
  setErrorState:React.Dispatch<React.SetStateAction<ErrorStateType>>,
  setFormData:React.Dispatch<React.SetStateAction<UserInfoType>>,
}
interface AddressNote {
  value: string;
  label: string;
}

const AddressDetails: FC<Props> = ({formData,changeFormData,onPhoneChange,errorState, setErrorState,
  setFormData}) => {
  const {theme} = useTheme();
  const options = [
    { value: '6617b83aa86bb50e82fda3ca', label: 'Forklift/Crane Available' },
    { value: '6617b832a86bb50e82fda3c9', label: 'Limited Access' },
    { value: '6617b842a86bb50e82fda3cb', label: 'Call First' },
    { value: '6617b84aa86bb50e82fda3cc', label: 'Loading Dock' },
    { value: '6617b852a86bb50e82fda3cd', label: 'Drop with Security' },
  ];

  const preselectedOptions = useMemo(() => {
    return options.filter(option => 
      formData.addressNotesAttributes.includes(option.value)
    );
  }, [formData.addressNotesAttributes]);
  
  const multiSelectChangeHandler = (newValue: MultiValue<AddressNote>) => { 
    const selectedItems = newValue.map(item => item.value);
    setFormData((prevState) => ({ ...prevState, addressNotesAttributes: selectedItems}));
    setErrorState((prevState) => ({ ...prevState, addressNotesAttributes: (selectedItems.length == 0)}));
  };

  const customStyles: StylesConfig<AddressNote, true> = {
    control: (provided) => ({
      ...provided,
      width: '100%',
      outline: 'none',
      minHeight: '44px',
      border: theme ? '1px solid #3d3b45' : '1px solid #dbdbdb',
      borderRadius: '0.375rem',
      backgroundColor: theme ? '#1A1A1A' : '#FFF',
      fontSize:'14px',
      color: theme ? '#e2e8f0' : '#000',
      fontWeight:'400',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? (theme ? '#2d3748' : '#f0f0f0') : '',
      color: state.isFocused ? (theme ? '#e2e8f0' : '#202020') : '',
      fontSize:'14px',
      fontWeight:'400',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: theme ? '#1a202c' : '#fff',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#000',  // Set the color of the close icon here
    }),
  };

  return (
    <section className="w-full mt-3 sm:mt-0 leading-[21px] md:leading-[24px] text-text-primary-light  dark:text-text-primary-dark ">
      <SelectedLocation formData={formData}/>
      <LableWithTextArea labelClassName='font-[600]' error={ errorState.addressLine1 ? 'Address is missing' : ''} changeEvent={(e) => changeFormData(e)} value={formData.addressLine1} required={true} label={'Address'} name="addressLine1" />

      <form className='w-full lg:grid lg:grid-cols-2 gap-4'>
        <FormInput labelClassName = 'font-[600]' error={errorState.country ? 'Country Name is missing' :''} onChange={(e) => changeFormData(e)} value={formData.country} required label={'Country'} type="text" name="country" className="h-[45px] px-[12px]" />
        <FormInput labelClassName = 'font-[600]' error={errorState.state ? 'State Name is missing' :''} onChange={(e) => changeFormData(e)} value={formData.state} required label={'State'} type="text" name="state" className="h-[45px] px-[12px]" />
        <FormInput labelClassName = 'font-[600]' error={errorState.city ? 'City Name is missing' :''} onChange={(e) => changeFormData(e)} value={formData.city} required label={'City'} type="text" name="city" className="h-[45px] px-[12px]" />
        <FormInput labelClassName = 'font-[600]' error={errorState.aptNo ? 'Hose No Name is missing':''} onChange={(e) => changeFormData(e)} value={formData.aptNo} required label={'House no / Flat no / Building no'} type="number" name="aptNo" className="h-[45px] px-[12px]" />
        <FormInput labelClassName = 'font-[600]' error={errorState.name ? 'Name is missing' : ''} onChange={(e) => changeFormData(e)} value={formData.name} required label={'Name'} type="text" name="name" className="h-[45px] px-[12px]" />

        <PhoneNumberInput labelClassName = 'font-[600]' error={ errorState.phoneNumber ? 'Phone Number is not valid': ''} country={formData.countryShortForm} required={true} number={formData.countryCode + formData.phoneNumber} label="Phone Number" onChange={onPhoneChange} />

        <LableWithTextArea value={formData.note} changeEvent={(e) => changeFormData(e)} labelClassName='text-[12px] lg:text-[14px]' mainClassName=' my-0 lg:col-start-1 lg:col-end-3' required={false} label={'Comments'} name="note" />
        <div className='w-full mt-[12px] text-[12px] md:text-[14px] md:font-semibold col-start-1 lg:col-end-2 text-[#202020] dark:text-text-secondary-light'>
          <label htmlFor='addresstype'> Address Attributes* </label>
          <Select
            id='addresstype'
            value={preselectedOptions}
            onChange={multiSelectChangeHandler}
            options={options}
            isMulti
            className='mt-[4px]'
            styles={customStyles}
          />
          {
            errorState.addressNotesAttributes ? <span className=' text-[red] text-[12px]'>Address Attributes is missing</span> :null
          }
        </div>

        <div className="w-full mt-[12px] text-[#202020] dark:text-text-secondary-light">
          <label className='text-[12px] md:text-[14px] sm:font-semibold' htmlFor="Business">Address Type*</label>
          <div className="h-[41px] mt-[4px] flex items-center justify-between text-[12px] md:text-[14px]">
            <RadioWidthLable checked = {formData.addressTypeAttribute == '6617b87aa86bb50e82fda3cf'} value={'6617b87aa86bb50e82fda3cf'} id='Residence' label='Residence' name='addressTypeAttribute' onChange={changeFormData}>
              <HouseIcon primaryColor={theme ? '#FFF' : '#202020'} />
            </RadioWidthLable>

            <RadioWidthLable checked = {formData.addressTypeAttribute == '6617b871a86bb50e82fda3ce'} value={'6617b871a86bb50e82fda3ce'} id=' Business' label='Business' name='addressTypeAttribute' onChange={changeFormData}>
              <OfficeIcon primaryColor={theme ? '#FFF' : '#202020'} />
            </RadioWidthLable>

            <RadioWidthLable checked = {formData.addressTypeAttribute == '6617b886a86bb50e82fda3d0'} value={'6617b886a86bb50e82fda3d0'} id='others' label='Others' name='addressTypeAttribute' onChange={changeFormData} />
          </div>
          {
            errorState.addressTypeAttribute ? <span className=' text-[red] text-[12px]'>Address Type is missing</span> :null
          }
        </div>

      </form>
      {/* end */}
    </section>
  );
};

export default AddressDetails;
