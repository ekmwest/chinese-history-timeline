import { data } from '/data.js';



/* ==========================================================================
   Constants
   ========================================================================== */

const PIXELS_PER_YEAR = 1;
const X_AXIS_YEAR_LABEL_WIDTH = 100;



/* ==========================================================================
   Elements
   ========================================================================== */

const mainElement = document.querySelector('main');



/* ==========================================================================
   Timeline Start / End
   ========================================================================== */

const timeline = (function () {
    const dataStart = data[0].start;
    const timelineStart = Math.floor(dataStart / 500) * 500;

    const dataEnd = data[data.length - 1].end;
    const timelineEnd = Math.ceil(dataEnd / 500) * 500;

    return { start: timelineStart, end: timelineEnd };
}());

console.log(timeline);



/* ==========================================================================
   Set Main Element Width
   ========================================================================== */

(function () {
    const mainElementWidth = (timeline.end - timeline.start) * PIXELS_PER_YEAR;
    mainElement.style.width = mainElementWidth + 'px';
}());



/* ==========================================================================
   Main Periods
   ========================================================================== */

(function () {
    for (const item of data) {
        const left = (item.start - timeline.start) * PIXELS_PER_YEAR + 1 + 'px';
        const width = (item.end - item.start) * PIXELS_PER_YEAR - 2 + 'px';

        const period = createElementFromHtml(
            `<div class="period" style="left:${left}; width:${width}">
                <span class="period-name">${item.name}</span>
            </div>`
        );

        mainElement.append(period);
    }
}());



/* ==========================================================================
   X-Axis Years Labels
   ========================================================================== */

(function () {
    let year = timeline.start;

    while (year <= timeline.end) {
        const left = (year - timeline.start) * PIXELS_PER_YEAR + 'px';
        const yearElement = createElementFromHtml(
            `<div class="x-axis-year-label" style="left:${left};">
                ${toHumanYear(year)}
            </div>`
        );
        mainElement.append(yearElement);
        year += 500;
    }
}());



/* ==========================================================================
   X-Axis Years Gridlines
   ========================================================================== */

(function () {
    let year = timeline.start;

    while (year <= timeline.end) {
        const left = (year - timeline.start) * PIXELS_PER_YEAR - 1 + 'px';
        const yearElement = createElementFromHtml(
            `<div class="x-axis-year-gridline" style="left:${left};"></div>`
        );
        mainElement.append(yearElement);
        year += 500;
    }
}());



/* ==========================================================================
   Wheel Scrolling
   ========================================================================== */

window.addEventListener('wheel', event => {
    if (event.ctrlKey) return;
    event.preventDefault();
    const scrollX = Math.max(window.pageXOffset + event.deltaY, 0);
    scrollTo(scrollX, 0);
}, { passive: false });



/* ==========================================================================
   Helpers
   ========================================================================== */

function createElementFromHtml(html) {
    var template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
};

function toHumanYear(year) {
    if (year >= 0) {
        return year.toString();
    } else {
        return -1 * year + ' BC';
    }
}
