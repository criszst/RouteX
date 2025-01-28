/**
 * Achata arrays aninhados em um único nível.
 *
 * [1, [2, [3, 4], 5], 6, [7, [8, [9]]]] -> [1, 2, 3, 4, 5, 6, 7, 8, 9]
 *
 * @param arr Array que será achatado.
 * @return Array achatado.
 */
export function flatten(arr: any[]): any[] {
    return arr.reduce((flat, recFlatten) => {
      return flat.concat(Array.isArray(recFlatten) ? flatten(recFlatten) : recFlatten);
    }, []);
  }
  