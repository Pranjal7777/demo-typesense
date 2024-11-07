import React, { useState } from 'react';
import { Range, getTrackBackground } from 'react-range';
import PropTypes from 'prop-types';

const MIN = 50;
const MAX = 500;
const STEP = 45;

// type distanceInputProps = {
//   changeSelectedDistance: (_distance: any) => void;
// };
const DistanceRangeInput = () => {
  const [values, setValues] = useState([50]);

  // console.log(values[0].toFixed(1));

  // useEffect(() => {
  //   changeSelectedDistance(values[0] + " mi");
  // }, [values[0]]);
  return (
    <div
      className="relative"
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        margin: '1em',
        marginTop: '3.5rem',
      }}
    >
      <Range
        values={values}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={(values) => {
          setValues(values);
          // changeSelectedDistance(values[0]);
        }}
        renderTrack={({ props, children }) => (
          <div
            role="button"
            tabIndex={0}
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: '36px',
              display: 'flex',
              width: '100%',
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: '5px',
                width: '100%',
                borderRadius: '4px',
                background: getTrackBackground({
                  values: values,
                  colors: ['#6d3ec1', '#DBDBDB45'],
                  min: MIN,
                  max: MAX,
                }),
                alignSelf: 'center',
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '20px',
              width: '20px',
              borderRadius: '50%',
              backgroundColor: '#6D3EC1',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <section className="left-[-25px] top-[-5px] absolute">
              <output
                style={{ marginTop: '30px' }}
                className="absolute flex justify-center items-center top-[-80px] bg-[#6D3EC1] w-[67.5px] px-[16px] py-[5px] text-sm text-text-primary-dark rounded "
              >
                {values[0].toFixed(1)}
              </output>
              <div className="absolute top-[-30px] left-5 ">
                <svg
                  fill="#6D3EC1"
                  height="30px"
                  width="30px"
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 511.51 511.51"
                  stroke="#6D3EC1"
                  transform="rotate(180)matrix(1, 0, 0, 1, 0, 0)"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="#CCCCCC"
                    strokeWidth="7.161126000000001"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <g>
                      <g>
                        <path d="M498.675,493.845L265.16,5.568c-3.541-7.424-15.701-7.424-19.243,0L11.251,496.235c-1.579,3.307-1.344,7.189,0.597,10.283 s5.355,4.992,9.024,4.992h469.76c5.888,0,10.667-4.779,10.667-10.667C501.299,498.176,500.317,495.723,498.675,493.845z"></path>{' '}
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
            </section>
          </div>
        )}
        renderMark={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '10px',
              width: '2px',
              backgroundColor: '#6D3EC1',
              marginTop: '-3px',
            }}
          />
        )}
      />
      <div className="w-full relative flex overflow-hidden justify-between">
        <p className="text-sm">50</p>
        <p className="text-sm">150</p>
        <p className="text-sm">500</p>
        <p className="text-sm">1000</p>
        <p className="text-sm">Country</p>
        <p className="text-sm">World</p>
      </div>
    </div>
  );
};

DistanceRangeInput.propTypes = {
  onMouseDown: PropTypes.func.isRequired,
  onTouchStart: PropTypes.func.isRequired,
  style: PropTypes.object,
  ref: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.elementType })]),
};

export default DistanceRangeInput;

// <p className="absolute mobile:text-xs text-sm  left-0">50</p>
/* <p className="absolute mobile:text-xs text-sm  left-11 mobile:left-10">100</p> */
// <p className="absolute mobile:text-xs text-sm  left-16 mobile:left-[5.6rem]">150</p>
/* <p className="absolute mobile:text-xs text-sm  left-[10rem] mobile:left-[8.6rem]">200</p> */
// <p className="absolute mobile:text-xs text-sm  left-36 mobile:left-[11.4rem]">500</p>
// <p className="absolute mobile:text-xs text-sm  left-52 mobile:left-[14.5rem]">1000</p>
// <p className="absolute mobile:text-xs left-72 text-xs leading-4 font-medium mobile:left-[17rem]">
//   Country
// </p>
// <p className="absolute mobile:text-xs text-xs left-[21.5rem] mobile:left-[20.5rem]">World</p>
