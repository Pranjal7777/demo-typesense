import React, { FC, useEffect, useState } from 'react';
import SearchIcon from '../../../../public/assets/svg/search-icon';
import FollowDetailsCard from './follow-details-card';
import debounce from 'lodash.debounce';
import { selfProfileApi } from '@/store/api-slices/profile/self-profile';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Followee } from '@/store/types/seller-profile-type';

type FollowDetailsProps = {
  title?: string;
};

const FollowDetails: FC<FollowDetailsProps> = ({ title }) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const debouncedSetSearchTerm = debounce(setDebouncedSearchTerm, 100);
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const { data, isFetching, refetch } = selfProfileApi.useGetFollowersAndFollowingQuery({
    page,
    trigger: title?.toLowerCase() == 'followers' ? 2 : 1,
    accountId: userInfo?.accountId || '',
    userId: userInfo?._id || '',
  });
  console.log(data?.data?.followeeData, 'followers');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const [allData, setAllData] = useState<Followee[]>([])
  useEffect(() => {
    if(page === 1) {
      if(data?.data?.followeeData) {
        setAllData(data?.data?.followeeData)
      }
    } else {
      if(data?.data?.followeeData) {
        setAllData([...allData, ...data?.data?.followeeData])
      }
    }
  }, [data?.data?.followeeData])

  useEffect(() => {
    debouncedSetSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleUnfollow = (accountId: string) => {
    setAllData(allData.filter((item) => item.accountId !== accountId))
  }

  return (
    <div className="p-5 flex flex-col flex-1 overflow-y-hidden">
      <h1 className="text-text-secondary-dark text-center dark:text-text-secondary-light font-semibold mb-5 text-xl">
        {title}
      </h1>
      <div className="search-box w-full h-[44px] hidden rounded-[4px] md:flex gap-3 items-center px-[15px] bg-bg-septenary-light dark:bg-bg-secondary-dark">
        <SearchIcon className="h-[24px] w-[24px]" />
        <input
          placeholder="Search Usernames"
          type="text"
          className="w-[100%] text-[14px] outline-none bg-bg-septenary-light dark:bg-bg-secondary-dark h-[100%]"
        />
      </div>
      <div className="flex flex-col flex-1 overflow-y-scroll">
        {allData?.length > 0 &&
          allData?.map((item: Followee) => (
            <FollowDetailsCard
              key={item._id}
              refetch={refetch}
              accountId={item.accountId}
              firstName={item.firstName}
              lastName={item.lastName}
              profilePicUrl={`/${item.profilePic}`}
              username={item.accountUsername}
              buttonText={'Unfollow'}
              buttonType="quinary"
              handleUnfollow={handleUnfollow}
            />
          ))}
      </div>
    </div>
  );
};

export default FollowDetails;
