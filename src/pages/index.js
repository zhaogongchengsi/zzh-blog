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
    <header className="header-banner">
      <div className={clsx(styles.headerContainer)}>
        <div className={clsx(styles.headerLeft)}>
          <h1>{siteConfig.title} <span>的小破站</span> </h1>
          <h2>{siteConfig.tagline}</h2>
          <Link
            className={clsx(styles.homeLink)}
            to="/docs/intro">
            快速了解
          </Link>
        </div>
        <div className={clsx(styles.headerRight)}>
          <img src="/img/undraw_static_assets_rpm6.svg" className={styles.imgSvg}></img>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
