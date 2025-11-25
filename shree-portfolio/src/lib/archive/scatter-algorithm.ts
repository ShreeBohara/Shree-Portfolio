interface Point {
  x: number;
  y: number;
}

interface ScatterOptions {
  canvasWidth: number;
  canvasHeight: number;
  imageWidth: number;
  imageHeight: number;
  minDistance: number;
}

// Generates positions using a Grid with Jitter approach for uniform distribution
export function generateScatterPositions(
  count: number,
  options: ScatterOptions
): Point[] {
  const { canvasWidth, canvasHeight, imageWidth, imageHeight } = options;
  const positions: Point[] = [];

  // Calculate grid dimensions
  // We want the grid aspect ratio to roughly match the canvas aspect ratio
  const canvasRatio = canvasWidth / canvasHeight;

  // sqrt(count * ratio) gives approx cols
  let cols = Math.ceil(Math.sqrt(count * canvasRatio));
  let rows = Math.ceil(count / cols);

  // Adjust if we have too many cells
  if (cols * rows < count) {
    rows++;
  }

  const cellWidth = canvasWidth / cols;
  const cellHeight = canvasHeight / rows;

  // Padding to keep images away from absolute edges
  const paddingX = imageWidth * 0.5;
  const paddingY = imageHeight * 0.5;

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;

    // Base position (center of cell)
    const cellCenterX = col * cellWidth + cellWidth / 2;
    const cellCenterY = row * cellHeight + cellHeight / 2;

    // Calculate max jitter allowed while keeping image roughly in cell
    // We allow overlap, so jitter can be generous
    const maxJitterX = (cellWidth - paddingX) * 0.4;
    const maxJitterY = (cellHeight - paddingY) * 0.4;

    const jitterX = (Math.random() - 0.5) * 2 * maxJitterX;
    const jitterY = (Math.random() - 0.5) * 2 * maxJitterY;

    positions.push({
      x: cellCenterX + jitterX,
      y: cellCenterY + jitterY
    });
  }

  // Shuffle positions so the sequential loading/bursting doesn't look like a typewriter
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  return positions;
}

// Calculate burst positions based on 4-step directional pattern
export function calculateBurstPositions(
  photos: any[],
  canvasWidth: number,
  canvasHeight: number
): any[] {
  const positions = generateScatterPositions(photos.length, {
    canvasWidth,
    canvasHeight,
    imageWidth: 300,
    imageHeight: 225,
    minDistance: 350,
  });

  // Helper to determine quadrant of a point
  // Returns: 0=TL(NW), 1=TR(NE), 2=BL(SW), 3=BR(SE)
  const getQuadrant = (p: Point) => {
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const isLeft = p.x < centerX;
    const isTop = p.y < centerY;
    if (isLeft && isTop) return 0; // NW
    if (!isLeft && isTop) return 1; // NE
    if (isLeft && !isTop) return 2; // SW
    return 3; // SE
  };

  // Group positions by quadrant
  const quadrantPositions: Point[][] = [[], [], [], []];
  positions.forEach(p => {
    quadrantPositions[getQuadrant(p)].push(p);
  });

  // Define the 4 steps from spec:
  // 1. NW to NE (Top Left -> Top Right)
  // 2. SW to NW (Bottom Left -> Top Left) - Note: Spec says SW->NW, but we'll use available points
  // 3. SE to NE (Bottom Right -> Top Right)
  // 4. SW to SE (Bottom Left -> Bottom Right)

  // We need to distribute the photos into 4 batches
  const batchSize = Math.ceil(photos.length / 4);
  const batches = [
    photos.slice(0, batchSize),
    photos.slice(batchSize, batchSize * 2),
    photos.slice(batchSize * 2, batchSize * 3),
    photos.slice(batchSize * 3)
  ];

  // We'll try to fulfill the directional requests by pulling from relevant quadrants
  // This is a "best effort" since random distribution might not have equal quadrant counts
  let availablePositions = [...positions];

  const getBestPositionForBatch = (batchIndex: number): Point => {
    // Define preferred quadrants for each batch based on spec
    // Batch 0: NW -> NE (Pref: 0, 1)
    // Batch 1: SW -> NW (Pref: 2, 0)
    // Batch 2: SE -> NE (Pref: 3, 1)
    // Batch 3: SW -> SE (Pref: 2, 3)
    const preferences = [
      [0, 1],    // Batch 0
      [2, 0],    // Batch 1
      [3, 1],    // Batch 2
      [2, 3]     // Batch 3
    ];

    const preferredQuads = preferences[batchIndex];

    // Try to find a position in preferred quadrants
    for (const quadIdx of preferredQuads) {
      const foundIdx = availablePositions.findIndex(p => getQuadrant(p) === quadIdx);
      if (foundIdx !== -1) {
        const [p] = availablePositions.splice(foundIdx, 1);
        return p;
      }
    }

    // Fallback: take any available position
    return availablePositions.shift() || { x: 0, y: 0 };
  };

  return batches.flatMap((batch, batchIndex) => {
    return batch.map((photo, i) => {
      const position = getBestPositionForBatch(batchIndex);

      // Center the positions relative to viewport
      let centeredX = position.x - canvasWidth / 2;
      let centeredY = position.y - canvasHeight / 2;

      // Ensure positions are within the wrap bounds to prevent jumps in DraggableCanvas
      const halfWidth = canvasWidth / 2;
      const halfHeight = canvasHeight / 2;

      // Custom wrap logic matching GSAP's utils.wrap
      const wrap = (min: number, max: number, value: number) => {
        const range = max - min;
        return ((value - min) % range + range) % range + min;
      };

      centeredX = wrap(-halfWidth, halfWidth, centeredX);
      centeredY = wrap(-halfHeight, halfHeight, centeredY);

      return {
        ...photo,
        position: {
          ...photo.position,
          x: centeredX,
          y: centeredY,
          rotation: 0, // No rotation
          // zIndex removed to maintain natural DOM order (last = top)
        },
        // Random zDepth for parallax effect (0.5 to 2.0)
        zDepth: 0.5 + Math.random() * 1.1,
        // Staggered delay based on batch
        burstDelay: batchIndex * 0.3 + i * 0.05,
      };
    });
  });
}
