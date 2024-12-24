import Link from 'next/link';
import React, { FC, useState } from 'react';
import RightArrowRoundedEdge from '../../../../public/assets/svg/right-arrow-rounded-edge';
import UserAccountCard from '@/components/ui/user-account-card';
import { useTheme } from '@/hooks/theme';
import { RootState } from '@/store/store';
import { useAppSelector } from '@/store/utils/hooks';
import ProfileIcon from '../../../../public/assets/svg/profile-icon';
import SignOutIcon from '../../../../public/assets/svg/sign-out-icon';
import DollarIcon from '../../../../public/assets/svg/dollar-icon';
import WalletIcon from '../../../../public/assets/svg/wallet-icon';
import HartSvg from '../../../../public/assets/svg/heart';
import ShoppingBagIcon from '../../../../public/assets/svg/shopping-icon';
import HomeIcon from '../../../../public/assets/svg/home-icon';
import RedirectCard from '@/components/ui/redirect-card';
import { HIDE_SELLER_FLOW } from '@/config';
import ConfirmationPopup from '@/components/ui/confirmation-popup';
import Model from '@/components/model';
type Props = {
  menuOptions: {
    item: string;
  }[];
  signOut: () => void;
};

const ProfileDropdown: FC<Props> = ({ menuOptions, signOut }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const onLogoutModalClose = () => {
    setShowLogoutModal(false);
  }
  const onLogoutClick = () => {
    setShowLogoutModal(true);
  }
  const onLogoutConfirm = () => {
    signOut();
    setShowLogoutModal(false);
  }
  const { userInfo } = useAppSelector((state: RootState) => state.auth);
  const { theme } = useTheme();
  return (
    <>
      {userInfo?._id ? (
        <>
          <div className="flex flex-col w-full rounded-none">
            <RedirectCard
              label={menuOptions[0].item}
              labelIcon={
                <ProfileIcon height="28" width="28" primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'} />
              }
              linkUrl={'/profile'}
              actionIcon={
                <RightArrowRoundedEdge
                  primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}
                  height="11"
                  width="7"
                />
              }
            />

            <RedirectCard
              label={menuOptions[2].item}
              labelIcon={<HomeIcon height="28" width="28" primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'} />}
              linkUrl={'/profile/address'}
              actionIcon={
                <RightArrowRoundedEdge
                  primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}
                  height="11"
                  width="7"
                />
              }
            />

            <RedirectCard
              label={menuOptions[3].item}
              labelIcon={
                <ShoppingBagIcon height="24" width="24" primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'} />
              }
              linkUrl={'/my-purchases'}
              actionIcon={
                <RightArrowRoundedEdge
                  primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}
                  height="11"
                  width="7"
                />
              }
            />

            <RedirectCard
              label={menuOptions[5].item}
              labelIcon={
                <HartSvg
                  height="24"
                  width="24"
                  borderColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}
                />
              }
              linkUrl={'/my-favorites'}
              actionIcon={
                <RightArrowRoundedEdge
                  primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}
                  height="11"
                  width="7"
                />
              }
            />

            {!HIDE_SELLER_FLOW && (
              <>
                <RedirectCard
                  label={menuOptions[7].item}
                  labelIcon={
                    <WalletIcon primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'} />
                  }
                  linkUrl={'/'}
                  actionIcon={
                    <RightArrowRoundedEdge
                      primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}
                      height="11"
                      width="7"
                    />
                  }
                />

                <RedirectCard
                  label={menuOptions[6].item}
                  labelIcon={
                    <DollarIcon primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'} />
                  }
                  linkUrl={'/'}
                  actionIcon={
                    <RightArrowRoundedEdge
                      primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}
                      height="11"
                      width="7"
                    />
                  }
                />
              </>
            )}

            <div
              className="  items-center rounded-b-md hover:bg-bg-tertiary-light dark:hover:bg-bg-tertiary-dark"
              onClick={onLogoutClick}
              tabIndex={0}
              role="button"
              onKeyUp={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onLogoutClick();
                }
              }}
            >
              <RedirectCard
                label={menuOptions[9].item}
                labelIcon={
                  <SignOutIcon primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'} />
                }
                actionIcon={
                  <RightArrowRoundedEdge
                    primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}
                    height="11"
                    width="7"
                  />
                }
              />
            </div>
          </div>

          <div className="block sm:hidden font-bold p-4">
            <hr
              className={`mt-5border-[1px] ${theme ? 'border-border-tertiary-light' : 'border-border-senary-light'}`}
            />

            <div className="flex flex-col font-normal text-base gap-5 mt-5">
              <Link href={'/about'}>
                <span>About Le-Offer</span>
              </Link>
              <Link href={'/blog'}>
                <span>Blog</span>
              </Link>
              <Link href={'/faq'}>
                <span>FAQ</span>
              </Link>
              <Link href={'/terms-of-service'}>
                <span>Terms of Service</span>
              </Link>
              <Link href={'/privacy-policy'}>
                <span>Privacy Policy</span>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="px-4 mt-5">
          <Link href={'/login'}>
            <UserAccountCard
              profileImage=""
              accountName="User Account Name"
              desc="Please Login to Kwibal to continue"
            />
          </Link>
          <div className="block lg:hidden font-bold p-4">
            <hr
              className={`mt-5border-[1px] ${theme ? 'border-border-tertiary-light' : 'border-border-senary-light'}`}
            />

            <div className="flex flex-col font-normal text-base gap-5 mt-5">
              <Link href={'/about'}>
                <span>About Kwibal</span>
              </Link>
              <Link href={'/blog'}>
                <span>Blog</span>
              </Link>
              <Link href={'/faq'}>
                <span>FAQ</span>
              </Link>
              <Link href={'/terms-of-service'}>
                <span>Terms of Service</span>
              </Link>
              <Link href={'/privacy-policy'}>
                <span>Privacy Policy</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <Model
          closeIconClassName="absolute right-3 top-3 cursor-pointer "
          className=" text-text-primary-light dark:text-text-primary-dark dark:bg-bg-nonary-dark rounded-[10px] w-[95%] max-w-full md:max-w-[420px]  h-fit px-4 md:px-6 py-5 bottom-0"
          onClose={onLogoutModalClose}
        >
          <ConfirmationPopup
            title="Logout"
            containerClassName="bg-transparent w-full h-full static"
            className="bg-transparent shadow-none w-full max-w-full p-0"
            confirmButtonClassName="static "
            isOpen={showLogoutModal}
            message="Are you sure you want to logout?"
            onConfirm={onLogoutConfirm}
            onClose={onLogoutModalClose}
          />
        </Model>
      )}
    </>
  );
};

export default ProfileDropdown;
