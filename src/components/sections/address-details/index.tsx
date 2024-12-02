import FormInput from '@/components/form/form-input';
import PhoneNumberInput from '@/components/form/phone-number-input';
import LableWithTextArea from '@/components/ui/lable-with-text-area';
import SelectedLocation from '@/components/ui/selected-location';
import React, { ChangeEvent, FC, useMemo } from 'react';
import OfficeIcon from '../../../../public/assets/svg/office-icon';
import HouseIcon from '../../../../public/assets/svg/house-icon';
import RadioWidthLable from '@/components/ui/radio-width-lable';
import { useTheme } from '@/hooks/theme';
import { ErrorStateType } from '@/pages/profile/address';
import Select, { MultiValue, StylesConfig } from 'react-select';
import { UserInfoType } from '@/store/types/profile-type';
import { addressApi } from '@/store/api-slices/profile/address-api';

type Props = {
  formData: UserInfoType;
  changeFormData: (_e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onPhoneChange: (_value: string, _data: { dialCode: string; name: string }) => void;
  errorState: ErrorStateType;
  showEditSection?: boolean;
  setErrorState: React.Dispatch<React.SetStateAction<ErrorStateType>>;
  setFormData: React.Dispatch<React.SetStateAction<UserInfoType>>;
  pageType?: string;
};
interface AddressNote {
  value: string;
  label: string;
}

const AddressDetails: FC<Props> = ({
  formData,
  changeFormData,
  onPhoneChange,
  errorState,
  setErrorState,
  setFormData,
  pageType,
}) => {
  const { theme } = useTheme();
  const { data } = addressApi.useGetAddressAttributesQuery();
  const { data: addressType } = addressApi.useGetAddressTypesQuery();

  const options = useMemo(() => {
    if (!data?.data) {
      return [];
    }
    return data?.data.map((item) => {
      return { value: item._id, label: item.addressAttribute };
    });
  }, [data]);

  const preselectedOptions = useMemo(() => {
    return options.filter((option) => formData.addressNotesAttributes.includes(option.value));
  }, [formData.addressNotesAttributes]);

  const multiSelectChangeHandler = (newValue: MultiValue<AddressNote>) => {
    const selectedItems = newValue.map((item) => item.value);
    setFormData((prevState) => ({ ...prevState, addressNotesAttributes: selectedItems }));
    setErrorState((prevState) => ({ ...prevState, addressNotesAttributes: selectedItems.length == 0 }));
  };

  const customStyles: StylesConfig<AddressNote, true> = {
    control: (provided) => ({
      ...provided,
      width: '100%',
      outline: 'none',
      minHeight: '44px',
      border: theme ? '1px solid var(--border-dark)' : '1px solid var(--border-tertiary-light)',
      borderRadius: '0.375rem',
      backgroundColor: theme ? 'var(--bg-primary-dark)' : '#FFF',
      fontSize: '14px',
      color: theme ? 'var(--bg-light)' : '#000',
      fontWeight: '400',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? (theme ? 'var(--bg-secondary-dark)' : 'var(--text-secondary-light)') : theme ? 'var(--bg-primary-dark)' : 'var(--color-primary-light)',
      color: state.isFocused ? (theme ? 'var(--bg-light)' : 'var(--text-primary-color)') : '',
      fontSize: '14px',
      fontWeight: '400',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: theme ? '#1a202c' : '#fff',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#000',
    }),
  };

  return (
    <section className="w-full mt-3 sm:mt-0 leading-[21px] md:leading-[24px] text-text-primary-light  dark:text-text-primary-dark  address-details-section mobile:!px-4">
      <SelectedLocation pageType={pageType} formData={formData} />
      <LableWithTextArea
        labelClassName="font-[600]"
        error={errorState.addressLine1 ? 'Address is missing' : ''}
        changeEvent={(e) => changeFormData(e)}
        value={formData.addressLine1}
        required={true}
        label={'Address'}
        name="addressLine1"
      />

      <form className="w-full lg:grid lg:grid-cols-2 gap-4">
        <FormInput
          labelClassName="font-[600]"
          error={errorState.country ? 'Country Name is missing' : ''}
          onChange={(e) => changeFormData(e)}
          value={formData.country}
          required
          label={'Country'}
          type="text"
          name="country"
          className="h-[45px] px-[12px] mobile:!text-[14px]"
        />
        <FormInput
          labelClassName="font-[600]"
          error={errorState.state ? 'State Name is missing' : ''}
          onChange={(e) => changeFormData(e)}
          value={formData.state}
          required
          label={'State'}
          type="text"
          name="state"
          className="h-[45px] px-[12px] mobile:!text-[14px]"
        />
        <FormInput
          labelClassName="font-[600]"
          error={errorState.city ? 'City Name is missing' : ''}
          onChange={(e) => changeFormData(e)}
          value={formData.city}
          required
          label={'City'}
          type="text"
          name="city"
          className="h-[45px] px-[12px] mobile:!text-[14px]"
        />
        <FormInput
          labelClassName="font-[600]"
          error={errorState.aptNo ? 'House Name is missing' : ''}
          onChange={(e) => changeFormData(e)}
          value={formData.aptNo}
          required
          label={'House no / Flat no / Building no'}
          type="number"
          name="aptNo"
          className="h-[45px] px-[12px] mobile:!text-[14px]"
        />
        <FormInput
          labelClassName="font-[600]"
          error={errorState.name ? 'Name is missing' : ''}
          onChange={(e) => changeFormData(e)}
          value={formData.name}
          required
          label={'Name'}
          type="text"
          name="name"
          className="h-[45px] px-[12px] mobile:!text-[14px]"
        />

        <PhoneNumberInput
          labelClassName="font-[600]"
          buttonClass="bg-transparent"
          error={errorState.phoneNumber ? 'Phone Number is not valid' : ''}
          country={formData.countryShortForm}
          required={true}
          number={formData.countryCode + formData.phoneNumber}
          label="Phone Number"
          onChange={onPhoneChange}
        />

        <LableWithTextArea
          value={formData.note}
          changeEvent={(e) => changeFormData(e)}
          labelClassName="text-[12px] lg:text-[14px]"
          mainClassName=" my-0 lg:col-start-1 lg:col-end-3"
          label={'Comments'}
          name="note"
        />
        <div className="w-full text-[12px] md:text-[14px] md:font-semibold col-start-1 lg:col-end-2 text-text-primary-light dark:text-text-secondary-light mobile:!mb-3">
          <label htmlFor="addresstype"> Address Attributes* </label>
          <Select
            id="addresstype"
            value={preselectedOptions}
            onChange={multiSelectChangeHandler}
            options={options}
            isMulti
            className="mt-[4px] "
            styles={customStyles}
          />
          {errorState.addressNotesAttributes ? (
            <span className=" text-[red] text-[12px] font-normal">Address Attributes is missing</span>
          ) : null}
        </div>

        <div className="w-full mt-[12px] text-text-primary-light dark:text-text-secondary-light  mobile:!mb-3">
          <label className="text-[12px] md:text-[14px] sm:font-semibold" htmlFor="Business">
            Address Type*
          </label>
          <div className="h-[41px] mt-[4px] flex items-center justify-between text-[12px] md:text-[14px]">
            {addressType?.data.map((item) => (
              <RadioWidthLable
                key={item._id}
                checked={formData.addressTypeAttribute == item._id}
                value={item._id}
                id={item.addressAttribute}
                label={item.addressAttribute}
                name="addressTypeAttribute"
                onChange={changeFormData}
                labelClassName="text-sm pr-2"
              >
                {item.addressAttribute == 'Residence' ? (
                  <HouseIcon primaryColor={theme ? '#FFF' : '#202020'} />
                ) : item.addressAttribute == 'Business' ? (
                  <OfficeIcon primaryColor={theme ? '#FFF' : '#202020'} />
                ) : null}
              </RadioWidthLable>
            ))}

          </div>
          {errorState.addressTypeAttribute ? (
            <span className=" text-[red] text-[12px]">Address Type is missing</span>
          ) : null}
        </div>
      </form>
      {/* end */}
    </section>
  );
};

export default AddressDetails;
