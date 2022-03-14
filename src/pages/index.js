import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.headerBanner}>
      <div className={clsx(styles.desc, "homeDescBackaged")}>
            <h1>{siteConfig.title} <span>的小破站</span> </h1>
            <h2>{siteConfig.tagline}</h2>
            <div className={clsx(styles.homelinks)}>
              <Link
                className={clsx(styles.homeLink)}
                to="/docs/intro">
                快速了解
              </Link>
              <Link
                className={clsx(styles.homeLink)}
                to="/docs/paste">
                快速黏贴
              </Link>
            </div>
        </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}-- zzhblog, ZZHBLOG, ZZH_BLOG, zzh的个人博客`}
      description="zzh 的个人博客">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
