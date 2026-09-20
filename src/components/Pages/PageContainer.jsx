import React from 'react';
import Page from './Page';
import { PAGES } from '../../config/pages';

/**
 * PageContainer
 * Houses the 8 major Artifura Pages in vertical scroll sequence.
 * Each Page contains multiple scrollable sections with natural document height.
 */
export default function PageContainer({ velocity = 0 }) {
  return (
    <main
      id="artifura-pages-flow"
      role="main"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100%',
      }}
    >
      {PAGES.map((page) => (
        <Page
          key={page.id}
          page={page}
          velocity={velocity}
        />
      ))}
    </main>
  );
}
