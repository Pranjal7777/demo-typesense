import React, { useMemo, useState } from 'react'
import Button from '../button';
import { useAppSelector } from '@/store/utils/hooks';
import { productsApi } from '@/store/api-slices/products-api';
import { RootState } from '@/store/store';
import { DEFAULT_LOCATION } from '@/config';
import showToast from '@/helper/show-toaster';
import FilterPopup from '../filter-popup';
import Model from '@/components/model';
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
      <Model onClose={() => handleCloseReport()} className="w-[90%] max-w-[420px] h-fit py-8 px-5 rounded-[15px]">
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
          <Button disabled={isPostReportLoading} isLoading={isPostReportLoading} onClick={reportSubmitHandler} className="mt-6 !mb-0 text-base font-normal">
            Submit
          </Button>
        </div>
      </Model>
    </>
  );
}

export default ProductReport