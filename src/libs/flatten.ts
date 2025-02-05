/**
 * Achata arrays aninhados em um único nível.
 *
 * [1, [2, [3, 4], 5], 6, [7, [8, [9]]]] -> [1, 2, 3, 4, 5, 6, 7, 8, 9]
 *
 * @param arr Array que será achatado.
 * @return Array achatado.
 */
export const flatten = <Arr>(arr: Array<Arr | Array<Arr>>): Arr[] => {
    return arr.reduce<Arr[]>((flat, recFlatten) => {
      return flat.concat(Array.isArray(recFlatten) ? flatten(recFlatten) : [recFlatten]);
    }, []);
  };
  