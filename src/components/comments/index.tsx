import React, { FC, useState } from 'react';
import Button, { BUTTON_TYPE_CLASSES } from '../ui/button';
import { CommentCard } from './comment-card';

export type Props = {
  data: {
    CommentsTitle: string;
    allComments: {
      name: string;
      DateAndTime: string;
      text: string;
    }[];
    commentBtn: string;
  };
};

const Comments: FC<Props> = ({ data }) => {
  const [visibleComments, setVisibleComments] = useState(5); // State to track number of visible comments

  const loadMoreComments = () => {
    setVisibleComments((prev) => prev + 5); // Load additional 5 comments
  };

  return (
    <div className=" mobile:mt-9  mt-12 ">
      <div className="mobile:text-lg xl:text-2xl lg:text-xl md:text-lg sm:text-base font-semibold text-text-primary-light dark:text-text-quinary-dark">
        {data?.CommentsTitle} ({data?.allComments?.length})
      </div>
      <div className="mobile:mt-2 xl:mt-8 sm:mt-4 max-h-[50vh] overflow-y-scroll">
        {data?.allComments?.slice(0, visibleComments).map((item1, index) => (
          <CommentCard item={item1} key={index} />
        ))}
      </div>
      {visibleComments < data?.allComments?.length && (
        <div className="text-brand-color font-semibold cursor-pointer underline text-sm md:text-base" onClick={loadMoreComments} role='button' tabIndex={0}  onKeyUp={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            loadMoreComments();
          }
        }}>
          See More Comments
        </div>
      )}
      <div className=" mt-6 border mobile:flex mobile:justify-center justify-between  items-center flex">
        <input type="text" placeholder="Add a comment" className="pl-5 p-3 outline-0 bg-transparent text-base text-text-primary-light dark:text-text-quinary-dark w-full" />
        <Button
          buttonType={BUTTON_TYPE_CLASSES.tertiary}
          className="mobile:text-sm mobile:w-[152px] mobile:h-[33px] text-base border-0 !w-20 text-brand-color !mb-0 border-border-senary-light dark:border-border-primary-dark xl:w-[184px] sm:w-[120px] xl:h-11 sm:h-9"
        >
          {data?.commentBtn?.slice(0, 14)}
        </Button>
      </div>
    </div>
  );
};

export default Comments;
