interface BoundingBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface VisibleElement {
  selector: string;
  boundingBox: BoundingBox;
  text: string;
}

interface PageMetadata {
  url: string;
  dimensions: {
    width: number;
    height: number;
  };
  timestamp: string;
  layoutHash: string;
}

interface PageData {
  domData: {
    visibleElements: VisibleElement[];
  };
  metadata: PageMetadata;
}

interface CompressedElement {
  s: string;
  b: [number, number, number, number];
  t: string;
}

interface CompressedPageData {
  d: CompressedElement[];
  m: {
    u: string;
    d: [number, number];
    ts: string;
    h: string;
  };
}

export function serializePageData(pageData: PageData): string {
  return JSON.stringify(pageData);
}

export function deserializePageData(serializedData: string): PageData {
  return JSON.parse(serializedData);
}

export function compressPageData(pageData: PageData): string {
  // Create a more compact representation of the data
  const compressed: CompressedPageData = {
    d: pageData.domData.visibleElements.map((el) => ({
      s: el.selector,
      b: [
        el.boundingBox.left,
        el.boundingBox.top,
        el.boundingBox.width,
        el.boundingBox.height,
      ],
      t: el.text,
    })),
    m: {
      u: pageData.metadata.url,
      d: [
        pageData.metadata.dimensions.width,
        pageData.metadata.dimensions.height,
      ],
      ts: pageData.metadata.timestamp,
      h: pageData.metadata.layoutHash,
    },
  };

  return JSON.stringify(compressed);
}

export function decompressPageData(compressedData: string): PageData {
  const data = JSON.parse(compressedData) as CompressedPageData;

  return {
    domData: {
      visibleElements: data.d.map((el) => ({
        selector: el.s,
        boundingBox: {
          left: el.b[0],
          top: el.b[1],
          width: el.b[2],
          height: el.b[3],
        },
        text: el.t,
      })),
    },
    metadata: {
      url: data.m.u,
      dimensions: {
        width: data.m.d[0],
        height: data.m.d[1],
      },
      timestamp: data.m.ts,
      layoutHash: data.m.h,
    },
  };
}
