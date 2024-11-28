import Slider from 'react-slick';
import React, { FC } from 'react';
import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import useSizeMode from '@/hooks/size';
import { Banner } from '@/store/types';
import { STATIC_IMAGE_URL } from '@/config';
import { useTheme } from '@/hooks/theme';
import { useRouter } from 'next/router';

export interface Props {
  banners: Banner[];
}

const ImgSlider: FC<Props> = ({ banners }) => {
  const sizeMode = useSizeMode();
  const {theme} = useTheme();
  const totalSlidesToshow=sizeMode === 4 || sizeMode === 3 || sizeMode === 2 ? 2 : 1;
  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: totalSlidesToshow,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
  };
  const router = useRouter();
  const handleClick = (type: number, url: string | undefined) => {    
    switch(type) {
    case 1: 
      router.push('/');
      break;
    case 2: 
    case 3:
    case 4: 
      router.push('/categories');
      break;
    case 5:
      if (url) {
        const validUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
        window.open(validUrl, '_blank');
      }
      break;

    case 6:
      router.push('/');
      break;
    default:
      break;
    }
  };
  return (
    <Carousel {...settings} className="z-0 sm:mb-[22px] mobile:mb-10" theme={theme} totalSlides={banners?.length}>
      {banners?.map((item, index) => (
        <Warp key={index} onClick={()=> handleClick(item.type, item.url)}>
         
          <Image
            className="rounded-2xl"
            width={639}
            height={260}
            src={`${STATIC_IMAGE_URL}/${item.imageWeb}`}
            alt="Banner"
          />
 
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
    opacity: 100%;
    margin: 0px 15px;
    height: 100%;
    width: 5vw;
    z-index: 1;

    /* &:hover {
      transition: all 0.2s ease 0s;
      opacity: 1;
    } */
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
      width: ${(props) => (`${100 / props.totalSlides / 4 }%`)};
    }

    // margin:0px 25px;
    // border:2px solid red;
    button {
      // border:2px solid red;
      // display:flex;
      // align-item:center;
      // justify-content:center;

      &:before {
        // border:2px solid red;
        margin-top: 10px;
        content: '';
        display: block;
        height: 6px; /* Adjust the height of the horizontal line */
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
  height: 260px;
  @media (min-width: 360px) and (max-width: 639px) {
  /* Your CSS rules go here */
    height: 168px;
  }

  @media (min-width: 640px) and (max-width: 1139px){
  /* Your CSS rules go here */
    height: 168px;
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

export default ImgSlider;
