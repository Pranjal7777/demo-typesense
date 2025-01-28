import Slider from 'react-slick';
import  { FC } from 'react';
import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useSizeMode from '@/hooks/size';
import { useTheme } from '@/hooks/theme';
import Rating from '@/components/ui/rating';


interface Testimonial {
  ratings: number;
  title: string;
  comment: string;
  userName: string;
}

interface Props {
  data: Testimonial[];
}

const CustomerTestimonial: FC<Props> = ({ data }) => {
  const sizeMode = useSizeMode();
  const {theme} = useTheme();

  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: sizeMode,
    slidesToScroll: 1,
    autoplay: true,
  };


  return (
    <Carousel {...settings} className="z-0 mobile:mb-10" theme={theme} totalSlides={data.length}>
      {data.map((item, index) => (
        <Warp key={index}>
         
          <div
            className="border rounded-lg p-4 mobile:shadow mobile:rounded-lg mobile:w-full flex flex-col mobile:items-center mobile:justify-center rtl:text-right w-full h-fit mobile:h-[180px]  dark:bg-bg-primary-dark bg-bg-secondary-light mobile:dark:border dark:border-border-tertiary-dark"
            key={index}
          >
            <div className="mobile:pl-4 mobile:mt-0 gap-2 place-content-center md:place-content-start">
              <Rating value={item.ratings} key={index} color="var(--brand-color)" className='mobile:text-xs sm:text-2xl' itemClassName="mr-2 " />
            </div>
            <div className="flex flex-wrap text-wrap w-full flex-col mobile:items-center mobile:justify-center pt-3 ">
              <p className=" text-text-primary-light dark:text-text-primary-dark text-sm sm:text-base py-2 font-semibold">
                {item.title}
              </p>
              <p className=" flex flex-wrap text-wrap  border-error sm:h-[105px] mobile:text-center mobile:text-xs mobile:px-4 sm:text-sm text-text-tertiary-light dark:text-text-tertiary-dark">{item.comment}</p>
            </div>
            <div className="pt-3 mobile:pt-1">
              <p className="mobile:text-xs text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">{item.userName}</p>
            </div>
          </div>
 
        </Warp>
      ))}
    </Carousel>
  );
};

const Carousel = styled(Slider) <{ theme: boolean ,totalSlides:number}>`
  // z-index:0;
  /* border:2px solid red; */
  // margin:10px 10px;
  // margin-left:90px;
  // padding-left:190px;
  margin-top: 20px;

  //button's setting
  & > button {
    opacity: 0;
    margin: 0px 15px;
    height: 100%;
    width: 5vw;
    z-index: 1;

    &:hover {
      transition: all 0.2s ease 0s;
      opacity: 1;
    }
  }

  //dot's color
  ul {
    // margin-left:25px;
    // border:2px solid red;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  ul li {
    width: ${(props) => (`${100 / props.totalSlides / 8 }%`)};

    @media (min-width: 360px) and (max-width: 639px) {
    /* Your CSS rules go here */
      width: ${(props) => (`${100 / props.totalSlides / 2 }%`)};
    }

    // margin:0px 25px;
    // border:2px solid red;
    button {
      // border:2px solid red;
      @media (min-width: 640px) {
        display:none;
      }
      // align-item:center;
      // justify-content:center;

      &:before {
        // border:2px solid red;
        margin-top: 5px;
        content: '';
        display: block;
        height: 4px; /* Adjust the height of the horizontal line */
        width: 100%; /* Make the line span the full width */
        border-radius: 8px;
        // color:#202020;
        /* background-color: #202020;  */

        background-color: ${(props) => (props.theme === true ? 'white' : '#202020')};
      }
    }
  }

  li.slick-active button:before {
    color: #202020;
  }

  .slick-list {
    overflow: hidden;
  }

  .slick-prev {
    left: -30px;
  }
  .slick-next {
    right: -30px;
  }
`;

const Warp = styled.div`
  /* border:2px solid red; */
  padding-left: 4px;
  padding-right: 4px;
  cursor: pointer;
  position: relative;
  border-radius: 4px;

  @media (min-width: 360px) and (max-width: 639px) {
  /* Your CSS rules go here */
    height: 182px;
  }

  @media (min-width: 640px){
  /* Your CSS rules go here */
    height: 242px;
  }

  /* a {
    // border:2px solid green;
    /* border-radius:100px; */
    /* box-shadow: 5px 5px 5px 5px lightblue; */
    cursor: pointer;
    display: block;
    position: relative;
    // padding:4px; */
    img {
      /* border-radius:100px; */
      margin: auto;
      width: 100%;
      height: 100%;
    }

    &:hover {
      /* padding:0; */
      /* border:4px solid rgba(249,249,249,0.8); */
      // transition-duration:1s;
      // transform: scale(1.02);
    }
  /* } */
`;

export default CustomerTestimonial;

