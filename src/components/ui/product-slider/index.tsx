import { appClsx } from '@/lib/utils';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import HartSvg from '../../../../public/assets/svg/heart';
import { getCookie } from '@/utils/cookies';
import { useRouter } from 'next/router';
import ShareButton from '../share-button';
import { STATIC_IMAGE_URL, STATIC_VIDEO_URL } from '@/config';
import ImageContainer from '../image-container';
import { productsApi } from '@/store/api-slices/products-api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import FullScreenSpinner from '../full-screen-spinner';
import { toast } from 'sonner';
// import { setLikeCount, toggleLike } from '@/store/slices/product-detaill-slice';

export type Props = {
  imagesArray: { url: string; type: string; thumbnailURL: string }[];
  className: string;
  shareURL: string;
  shareTitle?: string;
  isProductLiked: boolean;
  setTotalLikeCount:React.Dispatch<React.SetStateAction<number>>;
  productCondition?: string;
  setStickyHeaderDetails: React.Dispatch<React.SetStateAction<any>>;
  stickyHeaderDetails: any;  
};

const ProductSlider: React.FC<Props> = ({ imagesArray, className, shareURL, shareTitle, isProductLiked, setTotalLikeCount, productCondition, setStickyHeaderDetails, stickyHeaderDetails }) => {
  const route = useRouter();
  const { id } = route.query;
  const [likeAndDislikeProduct, { isLoading: isLikeAndDislikeLoading }] = productsApi.useLikeAndDislikeProductMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [isHoveringCTAs, setIsHoveringCTAs] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [, /*isDragging*/ setIsDragging] = useState(false); // this state fot just to track the image
  const [startPosition, setStartPosition] = useState<number | null>(null); // Store the start position for both touch and mouse events
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const router = useRouter();
  const isLoggedIn = getCookie('isUserAuth');
  const [showVideo, setShowVideo] = useState(false);
  const [isLiked, setIsLiked] = useState(isProductLiked)
  
  // Handlers for next and previous buttons
  const btnPressPrev = () => {
    setCurrentImageIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? imagesArray.length - 1 : prevIndex - 1;
      playVideo(newIndex);
      return newIndex;
    });
  };

  const btnPressNext = () => {
    setCurrentImageIndex((prevIndex) => {
      const newIndex = prevIndex === imagesArray.length - 1 ? 0 : prevIndex + 1;
      playVideo(newIndex);
      return newIndex;
    });
  };
  const playVideo = (index: number) => {
    if (imagesArray[index].type === 'VIDEO') {
      setVideoSrc(`${STATIC_VIDEO_URL}/` + imagesArray[index].url);
      setShowVideo(true);
    } else {
      setShowVideo(false);
    }
  };
  // Handler for selecting an image from the gallery
  const handleGalleryImageClick = (index: number) => {
    setCurrentImageIndex(index);
    playVideo(index);
  };

  // mobile move start
  const handleStart = (position: number) => {
    setStartPosition(position);
  };

  // Unified end swipe handler for touch and mouse events
  const handleEnd = (endPosition: number) => {
    if (startPosition == null) return;

    const diff = startPosition - endPosition;
    if (diff > 50) {
      // Swipe left
      btnPressNext();
    } else if (diff < -50) {
      // Swipe right
      btnPressPrev();
    }
    setStartPosition(null); // Reset for the next swipe
  };
  // mobile move end

  // mouse move start
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent image selection
    setIsDragging(true);
    setStartPosition(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent image selection
    setIsDragging(false);
  };
  // mouse move end

  //Zoom functionality handlers
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };
  const userID = useSelector((state: RootState) => state.auth.userInfo?._id);

  const handleLike = async () => {
    if (isLoggedIn) {
      try {
        const newLikeState = !isLiked;
        if (typeof userID === 'string' && typeof id === 'string') {
          const userId: string = userID;
          const assetId: string = id;
          const result = await likeAndDislikeProduct({ assetid: assetId, like: newLikeState, userId }).unwrap();
          setIsLiked(newLikeState);
          setTotalLikeCount((prev) => (newLikeState ? prev + 1 : prev - 1));
          toast.success(result.message);
        }
      } catch (error) {
        toast.error('Error updating like count');
      }
    } else {
      router.push('/login');
    }
  };

  const getImageSrc = (item: { type: string; url?: string; thumbnailUrl?: string }) => {
    const src =
      item?.type === 'VIDEO'
        ? item.thumbnailUrl?.includes('https')
          ? item.thumbnailUrl
          : `${STATIC_IMAGE_URL}/${item.thumbnailUrl}`
        : item.url?.includes('https')
          ? item.url
          : `${STATIC_IMAGE_URL}/${item.url}`;
    return src;
  };

  const handlePlayVideo = () => {
    setVideoSrc(imagesArray[currentImageIndex].url);
    setShowVideo(true);
    playVideo(currentImageIndex);
  };
  const [videoSrc, setVideoSrc] = useState<string>('');

  const imageElementRef = useRef<HTMLDivElement>(null);
  const shareIconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (imageElementRef.current) {
        const rect = imageElementRef.current.getBoundingClientRect();

        if (rect.top < 145) {
          console.log(rect.top, imagesArray[currentImageIndex].url, 'mir for imageElementRef');
          // if(! stickyHeaderDetails?.activeImageSrc) {
          console.log('mirchul imageElementRef', imagesArray[currentImageIndex]?.url);
          setStickyHeaderDetails({ ...stickyHeaderDetails, activeImageSrc: imagesArray[currentImageIndex]?.url });
          // }
        } else {
          // if (stickyHeaderDetails?.activeImageSrc) {
          setStickyHeaderDetails({ ...stickyHeaderDetails, activeImageSrc: null });
          // }
        }
      }

      if (shareIconRef.current) {
        const rect = shareIconRef.current.getBoundingClientRect();
        if (rect.top < 145) {
          if (!stickyHeaderDetails?.showShareIcon) {
            setStickyHeaderDetails?.({ ...stickyHeaderDetails, showShareIcon: true });
          }
        } else {
          console.log('inelse', stickyHeaderDetails?.showShareIcon);

          // if (stickyHeaderDetails?.showShareIcon) {
          setStickyHeaderDetails?.({ ...stickyHeaderDetails, showShareIcon: false });
          // }
        }
      }
    };

    updatePosition(); // Initial update when component mounts
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
    };
  }, []);

  return (
    <>
      {isLikeAndDislikeLoading && <FullScreenSpinner />}
      <div
        className={appClsx(
          ' w-full gap-1 lg:h-full mobile:max-h-1/2 flex flex-col lg:flex-row-reverse justify-between',
          className
        )}
      >
        {/* Main image display with swipe functionality */}
        <div
          className=" border-border-tertiary-light w-[79%] mobile:w-auto aspect-square dark:border-border-tertiary-dark relative overflow-hidden flex items-center justify-center h-auto"
          onMouseDown={(e) => {
            handleStart(e.clientX);
            handleMouseDown(e);
          }}
          onMouseUp={(e) => {
            handleEnd(e.clientX);
            handleMouseUp(e);
          }}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX)}
          ref={imageContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: 'crosshair' }}
          role="button"
          tabIndex={0}
        >
          {showVideo ? (
            <video className="w-full h-full" controls muted autoPlay={true}>
              <source src={videoSrc} type="video/mp4"></source>
              <track kind="captions" label="English" srcLang="en" src={videoSrc} />
            </video>
          ) : (
            <>
              {imagesArray?.length > 0 && (
                <ImageContainer
                  className="mobile:cursor-auto object-cover !h-full rounded-2xl"
                  src={getImageSrc(imagesArray[currentImageIndex])}
                  alt={`Image ${currentImageIndex}`}
                  width={569}
                  height={426}
                  layout="responsive"
                  key={`${currentImageIndex}-${imagesArray[currentImageIndex].url}`}
                />
              )}
              {imagesArray[currentImageIndex]?.type === 'VIDEO' && !showVideo && (
                <button
                  className="absolute !top-24 !left-7 md:!left-[30%] lg:left-auto lg:top-20 mx-auto mobile:inset-24 mobile:w-9/12 mobile:h-1/4 mobile:mt-10  inset-46 w-1/3 h-[70%] ml-[5%] flex items-center justify-center"
                  onClick={handlePlayVideo}
                >
                  <div className="w-12 h-12 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                    <svg
                      className="w-6 h-6 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 3l14 9-14 9V3z"></path>
                    </svg>
                  </div>
                </button>
              )}
            </>
          )}
          <div
            className="absolute lg:right-5 lg:top-5 right-5 top-5 sm:top-2 sm:right-1 flex max-h-9  items-center "
            onMouseLeave={() => setIsHoveringCTAs(false)}
            onMouseEnter={() => setIsHoveringCTAs(true)}
          >
            <div ref={shareIconRef} className="cursor-pointer">
              <ShareButton url={shareURL} title={shareTitle} />
            </div>
            <button
              className="bg-[#0000004D] p-2.5 cursor-pointer rounded-full"
              onClick={handleLike}
              tabIndex={0}
              onKeyUp={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleLike();
                }
              }}
            >
              <HartSvg color="#ff0000" height="20" width="20" isFilled={isLiked} />
            </button>
          </div>

          {imagesArray.length > 1 && (
            <div>
              <button
                className="mobile:left-4  absolute w-16 h-24 flex items-center lg:justify-center sm:justify-start lg:left-4 sm:left-1"
                onClick={btnPressPrev}
              >
                <p className=" text-text-secondary-light bg-bg-denary-light bg-opacity-20 hover:bg-opacity-50 rounded-full lg:text-3xl sm:text-sm mobile:w-8 mobile:h-8 lg:w-9 lg:h-9 sm:w-4 sm:h-4 flex items-center justify-center hover:scale-102 ">
                  &lt;
                </p>
              </button>
              <button
                className="mobile:right-4 mobile:justify-end absolute w-16 h-24 flex items-center lg:justify-center sm:justify-end lg:right-4 sm:right-1"
                onClick={btnPressNext}
              >
                <p className=" text-text-secondary-light bg-bg-denary-light bg-opacity-20 hover:bg-opacity-50 rounded-full lg:text-3xl sm:text-sm mobile:w-8 mobile:h-8 lg:w-9 lg:h-9 sm:w-4 sm:h-4  flex items-center justify-center hover:scale-102">
                  &gt;
                </p>
              </button>
            </div>
          )}
          {productCondition && (
            <div className="absolute top-5 left-5 w-[75px] h-8 flex items-center justify-center text-brand-color bg-bg-quattuordenary-light rounded-[3px]">
              {productCondition}
            </div>
          )}
        </div>
        {isZoomed && !isHoveringCTAs && (
          <div
            className="hidden rounded-xl lg:block absolute  2xl:right-0 xl:right-16 lg:right-16 md:top-0 sm:top-[8px] overflow-hidden 2xl:w-[41%] 2xl:h-[100%] xl:w-[37%] xl:h-[72%] lg:w-[36%] lg:h-[55%]"
            style={{
              backgroundImage: `url(${STATIC_IMAGE_URL + '/' + imagesArray[currentImageIndex].url})`,
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
              backgroundSize: '400%', // Set how much the image should be zoomed
            }}
          />
        )}

        {/* Thumbnails gallery */}
        <div
          ref={imageElementRef}
          className="flex  flex-row lg:flex-col gap-2 mobile:gap-0 justify-start mobile:h-full  mobile:w-[100%] lg:w-[19%]  overflow-y-scroll overflow-x-hidden mobile:overflow-y-hidden mobile:overflow-x-scroll mobile:mt-2"
        >
          {imagesArray?.map((img, index) => (
            <div
              key={index}
              className=" lg:mx-0 xl:mx-1 mx-1 cursor-pointer h-fit  w-auto lg:w-full"
              onClick={() => handleGalleryImageClick(index)}
              onMouseEnter={() => handleGalleryImageClick(index)}
              tabIndex={0}
              role="button"
              onKeyUp={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleGalleryImageClick(index);
                }
              }}
            >
              <ImageContainer
                src={getImageSrc(img)}
                alt={`Thumbnail ${index}`}
                width={110}
                height={110}
                className={`2xl:h-28 lg:w-11/12 xl:h-28 lg:h-24 md:h-28 md:w-28 w-11/12  border !aspect-square mobile:h-[80px] mobile:w-[80px] object-cover rounded-lg ${
                  index === currentImageIndex
                    ? '!border-2 border-border-primary-light dark:border-border-secondary-light'
                    : ''
                }`}
                layout="fixed"
                key={`${currentImageIndex}-${imagesArray[currentImageIndex].url}`}
              />
            </div>
          ))}
        </div>
      </div>

      {isLoading && <FullScreenSpinner />}
    </>
  );
};

export default ProductSlider;
