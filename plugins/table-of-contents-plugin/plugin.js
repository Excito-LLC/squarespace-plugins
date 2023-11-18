"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/// <reference types="jquery" />
(function () {
    var TOC_ELEMENT_CLASS = "exc-toc-container";
    // The delay for scrolling in the TOC to prevent interrupt of scrolling in page
    var SCROLL_DELAY = 5000;
    var JQUERY_POLL_INTERVAL = 300;
    var PROVIDED_CONFIG = typeof EXC_BLOG_PAGE_TOC_PLUGIN_CONFIG !== 'undefined' ? EXC_BLOG_PAGE_TOC_PLUGIN_CONFIG : {};
    var DEFAULT_CONFIG = {
        theme: null,
        target: "article .content-wrapper",
        outlineHeaderName: "Outline",
        navBarOffset: 200,
        scope: "article",
        headers: {
            h1: true,
            h2: true,
            h3: false,
            h4: false,
            h5: false,
            h6: false
        },
        assignIdsScope: "body",
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
    function mergeDeep(target) {
        var _a, _b;
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        if (!sources.length)
            return target;
        var source = sources.shift();
        if (isObject(target) && isObject(source)) {
            for (var key in source) {
                if (isObject(source[key])) {
                    if (!target[key])
                        Object.assign(target, (_a = {}, _a[key] = {}, _a));
                    mergeDeep(target[key], source[key]);
                }
                else {
                    Object.assign(target, (_b = {}, _b[key] = source[key], _b));
                }
            }
        }
        return mergeDeep.apply(void 0, __spreadArray([target], sources, false));
    }
    var PLUGIN_CONFIG = mergeDeep({}, DEFAULT_CONFIG, PROVIDED_CONFIG);
    /**
     * Assigns a unique ID to a given header element.
     *
     * @param {HTMLElement} elm - The header element to assign an ID to.
     * @param {Set<string>} conflictSet - A set of strings representing existing IDs to avoid duplicates.
     * @param {boolean} [FORCE=false] - If true, forces the assignment of a new ID even if the element already has one.
     */
    function assignHeaderId(elm, conflictSet, FORCE) {
        if (FORCE === void 0) { FORCE = false; }
        if (FORCE || !elm.id) {
            //$(this).attr("id", "heading-" + index);
            var encoding = encodeURIComponent(elm.innerText.replaceAll(" ", "-").replace(/[^a-zA-Z0-9-_]/g, ''));
            var attempt = encoding;
            var counter = 1;
            while (conflictSet.has(attempt)) {
                attempt = encoding + "-" + counter;
                counter++;
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
        var documentIdsSet = getAllIds();
        var ids = new Set(documentIdsSet);
        var headingsToAssign = $(PLUGIN_CONFIG.assignIdsScope).find(Object.entries(PLUGIN_CONFIG.assignIds).filter(function (_a) {
            var key = _a[0], value = _a[1];
            return !!value;
        }).map(function (_a) {
            var key = _a[0];
            return key;
        }).join(", "));
        headingsToAssign.each(function (index) {
            // Assign ID to the heading if it doesn't have one
            assignHeaderId($(this).get(0), ids);
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
        tocRecentTimeout = window.setTimeout(function () {
            tocClickedRecently = false;
            if (tocRecentTimeout)
                window.clearTimeout(tocRecentTimeout);
            tocRecentTimeout = null;
            setTOCActiveLink($this.data("idTarget"));
        }, SCROLL_DELAY);
    }
    /**
     * Generates the HTML for the Table of Contents (TOC) and appends it to the content wrapper.
     */
    function generateTOCHTML() {
        // Don't create if it already exists
        if ($(".".concat(TOC_ELEMENT_CLASS)).length)
            return;
        // Generate TOC
        var toc = "<div class=\"".concat(TOC_ELEMENT_CLASS, " ").concat(PLUGIN_CONFIG.theme ? PLUGIN_CONFIG.theme + " themed" : "", "\"><h2>").concat(PLUGIN_CONFIG.outlineHeaderName, "</h2><div class=\"").concat(TOC_ELEMENT_CLASS, "_wrapper\"><ul>");
        // $("h1, h2, h3, h4, h5, h6")
        headings === null || headings === void 0 ? void 0 : headings.each(function () {
            var link = "<a href='#" + $(this).attr("id") + "' data-id-target='" + $(this).attr("id") + "'>" + $(this).text() + "</a>";
            toc += "<li>" + link + "</li>";
        });
        toc += '</div></ul></div>';
        $(PLUGIN_CONFIG.target).append(toc);
    }
    /**
     * Updates the active state in the TOC based on the current scroll position in the window.
     */
    function updateTOCActive() {
        var _a;
        var $TOC = $(".".concat(TOC_ELEMENT_CLASS));
        // Get position of window scroll
        var fromTop = ((_a = $(window).scrollTop()) !== null && _a !== void 0 ? _a : 0) + PLUGIN_CONFIG.navBarOffset; // Adjust 200 based on your needs
        // Store the heading in view
        var cur = null;
        headings === null || headings === void 0 ? void 0 : headings.each(function () {
            if (!!$(this).offset() && $(this).offset().top < fromTop) {
                cur = $(this);
            }
        });
        // Get id of heading in view
        var id = cur ? cur.attr("id") : null;
        setTOCActiveLink(id);
    }
    /**
     * Sets the active link in the Table of Contents (TOC) based on the provided ID.
     *
     * @param {string} id - The id in the href of the element to set as active in the TOC.
     */
    function setTOCActiveLink(id) {
        var $TOC = $(".".concat(TOC_ELEMENT_CLASS));
        // Update TOC View
        $TOC.find("a").removeClass("active-link");
        var $active = $TOC.find("a[href='#" + id + "']").addClass("active-link");
        // Don't scroll imediately, it will interrupt any window scroll
        window.setTimeout(function () {
            if (!tocClickedRecently) {
                var scrollPos = $TOC.scrollTop() + $active.position().top - $TOC.height() / 2 + $active.height() / 2;
                $TOC.scrollTop(scrollPos);
            }
        }, 0);
    }
    /**
     * Scrolls to the anchor in the URL if it exists.
     */
    function scrollToAnchorInURL() {
        var _a;
        if (tocRecentTimeout) {
            window.clearTimeout(tocRecentTimeout);
            tocRecentTimeout = null;
        }
        tocClickedRecently = true;
        // After assigning IDs, check URL
        var initialTargetAnchor = (_a = $(location).attr('hash')) === null || _a === void 0 ? void 0 : _a.substring(1);
        ;
        if (initialTargetAnchor) {
            var t = document.getElementById(initialTargetAnchor);
            if (t)
                t.scrollIntoView();
        }
        tocRecentTimeout = window.setTimeout(function () {
            tocClickedRecently = false;
            if (tocRecentTimeout)
                window.clearTimeout(tocRecentTimeout);
            tocRecentTimeout = null;
            updateTOCActive();
        }, SCROLL_DELAY);
    }
    var tocClickedRecently = false;
    var tocRecentTimeout = null;
    // Get headers that are within scope
    // Use config headers to form comma list selector
    var headings = undefined;
    /**
     * Initializes and generates the Table of Contents (TOC) for the blog page.
     * This function should be called after the document is ready.
     */
    function excGenerateTOC() {
        $(document).ready(function () {
            headings = $(PLUGIN_CONFIG.scope).find(Object.entries(PLUGIN_CONFIG.headers).filter(function (_a) {
                var key = _a[0], value = _a[1];
                return !!value;
            }).map(function (_a) {
                var key = _a[0];
                return key;
            }).join(", "));
            assignAllHeaders();
            generateTOCHTML();
            scrollToAnchorInURL();
            // Track progress and update active link
            $(window).scroll(updateTOCActive);
            var $TOC = $(".".concat(TOC_ELEMENT_CLASS));
            $TOC.find("a").click(function () { triggerTOCUpdateAfterADelay($(this)); });
            $TOC.find("h2").click(function () { $TOC.toggleClass("active"); });
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
//# sourceMappingURL=plugin.js.map