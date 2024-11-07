import React, { FC, Fragment, isValidElement, ReactElement, ReactNode } from 'react';
import SliderLeftArrowBtn from '../../../../public/assets/svg/slider-left-arrow-btn';
import SliderRightArrowBtn from '../../../../public/assets/svg/slider-right-arrow-btn';
import { appClsx } from '@/lib/utils';
type SliderSettings = {
  dots: boolean;
  infinite: boolean;
  speed: number;
  slidesToShow: number;
  slidesToScroll: number;
  autoplay: boolean;
  autoplaySpeed: number;
  leftRightBtn: boolean;
  leftRightShadow: boolean;
  responsive: boolean;
};

type SliderProps = {
  className?: string;
  leftBtn?: React.ReactNode;
  children: React.ReactNode;
  rightBtn?: React.ReactNode;
  leftRightBtn?: boolean;
  leftRightShadow?: boolean;
  sliderClassName?: string;
  settings?: Partial<SliderSettings>;
};

const Slider: FC<SliderProps> = ({ children, leftBtn, rightBtn, className, sliderClassName, settings = {} }) => {
  const uniqueClassName = `unique-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

  const isSingleValidElement = (child: ReactNode): child is ReactElement => {
    if (isValidElement(child)) {
      if (child.type === Fragment) {
        // Ensure the Fragment contains only one child
        const fragmentChildren = child.props.children;
        return React.Children.count(fragmentChildren) === 1;
      }
      return true;
    }
    return false;
  };

  const childrenArray = React.Children.toArray(children);
  if (childrenArray.length > 2) {
    throw new Error(
      'Slider component must have only two children first child must be heading and second child must be content or content must be a single element!'
    );
  }

  const hasHeading = childrenArray.length > 1;
  const content = hasHeading ? childrenArray[1] : childrenArray[0];
  const heading = hasHeading ? childrenArray[0] : null;

  if (!isSingleValidElement(content)) {
    throw new Error(
      'Slider component must have a single root-level jsx element not Fragment. And if it fragment then it must have only one child!'
    );
  }

  if (heading) {
    if (!isSingleValidElement(heading)) {
      throw new Error(
        'Slider component must have a single root-level jsx element not Fragment. And if it fragment then it must have only one child!'
      );
    }
  }

  const mySettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    leftRightBtn: true,
    leftRightShadow: true,
    responsive: true,
    ...settings,
  };

  const scrollLeftBtn = () => {
    const element = document.querySelector(`.${uniqueClassName}`);
    if (element) {
      element.scrollBy({
        left: -300,
        behavior: 'smooth',
      });
    }
  };

  const scrollRightBtn = () => {
    const element = document.querySelector(`.${uniqueClassName}`);
    if (element) {
      element.scrollBy({
        left: +300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={appClsx('w-full', className)}>
      {heading &&
        isSingleValidElement(heading) &&
        React.cloneElement(heading as React.ReactElement, {
          className: appClsx('', heading.props.className),
        })}
      <div className={appClsx(' w-full relative flex items-center', sliderClassName)}>
        <div
          className={`h-full hidden md:flex w-10 p-10 absolute bottom-0 left-0 items-center justify-center 
            bg-gradient-to-l from-transparent dark:bg-gradient-to-l dark:from-transparent to-[#FFF] dark:to-[#1A1A1A]
          `}
        ></div>
        <div
          className={`h-full hidden md:flex p-10 absolute  right-0 items-center justify-center w-10 
          bg-gradient-to-r from-transparent to-[#FFF] dark:bg-gradient-to-r dark:from-transparent dark:to-[#1A1A1A]
        `}
        ></div>
        
        {mySettings.leftRightBtn &&
          (leftBtn ? (
            React.cloneElement(leftBtn as React.ReactElement, {
              onClick: scrollLeftBtn,
              className:
                'hidden md:inline-block  absolute left-0 hover:scale-102 cursor-pointer transition-all duration-200 ease-in',
            })
          ) : (
            <SliderLeftArrowBtn
              onClick={scrollLeftBtn}
              className="hidden md:inline-block  absolute left-0 hover:scale-102 cursor-pointer transition-all duration-200 ease-in"
            />
          ))}

        {React.cloneElement(content as React.ReactElement, {
          className: appClsx(
            `border-error flex overflow-auto whitespace-nowrap w-full gap-3 ${uniqueClassName}`,
            content.props.className
          ),
        })}
        {mySettings.leftRightBtn &&
          (rightBtn ? (
            React.cloneElement(leftBtn as React.ReactElement, {
              onClick: scrollLeftBtn,
              className:
                'hidden md:inline-block absolute right-0 hover:scale-102 cursor-pointer transition-all duration-200 ease-in',
            })
          ) : (
            <SliderRightArrowBtn
              onClick={scrollRightBtn}
              className="hidden md:inline-block absolute right-0 hover:scale-102 cursor-pointer transition-all duration-200 ease-in"
            />
          ))}
      </div>
    </div>
  );
};

export default Slider;
