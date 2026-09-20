import React from 'react';
import PageSection from './PageSection';
import PageEndIndicator from './PageEndIndicator';

/**
 * Page
 * Represents one of the 8 major Artifura Pages.
 * A contained scrollable world with natural document height.
 * Closes with the architectural PageEndIndicator where scrolling halts.
 */
export default function Page({
  page,
  nextPage = null,
  velocity = 0,
  onNavigateNext = () => {},
}) {
  return (
    <article
      id={page.id}
      className="artifura-page"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
      }}
      aria-label={`Page ${page.number} - ${page.title}`}
    >
      {/* Scrollable Sections within this Page */}
      <div className="page-sections-wrapper">
        {page.sections.map((section) => (
          <PageSection
            key={section.id}
            section={section}
            pageNumber={page.number}
            velocity={velocity}
          />
        ))}
      </div>

      {/* Architectural End-of-Page Boundary Marker */}
      <PageEndIndicator
        pageNumber={page.number}
        pageTitle={page.title}
        nextPage={nextPage}
        onNavigateNext={onNavigateNext}
      />
    </article>
  );
}
