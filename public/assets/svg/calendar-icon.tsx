import React from 'react';

type CalendarIconProps = {
  fillColor: string;
}

const CalendarIcon: React.FC<CalendarIconProps> = ({
  fillColor
}) => {
  return (
    <svg width="20" height="21" viewBox="0 0 20 21" fill={fillColor} xmlns="http://www.w3.org/2000/svg">
      <mask
        id="mask0_2819_211740"
        style={{maskType:'alpha'}}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="20"
        height="21"
      >
        <rect y="0.5" width="20" height="20" fill={fillColor}/>
      </mask>
      <g mask="url(#mask0_2819_211740)">
        <path
          d="M4.75772 18.0831C4.38261 18.0831 4.06554 17.9511 3.80651 17.6873C3.54748 17.4234 3.41797 17.1087 3.41797 16.7433V6.25621C3.41797 5.89082 3.54748 5.57618 3.80651 5.31229C4.06554 5.0484 4.38261 4.91646 4.75772 4.91646H6.57824V2.82031H7.69359V4.91646H12.341V2.82031H13.4243V4.91646H15.2448C15.62 4.91646 15.937 5.0484 16.1961 5.31229C16.4551 5.57618 16.5846 5.89082 16.5846 6.25621V16.7433C16.5846 17.1087 16.4551 17.4234 16.1961 17.6873C15.937 17.9511 15.62 18.0831 15.2448 18.0831H4.75772ZM4.75772 16.9998H15.2448C15.309 16.9998 15.3677 16.9731 15.4212 16.9196C15.4746 16.8662 15.5013 16.8074 15.5013 16.7433V9.75621H4.50128V16.7433C4.50128 16.8074 4.52799 16.8662 4.58141 16.9196C4.63484 16.9731 4.69361 16.9998 4.75772 16.9998ZM4.50128 8.6729H15.5013V6.25621C15.5013 6.1921 15.4746 6.13333 15.4212 6.0799C15.3677 6.02648 15.309 5.99977 15.2448 5.99977H4.75772C4.69361 5.99977 4.63484 6.02648 4.58141 6.0799C4.52799 6.13333 4.50128 6.1921 4.50128 6.25621V8.6729ZM10.0057 12.5639C9.82647 12.5639 9.67196 12.5004 9.54216 12.3736C9.41235 12.2467 9.34745 12.0936 9.34745 11.9144C9.34745 11.7352 9.41089 11.5807 9.53776 11.4509C9.66465 11.3211 9.81769 11.2562 9.99689 11.2562C10.1761 11.2562 10.3306 11.3196 10.4604 11.4465C10.5902 11.5734 10.6551 11.7265 10.6551 11.9056C10.6551 12.0849 10.5917 12.2394 10.4648 12.3692C10.3379 12.499 10.1849 12.5639 10.0057 12.5639ZM6.75568 12.5639C6.57647 12.5639 6.42196 12.5004 6.29216 12.3736C6.16235 12.2467 6.09745 12.0936 6.09745 11.9144C6.09745 11.7352 6.16089 11.5807 6.28776 11.4509C6.41465 11.3211 6.56769 11.2562 6.74689 11.2562C6.92609 11.2562 7.0806 11.3196 7.21041 11.4465C7.34021 11.5734 7.40511 11.7265 7.40511 11.9056C7.40511 12.0849 7.34168 12.2394 7.2148 12.3692C7.08791 12.499 6.93487 12.5639 6.75568 12.5639ZM13.2557 12.5639C13.0765 12.5639 12.922 12.5004 12.7922 12.3736C12.6624 12.2467 12.5974 12.0936 12.5974 11.9144C12.5974 11.7352 12.6609 11.5807 12.7878 11.4509C12.9146 11.3211 13.0677 11.2562 13.2469 11.2562C13.4261 11.2562 13.5806 11.3196 13.7104 11.4465C13.8402 11.5734 13.9051 11.7265 13.9051 11.9056C13.9051 12.0849 13.8417 12.2394 13.7148 12.3692C13.5879 12.499 13.4349 12.5639 13.2557 12.5639ZM10.0057 15.4998C9.82647 15.4998 9.67196 15.4363 9.54216 15.3094C9.41235 15.1826 9.34745 15.0295 9.34745 14.8503C9.34745 14.6711 9.41089 14.5166 9.53776 14.3868C9.66465 14.257 9.81769 14.1921 9.99689 14.1921C10.1761 14.1921 10.3306 14.2555 10.4604 14.3824C10.5902 14.5093 10.6551 14.6623 10.6551 14.8415C10.6551 15.0208 10.5917 15.1753 10.4648 15.3051C10.3379 15.4349 10.1849 15.4998 10.0057 15.4998ZM6.75568 15.4998C6.57647 15.4998 6.42196 15.4363 6.29216 15.3094C6.16235 15.1826 6.09745 15.0295 6.09745 14.8503C6.09745 14.6711 6.16089 14.5166 6.28776 14.3868C6.41465 14.257 6.56769 14.1921 6.74689 14.1921C6.92609 14.1921 7.0806 14.2555 7.21041 14.3824C7.34021 14.5093 7.40511 14.6623 7.40511 14.8415C7.40511 15.0208 7.34168 15.1753 7.2148 15.3051C7.08791 15.4349 6.93487 15.4998 6.75568 15.4998ZM13.2557 15.4998C13.0765 15.4998 12.922 15.4363 12.7922 15.3094C12.6624 15.1826 12.5974 15.0295 12.5974 14.8503C12.5974 14.6711 12.6609 14.5166 12.7878 14.3868C12.9146 14.257 13.0677 14.1921 13.2469 14.1921C13.4261 14.1921 13.5806 14.2555 13.7104 14.3824C13.8402 14.5093 13.9051 14.6623 13.9051 14.8415C13.9051 15.0208 13.8417 15.1753 13.7148 15.3051C13.5879 15.4349 13.4349 15.4998 13.2557 15.4998Z"
          fill={fillColor}
        />
      </g>
    </svg>
  );
};


export default CalendarIcon;