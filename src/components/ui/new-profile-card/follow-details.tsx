import React, { FC, useEffect, useState } from 'react';
import SearchIcon from '../../../../public/assets/svg/search-icon';
import FollowDetailsCard from './follow-details-card';
import debounce from 'lodash.debounce';
import { selfProfileApi } from '@/store/api-slices/profile/self-profile';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Followee, SellerProfileType } from '@/store/types/seller-profile-type';
import Placeholder from '@/containers/placeholder/placeholder';
import FollowDetailsCardSkeleton from './follow-details-card-skeleton';
import { NO_FOLLOWERS_PLACEHOLDER } from '../../../../public/images/placeholder';

type FollowDetailsProps = {
  title?: string;
  setTotalUserFollowers?: React.Dispatch<React.SetStateAction<number>>;
  setTotalUserFollowing?: React.Dispatch<React.SetStateAction<number>>;
};

const FollowDetails: FC<FollowDetailsProps> = ({ title, setTotalUserFollowers, setTotalUserFollowing }) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const debouncedSetSearchTerm = debounce(setDebouncedSearchTerm, 300);
  const { userInfo } = useSelector((state: RootState) => state.auth);


  const { data, isFetching, refetch } = selfProfileApi.useGetFollowersAndFollowingQuery({
    page,
    trigger: title?.toLowerCase() == 'followers' ? 2 : 1,
    accountId: userInfo?.accountId || '',
    userId: userInfo?._id || '',
    searchText: debouncedSearchTerm || '',
  });
  console.log(data?.data?.followeeData, 'followers');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const [allData, setAllData] = useState<Followee[]>([])
  useEffect(() => {

      if(data?.data?.followeeData) {
         if (page === 1) setAllData(data?.data?.followeeData);
         else setAllData([...allData, ...data?.data?.followeeData])
      }
     else {
       setAllData([])
      }
    
  }, [data?.data?.followeeData])

  useEffect(() => {
    debouncedSetSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleUnfollow = (accountId: string) => {
    setAllData(allData.filter((item) => item.accountId !== accountId))
    setTotalUserFollowing?.((prev)=> prev - 1);
  }

  return (
    <div className="p-5 flex flex-col flex-1 overflow-y-hidden dark:bg-bg-secondary-dark">
      <h1 className="text-text-secondary-dark text-center dark:text-text-secondary-light font-semibold mb-5 text-xl">
        {title}
      </h1>
      {(allData?.length > 0 || searchTerm) && (
        <div className="search-box text-text-primary-light dark:text-text-primary-dark w-full h-11 rounded-[4px] flex gap-3 items-center px-[15px] bg-bg-septenary-light dark:bg-bg-tertiary-dark">
          <SearchIcon className="h-6 w-6" />
          <input
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search Usernames"
            type="text"
            className="w-full text-sm outline-none bg-bg-septenary-light dark:bg-bg-tertiary-dark h-full"
          />
        </div>
      )}

      <div className="flex flex-col flex-1 overflow-y-scroll mt-4">
        {allData?.length > 0 &&
          !isFetching &&
          allData?.map((item: Followee) => (
            <FollowDetailsCard
              key={item._id}
              refetch={refetch}
              accountId={item.accountId}
              firstName={item.firstName}
              lastName={item.lastName}
              profilePicUrl={`${item.profilePic}`}
              username={item.accountUsername}
              buttonText={'Unfollow'}
              buttonType="quinary"
              handleUnfollow={handleUnfollow}
            />
          ))}
        {isFetching && Array.from({ length: 5 }).map((_, index) => <FollowDetailsCardSkeleton key={index} />)}
        {allData?.length < 1 && !isFetching && (
          <Placeholder src={NO_FOLLOWERS_PLACEHOLDER} containerClassName=" flex-1" title={`No ${title} found`} />
        )}
      </div>
    </div>
  );
};

export default FollowDetails;
