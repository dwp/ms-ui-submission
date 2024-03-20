import { sanitiseWaypoint, sanitiseRelativeUrl, sanitiseContextId } from './sanitise.js';
import {
    validateWaypoint
} from './utils.js';
import {
    validateMountUrl
} from './configuration-ingestor.js';

/**
 * Create a URL for use in GET requests, or links.
 *
 * If neither a waypoint or mountUrl is provided, only the query portion of the
 * URL will be returned. This is a convenience for situation where you just want
 * to append a query to an existing URL without regenerating the query each time.
 *
 * @param {object} requestObject Request object
 * @returns {string} URL
 */
export default (requestObject = {}) => {
    const {
        waypoint,
        editMode,
        editOrigin,
        contextId,
        skipTo,
        mountUrl,
    } = requestObject;
    const DEFAULT_CONTEXT_ID= 'default';

    // Mount URL
    let urlPath = '';
    if (mountUrl !== undefined) {
        validateMountUrl(mountUrl);
        urlPath = mountUrl;
    }

    // Waypoint
    if (waypoint !== undefined) {
        validateWaypoint(waypoint, { withOrigin: true });
        urlPath = `${urlPath}${sanitiseWaypoint(waypoint)}`;
    }
    const url = new URL(urlPath, 'https://base.test');

    // Edit mode and origin
    if (editMode === true) {
        url.searchParams.set('edit', '');
        if (editOrigin) {
            url.searchParams.set('editorigin', sanitiseRelativeUrl(editOrigin));
        }
    }

    // Context ID
    if (contextId && contextId !== DEFAULT_CONTEXT_ID) {
        url.searchParams.set('contextid', sanitiseContextId(contextId));
    }

    // Skip reference
    if (skipTo) {
        url.searchParams.set('skipto', sanitiseWaypoint(skipTo));
    }

    // Return path / querystring
    return !waypoint && !mountUrl ? url.search : `${url.pathname}${url.search}`;
};