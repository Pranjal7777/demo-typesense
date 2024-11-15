import AllRatingSkeleton from '@/components/ui/all-rating-card-skeleton';
import ReviewCard from '@/components/ui/review-card';
import ReviewCardSkeleton from '@/components/ui/review-card-skeleton';
import ReviewWrapper from '@/components/ui/review-wrapper';
import SingleStarReviewCard from '@/components/ui/single-star-review';
import { sellerProfileApi } from '@/store/api-slices/seller-profile/seller-profile-api';
import React from 'react';

const AllReviewsSection = ({accountId}:{accountId:string}) => {
  const {data, isFetching} = sellerProfileApi.useGetAllReviewsQuery({accountId});
  const {data:allRating, isFetching:isAllRatingsFetching} = sellerProfileApi.useGetAllRatingsQuery({accountId});
  
  return (
    <section className='all-reviews w-full mt-4 md:mt-0'>
      {
        isAllRatingsFetching && <AllRatingSkeleton/>
      }
      <ReviewWrapper >
        <SingleStarReviewCard
          ratingHeading={`${allRating?.data.fromBuyerRatingCount || 0} Reviews from Buyer`}
          ratingText={`${allRating?.data.fromAvgBuyerRating || '0.0'}`}
        />
        <SingleStarReviewCard
          ratingHeading={`${allRating?.data.fromSellerRatingCount || 0} Reviews from Seller`}
          ratingText={`${allRating?.data.fromAvgSellerRating || '0.0'}`}
        />
      </ReviewWrapper>
      <div className='flex flex-col gap-3 md:gap-6 mt-4 md:m-5 mr-0 pt-5 border-t overflow-hidden'>
        {
          data &&  data?.data.userReviews.map((userReview)=><ReviewCard key={userReview._id} userReview={userReview}/>)
        }
        {
          isFetching && <ReviewCardSkeleton value={6} />
        } 
        {
          !isFetching && !data && <div className='flex justify-center'>No Review Yet</div>
        }  
                                          
      </div>

    </section>
  );
};

export default AllReviewsSection;