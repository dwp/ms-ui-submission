import merge from 'lodash.merge';

// eslint-disable-next-line jsdoc/require-throws
/**
 * Merge the given objects. The first object given will _not_ be mutated.
 *
 * @param  { object } objects... Objects to be merged.
 * @param { ...any } objects Any to be merged.
 * @returns { object } Merged object.
 */
export default function mergeObjectsDeep(...objects) {
  // Validate
  if (!objects || !objects.length) {
    throw new Error('You must specify some objects to merge');
  }
  objects.forEach((o) => {
    if (Object.prototype.toString.call(o) !== '[object Object]') {
      throw new TypeError('Cannot merge objects of type %s', Object.prototype.toString.call(o));
    }
  });
  return merge(...objects);
}
