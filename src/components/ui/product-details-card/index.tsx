import React, { useMemo, useState } from 'react';
import ReportFlagSVG from '../../../../public/assets/svg/report-icon';
import { useTheme } from '@/hooks/theme';
import formatUNIXTimeStamp from '@/utils/functions/format-unix-timestamp';
import { useRouter } from 'next/router';
import { getCookie } from '@/utils/cookies';
import Model from '@/components/model';
import { productsApi } from '@/store/api-slices/products-api';
import FilterPopup from '../filter-popup';
import Button from '../button';
import { useAppSelector } from '@/store/utils/hooks';
import { RootState } from '@/store/store';
import showToast from '@/helper/show-toaster';
import { DEFAULT_LOCATION } from '@/config';
import { getFormattedDateFromTimestamp } from '@/helper/get-formatted-date';

type ProductDetailsCardProps = {
  familyName: string;
  categoryTitle: string;
  postTimeStamp: number;
  price: string;
  currency?: string;
  timestampLabel: string;
  assetCondition?: string;
  assetId?: string;
};

const ProductDetailsCard: React.FC<ProductDetailsCardProps> = ({
  familyName,
  categoryTitle,
  postTimeStamp,
  price,
  currency,
  timestampLabel,
  assetCondition,
  assetId
}) => {
  const theme = useTheme();
  const currentTheme = theme.theme;
  const [showReport, setShowReport] = useState(false);
  const [reportError, setReportError] = useState('');
  const [selectedReportOption, setSelectedReportOption] = useState<string[]>([]);
  const { data: reportReasons } = productsApi.useGetReportReasonsQuery();
  const [postReport, { isLoading: isPostReportLoading }] = productsApi.usePostReportMutation();
  const { myLocation } = useAppSelector((state: RootState) => state.auth);

  console.log(selectedReportOption, 'mirchul report reasons');

  const reportOptions = useMemo(() => {
    return [
      ...(reportReasons?.data?.map((reason) => ({
        label: reason.reason,
        value: reason._id,
      })) || []),
      { label: 'Other', value: 'Other' },
    ];
  }, [reportReasons?.data]);

  const [otherReason, setOtherReason] = useState('');

  const handleOtherReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOtherReason(e.target.value);
    setReportError('');
  };

   const handleReportOptionChange = (selectedValues: string[]) => {
     setSelectedReportOption(selectedValues);
   };

  const postedTime = getFormattedDateFromTimestamp(postTimeStamp);
  const router = useRouter();
  const isLoggedIn = getCookie('isUserAuth');

  const handleReport = () => {
    if (isLoggedIn) {
      setShowReport(true);
    } else {
      router.push('/login');
    }
  };

   const handleCloseReport = () => {
     setShowReport(false);
     setSelectedReportOption([]);
     setOtherReason('');
    setReportError('');
  };

  const reportSubmitHandler = async () => {
    if(selectedReportOption?.[0] == 'Other' && otherReason == ''){
      setReportError('Please specify the reason')
      return;
    }
    if(selectedReportOption?.length == 0){
      setReportError('Please select the reason')
      return;
    }
    const reason = selectedReportOption?.[0] == 'Other' ? otherReason : reportOptions.find(option => option.value === selectedReportOption?.[0])?.label || '';
    const payload = {
      reportedId: assetId || '',
      city: myLocation?.city || DEFAULT_LOCATION.city,
      reportType: 'asset',
      ...(selectedReportOption?.[0] !== 'Other' && { reportReasonId: selectedReportOption?.[0] }),
      reason: reason,
      country: myLocation?.country || DEFAULT_LOCATION.countryName,
      lat: myLocation?.latitude || DEFAULT_LOCATION.latitude,
      long: myLocation?.longitude || DEFAULT_LOCATION.longitude,
    };
    try {
      const res = await postReport(payload).unwrap();
      showToast({ message: res?.message || 'Report submitted successfully', messageType: 'success' });
      handleCloseReport();
    } catch (error) {
      const err = error as {status: number, data: {message: string}};
      showToast({ message: err.data.message, messageType: 'error' });
    }
    
  }

  return (
    <>
      <div className="flex flex-col  md:gap-1">
        <div className="flex justify-between items-center">
          <span className="text-xs md:text-base leading-[18px] md:leading-[24px] text-text-tertiary-light dark:text-text-tertiary-dark">
            {familyName}
          </span>
          <div
            onClick={handleReport}
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyUp={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleReport();
              }
            }}
          >
            <ReportFlagSVG fillColor={currentTheme ? '#fff' : '#000'} />
          </div>
        </div>

        <span className="text-lg md:text-2xl leading-[27px] md:leading-[36px] font-semibold text-text-primary-light dark:text-text-quinary-dark">
          {categoryTitle}
        </span>
        <span className="text-xs md:text-base leading-[18px] md:leading-[24px] text-text-tertiary-light dark:text-text-tertiary-dark">
          {timestampLabel}: {postedTime}
        </span>
        <span className="text-xs md:text-base leading-[18px] md:leading-[24px] text-text-tertiary-light dark:text-text-tertiary-dark">
          {assetCondition}
        </span>
      </div>

      <div className="flex flex-col mobile:flex-row  mobile:justify-between mobile:items-center">
        <span className=" mt-3 md:mt-5 text-xl md:text-[28px] font-bold text-text-primary-light dark:text-text-quinary-dark">
          {currency} {price}
        </span>
      </div>

      {showReport && (
        <Model onClose={() => setShowReport(false)} className="w-fit h-fit py-8 px-10 rounded-[15px]">
          <div className="w-full h-full">
            <FilterPopup
              filterHeaderText="Report"
              containerClass="static p-0 bg-bg-septenary-light w-full bg-white"
              selectedValues={selectedReportOption}
              options={reportOptions}
              onSelectionChange={handleReportOptionChange}
              filterType="RADIO"
            />
            {selectedReportOption?.[0] == 'Other' && (
              <textarea
                onChange={handleOtherReasonChange}
                value={otherReason}
                placeholder="Please specify the reason"
                className="w-full resize-none mt-5 h-[100px] outline-none dark:bg-bg-quinary-dark dark:text-text-primary-dark dark:border-border-tertiary-dark border-border-tertiary-light p-3 border rounded-[4px] text-sm"
              ></textarea>
            )}

            {reportError && <p className="text-red-500 text-sm mt-3">{reportError}</p>}
            <Button onClick={reportSubmitHandler} className="mt-6 !mb-0 text-base font-normal">
              Submit
            </Button>
          </div>
        </Model>
      )}
    </>
  );
};

export default ProductDetailsCard;
