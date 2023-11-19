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

/// <reference types="jquery" />

interface CONFIG {
    theme: null | string,
    target: string,
    outlineHeaderName: string,
    navBarOffset: number,
    scope: string,
    headers: {
        h1: boolean,
        h2: boolean,
        h3: boolean,
        h4: boolean,
        h5: boolean,
        h6: boolean
    },
    assignIdsScope: "body", // accepts any selector, but most meaningful are `article` and `body`
    assignIds: {
        h1: boolean,
        h2: boolean,
        h3: boolean,
        h4: boolean,
        h5: boolean,
        h6: boolean
    }
}
declare var EXC_BLOG_PAGE_TOC_PLUGIN_CONFIG: Partial<CONFIG>;
(function () {
    const TOC_ELEMENT_CLASS = "exc-toc-container";
    // The delay for scrolling in the TOC to prevent interrupt of scrolling in page
    const SCROLL_DELAY = 5000;
    const JQUERY_POLL_INTERVAL = 300;
    const PROVIDED_CONFIG = typeof EXC_BLOG_PAGE_TOC_PLUGIN_CONFIG !== 'undefined' ? EXC_BLOG_PAGE_TOC_PLUGIN_CONFIG : {};
    const DEFAULT_CONFIG: CONFIG = {
        theme: null,
        target: "article .content-wrapper", // Where the TOC is appended
        outlineHeaderName: "Outline",
        navBarOffset: 200,
        scope: "article", // accepts any selector, but most meaningful are `article` and `body`
        headers: {
            h1: true,
            h2: true,
            h3: false,
            h4: false,
            h5: false,
            h6: false
        },
        assignIdsScope: "body", // accepts any selector, but most meaningful are `article` and `body`
        assignIds: {
            h1: true,
            h2: true,
            h3: true,
            h4: true,
            h5: true,
            h6: true
        }
    };
    /**
   * Simple object check.
   * @param item
   * @returns {boolean}
   */
    function isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }

    /**
     * Deep merge two objects.
     * @param target
     * @param ...sources
     */
    function mergeDeep(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (isObject(target) && isObject(source)) {
            for (const key in source) {
                if (isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }

        return mergeDeep(target, ...sources);
    }
    const PLUGIN_CONFIG = mergeDeep({}, DEFAULT_CONFIG, PROVIDED_CONFIG);


    /**
     * Assigns a unique ID to a given header element.
     * 
     * @param {HTMLElement} elm - The header element to assign an ID to.
     * @param {Set<string>} conflictSet - A set of strings representing existing IDs to avoid duplicates.
     * @param {boolean} [FORCE=false] - If true, forces the assignment of a new ID even if the element already has one.
     */
    function assignHeaderId(elm: HTMLElement, conflictSet, FORCE = false) {
        if (FORCE || !elm.id) {
            //$(this).attr("id", "heading-" + index);
            let encoding = encodeURIComponent(elm.innerText.replaceAll(" ", "-").replace(/[^a-zA-Z0-9-_]/g, ''));
            let attempt = encoding;
            let counter = 1;
            while (counter && conflictSet.has(attempt)) {
                // attempt = encoding + "-" + counter;
                // counter++;
                let temp = encoding + "-" + counter;
                attempt = temp;
                counter += 1;
            }
            conflictSet.add(attempt);
            elm.id = attempt;
        }
    }

    /**
     * Retrieves all the IDs present in the document.
     * 
     * @returns {string[]} An array of strings representing all the IDs in the document.
     */
    function getAllIds() {
        return $("[id]").map(function () {
            return this.id;
        }).get();
    }

    /**
     * Assigns unique IDs to all header elements specified in the PLUGIN_CONFIG.
     */
    function assignAllHeaders() {
        const documentIdsSet = getAllIds();
        const ids = new Set(documentIdsSet);
        var headingsToAssign = $(PLUGIN_CONFIG.assignIdsScope).find(Object.entries(PLUGIN_CONFIG.assignIds).filter(([key, value]) => !!value).map(([key]) => key).join(", "));
        headingsToAssign.each(function (index) {
            // Assign ID to the heading if it doesn't have one
            assignHeaderId($(this).get(0)!, ids)
        });
    }

    /**
     * Handles the scroll action of the TOC when a Table of Contents (TOC) link is clicked.
     * 
     * @param {JQuery} $this - The jQuery object representing the clicked TOC link.
     */
    function triggerTOCUpdateAfterADelay($this) {
        if (tocRecentTimeout) {
            window.clearTimeout(tocRecentTimeout);
            tocRecentTimeout = null;
        }
        tocClickedRecently = true;
        // Wait for page to finish scrolling before scrolling active link in TOC
        tocRecentTimeout = window.setTimeout(() => {
            tocClickedRecently = false;
            if (tocRecentTimeout) window.clearTimeout(tocRecentTimeout);
            tocRecentTimeout = null;
            setTOCActiveLink($this.data("idTarget"))
        }, SCROLL_DELAY)
    }

    /**
     * Generates the HTML for the Table of Contents (TOC) and appends it to the content wrapper.
     */
    function generateTOCHTML() {
        // Don't create if it already exists
        if ($(`.${TOC_ELEMENT_CLASS}`).length) return;
        // Generate TOC
        let toc = `<div class="${TOC_ELEMENT_CLASS} ${PLUGIN_CONFIG.theme ? PLUGIN_CONFIG.theme + " themed" : ""}"><h2>${PLUGIN_CONFIG.outlineHeaderName}</h2><div class="${TOC_ELEMENT_CLASS}_wrapper"><ul>`;
        // $("h1, h2, h3, h4, h5, h6")
        headings?.each(function () {
            let link = "<a href='#" + $(this).attr("id") + "' data-id-target='" + $(this).attr("id") + "'>" + $(this).text() + "</a>";
            toc += "<li>" + link + "</li>";
        });
        toc += '</div></ul></div>';
        $(PLUGIN_CONFIG.target).append(toc);
    }

    /**
     * Updates the active state in the TOC based on the current scroll position in the window.
     */
    function updateTOCActive() {
        const $TOC = $(`.${TOC_ELEMENT_CLASS}`);
        // Get position of window scroll
        let fromTop = ($(window).scrollTop() ?? 0) + PLUGIN_CONFIG.navBarOffset; // Adjust 200 based on your needs
        // Store the heading in view
        let cur: JQuery<HTMLElement> | null = null;
        headings?.each(function () {
            if (!!$(this)!.offset() && $(this).offset()!.top < fromTop) {
                cur = $(this);
            }
        });
        // Get id of heading in view
        let id = cur ? (cur as JQuery<HTMLElement>).attr("id") : null;
        setTOCActiveLink(id);
    }

    /**
     * Sets the active link in the Table of Contents (TOC) based on the provided ID.
     * 
     * @param {string} id - The id in the href of the element to set as active in the TOC.
     */
    function setTOCActiveLink(id) {
        const $TOC = $(`.${TOC_ELEMENT_CLASS}`);
        // Update TOC View
        $TOC.find("a").removeClass("active-link");
        let $active = $TOC.find("a[href='#" + id + "']").addClass("active-link");

        // Don't scroll imediately, it will interrupt any window scroll
        window.setTimeout(() => {
            if (!tocClickedRecently) {
                const scrollPos = $TOC.scrollTop()! + $active.position().top - $TOC.height()! / 2 + $active.height()! / 2;
                $TOC.scrollTop(scrollPos);
            }
        }, 0);
    }

    /**
     * Scrolls to the anchor in the URL if it exists.
     */
    function scrollToAnchorInURL() {
        if (tocRecentTimeout) {
            window.clearTimeout(tocRecentTimeout);
            tocRecentTimeout = null;
        }
        tocClickedRecently = true;
        // After assigning IDs, check URL
        const initialTargetAnchor = $(location).attr('hash')?.substring(1);;
        if (initialTargetAnchor) {
            let t = document.getElementById(initialTargetAnchor);
            if (t) t.scrollIntoView();
        }
        tocRecentTimeout = window.setTimeout(function () {
            tocClickedRecently = false;
            if (tocRecentTimeout) window.clearTimeout(tocRecentTimeout);
            tocRecentTimeout = null;
            updateTOCActive();
        }, SCROLL_DELAY)
    }


    var tocClickedRecently = false;
    var tocRecentTimeout: null | number = null;
    // Get headers that are within scope
    // Use config headers to form comma list selector
    var headings: JQuery<HTMLElement> | undefined = undefined;
    /**
     * Initializes and generates the Table of Contents (TOC) for the blog page.
     * This function should be called after the document is ready.
     */
    function excGenerateTOC() {
        $(document).ready(function () {
            headings = $(PLUGIN_CONFIG.scope).find(Object.entries(PLUGIN_CONFIG.headers).filter(([key, value]) => !!value).map(([key]) => key).join(", "))

            assignAllHeaders();
            generateTOCHTML();


            scrollToAnchorInURL();


            // Track progress and update active link
            $(window).scroll(updateTOCActive);
            const $TOC = $(`.${TOC_ELEMENT_CLASS}`);
            $TOC.find("a").click(function () { triggerTOCUpdateAfterADelay($(this)) });
            $TOC.find("h2").click(function () { $TOC.toggleClass("active") });

        });
    }
    /**
     * Waits for jQuery to be available and then initializes the TOC generation.
     */
    (function () {
        var nTimer = setInterval(function () {
            // @ts-ignore
            if (window.jQuery) {
                // Do something with jQuery
                clearInterval(nTimer);
                excGenerateTOC();
            }
        }, JQUERY_POLL_INTERVAL);
    })();

})();