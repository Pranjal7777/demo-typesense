import Rating from '@/components/ui/rating';
import RatingCardSkeleton from '@/components/ui/rating-card-skeleton';
import ReviewCard from '@/components/ui/review-card';
import ReviewCardSkeleton from '@/components/ui/review-card-skeleton';
import ReviewWrapper from '@/components/ui/review-wrapper';
import SingleStarReviewCard from '@/components/ui/single-star-review';
import { sellerProfileApi } from '@/store/api-slices/seller-profile/seller-profile-api';
import React from 'react';

const BuyersReviewSection = ({accountId}:{accountId:string}) => {
  const {data, isFetching} = sellerProfileApi.useGetBuyerReviewsQuery({accountId});
  const {data:buyerRatings, isFetching:isBuyerRatingsFetching} = sellerProfileApi.useGetBuyerRatingsQuery({accountId});

  return (
    <section className='all-reviews w-full mt-4 md:mt-0'>
      {
        isBuyerRatingsFetching && <RatingCardSkeleton/>
      }
      <ReviewWrapper>
        {
          !isBuyerRatingsFetching && <SingleStarReviewCard
            ratingHeading={`${buyerRatings?.data?.ratingCount || 0} Reviews`}
            ratingText={`${buyerRatings?.data?.avgRating || '0.0'}`}
          />
        }
        {
          !isBuyerRatingsFetching && buyerRatings &&  <div className='flex flex-col gap-2'>
            {
              buyerRatings?.data.ratingParameter.map((item)=><Rating key={item._id}  itemClassName='order-1 text-xs' starContainerClass='order-2 gap-1' wrapperClass='w-[218px] justify-between' value={Number(item.rating)} text={item.parameterTitle}/>)
            }
          </div>
        }
  
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

export default BuyersReviewSection;