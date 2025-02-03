import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/layout';
import PageHeaderWithBreadcrumb from '@/components/ui/page-header-with-breadcrumb';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { IMAGES } from '@/lib/images';
import { gumletLoader } from '@/lib/gumlet';
import PageMainHeading from '@/components/ui/page-main-heading';
import SectionTitle from '@/components/ui/section-title';
import Button, { BUTTON_TYPE_CLASSES } from '@/components/ui/button';

import { BlogSectionTypes } from '.';
import { LinksTypes } from '../faq';
import SvgWrapper from '@/components/ui/svg-wrapper';
import SVG_PATH from '@/lib/svg-path';
import { useTheme } from '@/hooks/theme';
import CustomHeader from '@/components/ui/custom-header';

export interface blogs_detailsProps {
  post: {
    data: {
      attributes: {
        breadCrumbLinks: LinksTypes[];
        blog_data: BlogSectionTypes[];
      };
    };
  };
  id: string | number;
}

function BlogsDetails({ post, id }: blogs_detailsProps) {
  const {theme} = useTheme();

  const [slugData, setSlugData] = useState<BlogSectionTypes[]>([]);
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFilter = () => {
    setSlugData(post?.data?.attributes?.blog_data?.filter((blog) => blog.id === +id));
  };

  useEffect(handleFilter, [id]);

  return (
    <>
      <CustomHeader title={slugData[0]?.title} image={slugData[0]?.cover_image?.data.attributes.url} />
      <Layout excludeHeroSection={true} stickyHeader={true}>
        {post?.data && slugData ? (
          <>
            {post?.data?.attributes?.breadCrumbLinks?.length > 0 ? (
              <PageHeaderWithBreadcrumb
                listClassName="max-w-[150px] md:max-w-[300px] truncate"
                className=" pl-0 mobile:pl-0"
                steps={post?.data.attributes.breadCrumbLinks}
                slugDetail={{ name: slugData[0]?.title, link: `${id}` }}
              ></PageHeaderWithBreadcrumb>
            ) : null}
            <div className="   mt-[50px] sm:mt-[69px] relative custom-container mx-auto sm:px-16 mobile:px-4 ">
              <div className="py-12 flex flex-col justify-between max-w-[787px] mobile:text-center  mobile:pb-9 mobile:pt-2 border-error">
                <PageMainHeading className="!leading-[40px]">{slugData[0]?.title}</PageMainHeading>
                <div className="flex mt-5 mobile:flex-col sm:flex-col lg:flex-row ">
                  <div className="flex flex-wrap justify-center sm:justify-start">
                    {/* <p className="text-text-tertiary-light flex-nowrap text-nowrap">By {slugData[0]?.posted_by}</p> */}
                    <p className=" text-text-tertiary-light flex-nowrap text-nowrap">{slugData[0]?.posted_date}</p>
                    {/* <p className="ml-4 text-text-tertiary-light flex-nowrap text-nowrap">{slugData[0]?.equipment}</p> */}
                    <div className="ml-4 flex items-center flex-nowrap text-nowrap ">
                      <SvgWrapper
                        primaryColor={theme ? '#929293' : '#57585A'}
                        viewBox="0 0 20 15"
                        path={SVG_PATH.EYE_ICON_BLACK}
                      />
                      <p className="ml-2 text-text-tertiary-light flex-nowrap text-nowrap">
                        {slugData[0]?.views} views
                      </p>
                    </div>
                  </div>
                  {slugData[0]?.socialLinks?.length > 0 ? (
                    <div className="flex lg:ml-7 mt-4 lg:mt-0 mobile:justify-center sm:justify-start lg">
                      {slugData[0]?.socialLinks?.map((socialLink) => (
                        <Link target="_blank" href={socialLink?.link} key={socialLink?.id} className="mx-2">
                          <Image
                            className="cursor-pointer border-2 rounded-full"
                            width={32}
                            height={32}
                            src={socialLink?.icon?.data?.attributes?.url}
                            alt={socialLink?.alt_text}
                          />
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="border-t-2 w-full border-border-tertiary-dark"></div>

              <div className="py-12 mobile:pb-0 mobile:pt-9 lg:px-12 flex flex-col lg:flex-row items-start justify-between border-error">
                <div className="flex-1 max-w-[654px] order-2 lg:order-1 mt-9 lg:mt-0">
                  {slugData[0]?.blog_section?.length > 0
                    ? slugData[0]?.blog_section?.map((blogDetail) => (
                        <>
                          {blogDetail.title ? (
                            <h4
                              id={blogDetail.title}
                              className="font-poppins font-semibold text-2xl text-[#202020] py-3 dark:text-white"
                            >
                              {blogDetail.title}
                            </h4>
                          ) : null}

                          {blogDetail?.slug_paragraphs?.length > 0
                            ? blogDetail?.slug_paragraphs.map((slug, id) => (
                                <p
                                  className="font-poppins font-normal text-base text-[#57585A] dark:text-text-septenary-light my-5"
                                  key={id}
                                >
                                  {slug.paragraph}
                                </p>
                              ))
                            : null}
                        </>
                      ))
                    : null}
                </div>
                <div className="flex-2 lg:ml-12 mobile:w-full sm:w-full lg:w-fit order-1 lg:order-2">
                  <div className="max-w-[440px] w-full hidden lg:inline-block">
                    <Image
                      width={440}
                      height={230}
                      className="w-full h-full"
                      src={slugData[0]?.cover_image?.data.attributes.url}
                      alt={slugData[0]?.cover_image?.data.attributes?.name}
                    />
                    <h2 className="mt-2 text-xl font-semibold text-text-primary-light dark:text-white">
                      {slugData[0]?.title}
                    </h2>
                    <div className="mt-3 text-base font-normal h-[140px] overflow-hidden text-text-tertiary-light dark:text-text-tertiary-dark">
                      {slugData[0]?.blog_section[0]?.slug_paragraphs[0]?.paragraph?.slice(0, 250)}
                    </div>
                    <Link href="https://blog.kwibal.com/blog" target="_blank">
                      <Button
                        className="mt-4 text-text-secondary-light max-w-[166px]"
                        buttonType={BUTTON_TYPE_CLASSES.primary}
                      >
                        Learn more
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-12 mobile:mt-0 max-w-full lg:max-w-[440px] border dark:border-border-tertiary-dark rounded-xl w-full p-6 ">
                    <SectionTitle className="text-center">Table of Contents</SectionTitle>
                    <ul className="list-disc">
                      {slugData[0]?.blog_section.length > 0
                        ? slugData[0]?.blog_section.map((blogTitle, id) =>
                            blogTitle.title ? (
                              <li
                                key={id}
                                className="ml-6 mt-5 underline hover:cursor-pointer dark:text-text-tertiary-dark"
                              >
                                <span
                                  tabIndex={0}
                                  role="button"
                                  onKeyUp={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      scrollToHeading(blogTitle.title);
                                    }
                                  }}
                                  onClick={() => scrollToHeading(blogTitle.title)}
                                >
                                  {blogTitle.title}
                                </span>
                              </li>
                            ) : null
                          )
                        : null}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <h3 className="font-primary text-5xl font-extralight h-screen flex justify-center items-center">
            No Blog found
          </h3>
        )}
      </Layout>
    </>
  );
}

export default BlogsDetails;

export async function getServerSideProps({
  locale,
  query,
}: {
  locale: string;
  query: {
    id: string;
  };
}) {
  let blogDetailData;
  try {
    // const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/${BLOGS_POST}?populate[blog_data][filters][id][$eq]=${query.id}&populate[breadCrumbLinks]=deep`);
    const response = await fetch(
      'https://strapi.le-offers.com/api/blog?populate=blog_data.cover_image&populate=blog_data.blog_section.slug_paragraphs&populate=blog_data.socialLinks.icon&populate=blod_data.cover_image&populate=breadCrumbLinks'
    );

    blogDetailData = await response.json();
  } catch (error) {
    console.log(error);
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'blogs-details'])),
      post: blogDetailData || { data: {} },
      id: query.id,
    },
  };
}
