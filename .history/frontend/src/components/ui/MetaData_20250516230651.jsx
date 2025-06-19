import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet'; // You'll need to install this: npm install react-helmet
import { APP_NAME } from '../../config/constants';

/**
 * MetaData component for SEO and document head management
 * Uses react-helmet to manage document head
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page meta description
 * @param {string} props.keywords - Page meta keywords
 * @param {string} props.ogImage - Open Graph image URL
 * @param {string} props.canonicalUrl - Canonical URL for SEO
 * @returns {React.Component} - MetaData component
 */
const MetaData = ({
  title,
  description,
  keywords,
  ogImage,
  canonicalUrl,
}) => {
  const pageTitle = title ? `${title} | ${APP_NAME}` : APP_NAME;
  
  return (
    <Helmet>
      <title>{pageTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      {description && <meta property="og:description" content={description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Helmet>
  );
};

MetaData.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  ogImage: PropTypes.string,
  canonicalUrl: PropTypes.string,
};

export default MetaData;
