import React, { useMemo, useState } from 'react'
import Button from '../button';
import { useAppSelector } from '@/store/utils/hooks';
import { productsApi } from '@/store/api-slices/products-api';
import { RootState } from '@/store/store';
import { DEFAULT_LOCATION } from '@/config';
import showToast from '@/helper/show-toaster';
import Model from '@/components/model';
import ReasonFilter from '../reason-filter';
type ProductReportProps = {
  assetId: string;
  handleCloseReport: () => void;    
};
const ProductReport = ({assetId, handleCloseReport}: ProductReportProps) => {
      const { data: reportReasons } = productsApi.useGetReportReasonsQuery();
      const [postReport, { isLoading: isPostReportLoading }] = productsApi.usePostReportMutation();
      const { myLocation } = useAppSelector((state: RootState) => state.auth);
      const [reportError, setReportError] = useState('');
      const [selectedReportOption, setSelectedReportOption] = useState<string[]>([]);

      const reportOptions = useMemo(() => {
        return [
          ...(reportReasons?.data?.map((reason) => ({
            label: reason.reason,
            value: reason._id,
          })) || []),
        ];
      }, [reportReasons?.data]);

      const [otherReason, setOtherReason] = useState('');

      const handleReportOptionChange = (selectedValues: string[]) => {
        setSelectedReportOption(selectedValues);
      };

    const reportSubmitHandler = async () => {
      if (selectedReportOption?.[0] == 'Other' && otherReason == '') {
        setReportError('Please specify the reason');
        return;
      }
      if (selectedReportOption?.length == 0) {
        setReportError('Please select the reason');
        return;
      }
      const reason =
        selectedReportOption?.[0] == 'Other'
          ? otherReason
          : reportOptions.find((option) => option.value === selectedReportOption?.[0])?.label || '';
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
        const err = error as { status: number; data: { message: string } };
        showToast({ message: err.data.message, messageType: 'error' });
      }
    };
  return (
    <>
      <Model
        onClose={() => handleCloseReport()}
        className="w-[90%] max-w-[420px] h-fit py-6 px-5 rounded-[15px] bg-white dark:bg-bg-nonary-dark"
      >
        <div className="w-full h-full bg-white dark:bg-bg-nonary-dark">
          <ReasonFilter
            filterHeaderText="Report"
            filterDescription="Please select an option"
            containerClass="static p-0 bg-bg-septenary-light w-full bg-white"
            selectedValues={selectedReportOption}
            options={reportOptions}
            onSelectionChange={handleReportOptionChange}
            handleSubmit={reportSubmitHandler}
            buttonText="Submit"
            isButtonLoading={isPostReportLoading}
            error={reportError}
            setError={setReportError}
            showOtherOption={true}
            otherReason={otherReason}
            setOtherReason={setOtherReason}
            otherReasonPlaceholder="Please specify the reason"
          />
        </div>
      </Model>
    </>
  );
}

export default ProductReport