declare module "simpleheat" {
  interface SimpleHeat {
    data(points: Array<[number, number, number]>): SimpleHeat;
    draw(): void;
    radius(r: number, blur?: number): SimpleHeat;
    max(max: number): SimpleHeat;
    add(point: [number, number, number]): SimpleHeat;
    clear(): SimpleHeat;
  }

  function simpleheat(canvas: HTMLCanvasElement): SimpleHeat;
  export default simpleheat;
}
