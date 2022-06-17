import React from 'react'
import clsx from 'clsx'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import styles from './index.module.css'

const description = `我是程序员五六七，程序员排行榜一万七千三百六十九位，最擅长写屎山代码，一直以优质的服务和亲民的价格深受村民的喜爱，目前的情感状况是单身，不如一起去喝杯东西交流`

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={styles.headerBanner}>
      <img
        src={`${siteConfig.baseUrl}img/tbs_animated.svg`}
        className={styles.headerBannerImg}
        alt="tbs"
      />
      <div className={clsx(styles.desc)}>
        <h1>
          {siteConfig.title} <span>的小破站</span>{' '}
        </h1>
        {/* <h2>{siteConfig.tagline}</h2> */}
        <p className={clsx(styles.homeDesc)}>{description}</p>
        <div className={clsx(styles.homelinks)}>
          <Link className={clsx(styles.homeLink)} to="/docs/intro">
            随便看看
          </Link>
          <Link className={clsx(styles.homeLink)} to="/docs/paste">
            快速黏贴
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`${siteConfig.title}-- zzhblog, ZZHBLOG, ZZH_BLOG, zzh的个人博客`}
      description={description}
    >
      <main>
        <HomepageHeader />
      </main>
    </Layout>
  )
}
