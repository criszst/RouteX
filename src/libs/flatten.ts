/**
 * Flatten an array of arrays into a single level.
 *
 * [1, [2, [3, 4], 5], 6, [7, [8, [9]]]] -> [1, 2, 3, 4, 5, 6, 7, 8, 9]
 *
 * @param arr Array to be flattened.
 * @return Array flattened.
 */

export const flatten = <Arr>(arr: Array<Arr | Array<Arr>>): Arr[] => {
    return arr.reduce<Arr[]>((flat, recFlatten) => {
      return flat.concat(Array.isArray(recFlatten) ? flatten(recFlatten) : [recFlatten]);
    }, []);
  };
