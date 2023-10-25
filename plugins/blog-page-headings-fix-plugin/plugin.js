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

// IIFE (Immediately Invoked Function Expression) / Self-Executing Anonymous Function
// Preserves global scope
(function () {
  var PROVIDED_CONFIG = typeof EXC_BLOG_PAGE_HEADINGS_PLUGIN_CONFIG !== 'undefined' ? EXC_BLOG_PAGE_HEADINGS_PLUGIN_CONFIG : {};
  var DEFAULT_CONFIG = {
    fixAnimationBug: false,
  };
  var PLUGIN_CONFIG = Object.assign({}, DEFAULT_CONFIG, PROVIDED_CONFIG);

  function fixIndividualHeading(original) {
    var newElement = document.createElement('h2');

    // Copy over attributes from the original to the new element
    for (var i = 0; i < original.attributes.length; i++) {
      var attr = original.attributes[i];
      if (PLUGIN_CONFIG.fixAnimationBug) {
        if (attr.name = "class") {
          // Hack to remove 'pre' classes that might block animating in
          const value = attr.value.split(' ').filter(className => !className.startsWith('pre')).join(' ');
          newElement.setAttribute(attr.name, value);
          continue;
        }
      }
      newElement.setAttribute(attr.name, attr.value);
    }

    // Copy over children from the original to the new element
    while (original.firstChild) {
      newElement.appendChild(original.firstChild);
    }

    // Replace the original with the new element
    original.parentNode.replaceChild(newElement, original);
    return newElement;
  }
  function fixHeadings() {

    // Find all blog post titles
    var falseTitles = document.querySelectorAll('h1.blog-title');

    // Loop through each <h1> element and replace it with an <h2> element
    falseTitles.forEach(fixIndividualHeading);
  }

  function init() {
    // Sanity Check
    var h1s = document.querySelectorAll('h1');
    if (h1s.length <= 1) return;

    // Run the function on page load
    fixHeadings();

    // To handle if any elements are async loaded in after document ready
    // Observe mutations in the document to handle newly added elements
    // Be very careful not to create loop by creating what is being looked for
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          console.log(mutation.addedNodes)
          const addedElements = Array.from(mutation.addedNodes).filter(node => node.tagName === 'H1' && node.getAttribute("class") && node.getAttribute("class").split(" ").some(cls => cls === "blog-title"));
          addedElements.forEach(fixIndividualHeading);
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

  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      init();
    });
  }
})();