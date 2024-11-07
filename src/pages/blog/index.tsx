
import React, { useState } from 'react';
import PageBanner from '@/components/ui/page-banner';
import PageHeaderWithBreadcrumb from '@/components/ui/page-header-with-breadcrumb';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ContentSectionPageTitle from '@/components/ui/content-section-page-title';

// import { useTranslation } from 'next-i18next';

import { IMAGES } from '@/lib/images';
import Image from 'next/image';
import { gumletLoader } from '@/lib/gumlet';
import Link from 'next/link';
// import { BLOGS_POST } from '@/api/endpoints';
import { HeroSectionTypes, LinksTypes } from '../faq';
import Layout from '@/components/layout';

// Strapi setup
export interface blogsProps {
  posts: {
    data: postsItemsProps
  }
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





function Blogs({ posts }: blogsProps) {

  // const { t } = useTranslation("blogs");
  // const headerBennerSection: HeaderBennerSection = t('page.headerBennerSection', { returnObjects: true });
  // const breadcrumbLinks: BreadcrumbLinks[] = t('page.breadcrumbLinks', { returnObjects: true });
  // const blogSection: BlogSection = t('page.blogSection', { returnObjects: true });

  const [search, setSearch] = useState('');

  return (
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

        <div className='py-12 mobile:pb-0 mobile:pt-9 flex mobile:flex-col mobile:items-center justify-between  border-error'>
          <ContentSectionPageTitle className='mobile:mb-6'>Blog</ContentSectionPageTitle>
          <div className='relative max-h-[44px] mobile:h-[44px] max-w-[430px] w-full flex items-center'>
            <Image width={17} height={17} className={'absolute left-6'} src={IMAGES.SEARCH_ICON_BLACK} loader={gumletLoader} alt={'search_icon'} priority quality={75} />
            <input className='h-full w-full pl-12 pr-3 bg-bg-tertiary-light dark:bg-bg-quinary-dark outline-none rounded-lg' value={search} onChange={(e) => setSearch(e.target.value)} type='search' placeholder="Search" />
          </div>
        </div>

        <div className='py-12 pt-0 mobile:pb-[71px] mobile:pt-0 flex flex-col items-center  border-error'>
          {posts?.data?.attributes?.blog_data?.length > 0 ? posts?.data?.attributes?.blog_data?.map((item, key) => (
            <Link href={`blog/${item?.id}`} key={key} className={`flex sm:flex-col mobile:flex-col gap-6 lg:flex-row  max-w-[1103px] max-h-[308px] mobile:max-h-full sm:max-h-full ${key === 0 && 'mobile:mt-0'} mobile:mt-5 p-9 mobile:p-0 rounded-[20px] hover:cursor-pointer hover:bg-brand-color-hover dark:hover:bg-brand-color-hover-dark items-center`}>
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
  );
}

export default Blogs;

export async function getStaticProps({ locale }: { locale: string }) {
  let blogData;
  try {
    const response = await fetch('https://strapi.le-offers.com/api/blog?populate=deep');
    // const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/${BLOGS_POST}?populate=deep`);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    blogData = await response.json();


  } catch (error) {
    console.log(error);
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'blogs'])),
      posts: blogData || { data: [] },
    },
  };
}



// export async function getStaticProps({ locale }: { locale: string }) {
//   const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/${BLOGS_POST}?populate=deep`);
//   const data = await response.json();

//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ['common'])),
//       // posts: data?.data?.[0]?.attributes?.data || [],
//       posts: data || [],
//     },
//   };
// }


// import { BLOGS_POST } from '@/api/endpoints';
// import BlogPost from '@/components/Blogs';
// import GlobalLayout from '@/components/Layout/GlobalLayout';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import React from 'react';

// interface BlogPostData {
//   id: number;
//   title: string;
//   posted_by: string;
//   posted_date: string;
//   description: string;
//   cover_image?: {
//     data: {
//       attributes: {
//         url: string;
//       };
//     };
//   };
// }

// interface BlogPageProps {
//   posts: BlogPostData[];
// }

// // Define the component
// const BlogPage: React.FC<BlogPageProps> = ({ posts }) => {
//   // Render the component
//   return (
//     <GlobalLayout>
//       <div className="container mx-auto">
//         <h1 className="text-4xl font-bold mb-8 text-brand-color dark:text-text-primary-dark">All posts</h1>
//         <div className="grid gap-8">
//           {posts.map((post) => (
//             <BlogPost
//               key={post.id}
//               title={post.title}
//               posted_by={post.posted_by}
//               posted_date={post.posted_date}
//               description={post.description}
//               image={post.cover_image?.data?.attributes?.url || ''}
//             />
//           ))}
//         </div>
//       </div>
//     </GlobalLayout>
//   );
// };

// export default BlogPage;

// // Fetch data at build time
// export async function getStaticProps({ locale }: { locale: string }) {
//   const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/${BLOGS_POST}?populate=deep`);
//   const data = await response.json();
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ['common'])),
//       posts: data?.data?.[0]?.attributes?.data || [],
//     },
//   };
// }
