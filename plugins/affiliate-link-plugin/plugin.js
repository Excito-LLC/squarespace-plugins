/*
 * Copyright (c) 2023 Malchiel Daniel Rodrigues (Excito LLC)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */



// Function to parse and update anchor tags with URL parameters
// Note: this does not remove parameters in the off chance that they were set independent of the plugin use.
// Generic function for easier testing, allowing object instead of node/element
function parseAndModifyAnchorGeneric(href, anchor) {
  // Completely functional minimal approach but does not support legacy functionality or delimiters from other plugins
  // if (href) {
  //   // Parse the href to get the query parameters
  //   const queryString = href.split('?').length > 1 ? href.split('?')[1] : href.split('&').slice(1).join("&");
  //   if (queryString) {
  //     const queryParams = new URLSearchParams(queryString);
  //     const relParam = queryParams.get('rel');
  //     const targetParam = queryParams.get('target');

  //     if (relParam !== null) {
  //       anchor.rel = relParam;
  //     }

  //     if (targetParam !== null) {
  //       anchor.target = targetParam;
  //     }
  //   }
  // }

  // Designed to support both URL queries, malformed URLs where `&` is used without `?`, and `#` delimiter from other plugins
  const parts = href.split(/[?&#]/);

  // Look for parameters in each part (excluding the first part, which is the base URL)
  for (let i = 1; i < parts.length; i++) {
    const queryString = parts[i];
    if (queryString) {
      const queryParams = new URLSearchParams(queryString);
      const relParam = queryParams.get('rel');
      const targetParam = queryParams.get('target');

      if (relParam !== null) {
        anchor.rel = relParam;
      }

      if (targetParam !== null) {
        anchor.target = targetParam;
      }
    }
  }
  return anchor;
}



(function () {
  function parseAndModifyAnchor(anchor) {
    const href = anchor.getAttribute('href');

    return parseAndModifyAnchorGeneric(href, anchor);
  }

  // Function to parse and modify all anchor tags
  function parseAndModifyAnchors() {
    const anchors = document.querySelectorAll('a');
    anchors.forEach(parseAndModifyAnchor);
  }

  function init() {
    // Run the function on page load
    parseAndModifyAnchors();

    // Observe mutations in the document to handle newly added anchor tags
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          const addedAnchors = Array.from(mutation.addedNodes).filter(node => node.tagName === 'A');
          addedAnchors.forEach(parseAndModifyAnchor);
        }
      });
    });

    // Define the target node (the entire document)
    const targetNode = document.documentElement;

    // Configuration for the observer (observe changes to child elements)
    const config = { childList: true, subtree: true };

    // Start observing the document for changes
    observer.observe(targetNode, config);
  }

  // Only init when in browser (and not in Jest)
  if (typeof window !== 'undefined') {
    if (document.readyState !== 'loading') {
      init();
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        init();
      });
    }
  }

})();



// Export the function so that it can be imported in other modules (including Jest tests)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = {
    parseAndModifyAnchorGeneric,
  };
}