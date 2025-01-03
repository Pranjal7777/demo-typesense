
import React, { useState } from 'react';
import PageBanner from '@/components/ui/page-banner';
import PageHeaderWithBreadcrumb from '@/components/ui/page-header-with-breadcrumb';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ContentSectionPageTitle from '@/components/ui/content-section-page-title';
import Image from 'next/image';
import Link from 'next/link';
import { HeroSectionTypes, LinksTypes } from '../faq';
import Layout from '@/components/layout';
import { STRAPI_ACCESS_TOKEN, STRAPI_BASE_URL } from '@/config';
import { SeoData } from '@/store/types/strapi-seo-types';
import CustomHeader from '@/components/ui/custom-header';

export interface blogsProps {
  posts: {
    data: postsItemsProps;
  };
  blogSeoData: {
    data: {
      seo: SeoData;
    };
  };
}



export type BlogSectionTypes = {
  id: number,
  title: string,
  tags: string,
  posted_by: string,
  equipment: string,
  views: string,
  posted_date: string,
  cover_image: {
    data: {
      attributes: {
        name: string,
        url: string,
        width: number,
        height: number
      }
    }
  },
  socialLinks: {
    id: number,
    title: string,
    alt_text: string,
    link: string,
    icon: {
      data: {
        attributes: {
          url: string,
          name: string,
        }
      }
    }
  }[],
  blog_section: {
    id: number,
    title: string,
    slug_paragraphs: {
      paragraph: string
    }[]
  }[]
}


export type postsItemsProps = {
  id: number,
  attributes: {
    heroSection: HeroSectionTypes,
    breadCrumbLinks: LinksTypes[],
    blog_data: BlogSectionTypes[]
  }
}





function Blogs({ posts, blogSeoData }: blogsProps) {
  const seoData = blogSeoData?.data?.seo;

  return (
    <>
    <CustomHeader title={seoData?.title} description={seoData?.description} image={seoData?.image?.url} url={seoData?.url}/>
      <Layout excludeHeroSection={true} stickyHeader={true}>
        {posts?.data?.attributes?.breadCrumbLinks?.length > 0 ? <PageHeaderWithBreadcrumb className='' steps={posts?.data?.attributes?.breadCrumbLinks
        }></PageHeaderWithBreadcrumb> : null}
      <div className=" mt-[50px] sm:mt-[69px] relative custom-container mx-auto sm:px-16 mobile:px-4 ">
        {posts?.data?.attributes?.heroSection ? <PageBanner
          bannerUrlForMobile={posts?.data?.attributes?.heroSection?.heroImage?.cover_image?.data?.attributes?.url}
          bannerUrlForWeb={posts?.data?.attributes?.heroSection?.heroImage?.cover_image?.data?.attributes?.url}
          headerText={posts?.data?.attributes?.heroSection?.title}
          headerDescription={posts?.data?.attributes?.heroSection?.subtitle}
        /> : null}

        <div className='py-8 mobile:pb-0 mobile:pt-9 flex mobile:flex-col mobile:items-center justify-between  border-error'>
          <ContentSectionPageTitle className='mobile:mb-6 sm:mb-0'>Blog</ContentSectionPageTitle>
        </div>

        <div className='py-12 pt-0 mobile:pb-[71px] mobile:pt-0 flex flex-col items-center  border-error'>
          {posts?.data?.attributes?.blog_data?.length > 0 ? posts?.data?.attributes?.blog_data?.map((item, key) => (
            <Link href={`blog/${item?.id}`} key={key} className={`flex sm:flex-col mobile:flex-col gap-6 lg:flex-row  max-w-[1103px] max-h-[308px] mobile:max-h-full sm:max-h-full ${key === 0 && 'mobile:mt-0'} mobile:mt-5 p-9 mobile:p-0 rounded-[20px] hover:cursor-pointer hover:bg-brand-color-hover items-center`}>
              <div className='relative lg:w-[482px] h-[236px] w-full overflow-hidden rounded-xl'>
                <Image
                  src={item?.cover_image?.data?.attributes?.url}
                  alt={item?.cover_image?.data?.attributes?.name}
                  layout='fill'
                  objectFit='cover'
                  priority
                  quality={75}
                  className=''
                />
              </div>
              <div className=' lg:w-[50%] max-w-[521px] flex flex-col items-end pr-5'>
                <div className=' text-base font-semibold text-brand-color'>{item?.posted_date}</div>
                <div className=' ml-7 mobile:ml-0 mt-5'>
                  <div className='text-xl font-semibold text-text-primary-light dark:text-text-primary-dark'>{item?.title}</div>
                  <div className='mt-4 text-base font-normal h-[140px] overflow-hidden text-text-tertiary-light dark:text-text-tertiary-dark'>{item?.blog_section[0]?.slug_paragraphs[0]?.paragraph?.slice(0, 250)}</div>
                </div>
              </div>
            </Link>
          ))
            : <h2 className='font-primary text-3xl font-extralight dark:text-white'>No Blogs found</h2>}
        </div>
        </div>
      </Layout>
    </>
  );
}

export default Blogs;

export async function getStaticProps({ locale }: { locale: string }) {
  let blogData = {};
  let blogSeoData = {};
  try {
    
    const promises = [
      fetch(`https://strapi.le-offers.com/api/blog?populate=deep`),
      fetch(`${STRAPI_BASE_URL}/api/blog?populate=seo.image`, {
        headers: { Authorization: `${STRAPI_ACCESS_TOKEN}` },
      }),
    ];

    const listingApiReponses = await Promise.allSettled(promises);

    const response1 = listingApiReponses[0].status === 'fulfilled' ? listingApiReponses[0].value : null;
    const response2 = listingApiReponses[1].status === 'fulfilled' ? listingApiReponses[1].value : null;

    if (response1) {
      blogData = await response1?.json();
    }
    if (response2) {
      blogSeoData = await response2?.json();
    }

  } catch (error) {
    console.log(error);
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'blogs'])),
      posts: blogData || { data: [] },
      blogSeoData: blogSeoData || {},
    },
  };
}

