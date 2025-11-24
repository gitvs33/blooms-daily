import React from 'react';
import { FlowerData, AppPhase } from '../types';

interface FlowerDisplayProps {
  flower: FlowerData;
  phase: AppPhase;
  isWithered: boolean;
}

export const FlowerDisplay: React.FC<FlowerDisplayProps> = ({ flower, phase, isWithered }) => {
  const isGrowing = phase === AppPhase.GROWING;
  // It is broken only if we are in the BROKEN phase, OR if we are in GENERATION phase and the flower is withered.
  const isBroken = phase === AppPhase.BROKEN || (phase === AppPhase.GENERATION && isWithered);

  // --- SVG PART GENERATORS ---

  // 1. Generic Petal Generator (for Daisy, etc.)
  const renderSimplePetals = (count: number, length: number, width: number, pointiness = 0) => {
    const petals = [];
    for (let i = 0; i < count; i++) {
      const rotation = (360 / count) * i;
      // pointiness: 0 = round, 1 = sharp
      const c1y = 150 - length * 0.5;
      const c2y = 150 - length;
      const tip = 150 - length;
      
      // Adjust control points for sharpness
      const w = width / 2;
      
      // Path for a single petal
      // M150 150 (center)
      // Q(150-w) (c1y) ... left edge
      // Q(150) (tip) ... tip
      
      // Simplified petal path: quadratic curves
      const d = `M150 150 
                 Q${150 - w} ${150 - length * 0.4} ${150 - w * (1-pointiness)} ${150 - length} 
                 Q${150 + w} ${150 - length * 0.4} 150 150`;

      petals.push(
        <path
          key={i}
          d={d}
          transform={`rotate(${rotation} 150 150)`}
          className={`fill-current ${flower.petalColor}`}
          stroke="rgba(0,0,0,0.05)"
          strokeWidth="1"
        />
      );
    }
    return <g>{petals}</g>;
  };

  // 2. Ruffled/Jagged (Carnation, Marigold)
  const renderRuffledFlower = () => {
    const layers = [];
    const layerCount = 4;
    for (let l = 0; l < layerCount; l++) {
      const scale = 1 - (l * 0.15);
      const rotation = l * 15;
      // Create a jagged polygon
      let d = "M150 150 ";
      const points = 20;
      const r = 55;
      for (let i = 0; i <= points; i++) {
        const angle = (Math.PI * 2 * i) / points;
        const rVar = i % 2 === 0 ? r : r * 0.8; // Zigzag
        const x = 150 + Math.cos(angle) * rVar;
        const y = 150 + Math.sin(angle) * rVar;
        d += `L${x.toFixed(1)} ${y.toFixed(1)} `;
      }
      d += "Z";

      layers.push(
        <path
          key={l}
          d={d}
          transform={`rotate(${rotation} 150 150) scale(${scale})`}
          style={{ transformOrigin: '150px 150px' }}
          className={`fill-current ${flower.petalColor}`}
          fillOpacity={0.8 + (l * 0.05)}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="1"
        />
      );
    }
    return <g>{layers}</g>;
  };

  // 3. Rose (Spiral/Layered Circles)
  const renderRose = () => {
    return (
      <g>
        {[45, 35, 25, 15, 5].map((r, i) => (
           <g key={i} transform={`rotate(${i * 65} 150 150)`}>
             <path 
                d={`M150 ${150-r} A${r} ${r} 0 1 1 150 ${150+r} A${r} ${r} 0 1 1 150 ${150-r}`}
                className={`fill-current ${flower.petalColor}`}
                fillOpacity={0.7 + (i * 0.05)}
                transform={`translate(${i % 2 === 0 ? 3 : -3}, ${i % 3 === 0 ? 3 : -3})`}
             />
             <path
               d={`M150 ${150 - r} Q${150 + r} ${150} 150 ${150 + r}`}
               fill="none"
               stroke="rgba(0,0,0,0.1)"
               strokeWidth="1"
             />
           </g>
        ))}
      </g>
    );
  };

  // 4. Violet (5 petals, asymmetric)
  const renderViolet = () => {
    // 2 top, 2 side, 1 bottom
    return (
      <g>
        {/* Top 2 */}
        <ellipse cx="135" cy="130" rx="20" ry="25" transform="rotate(-20 135 130)" className={`fill-current ${flower.petalColor}`} />
        <ellipse cx="165" cy="130" rx="20" ry="25" transform="rotate(20 165 130)" className={`fill-current ${flower.petalColor}`} />
        {/* Side 2 */}
        <ellipse cx="125" cy="155" rx="18" ry="20" transform="rotate(-10 125 155)" className={`fill-current ${flower.petalColor}`} />
        <ellipse cx="175" cy="155" rx="18" ry="20" transform="rotate(10 175 155)" className={`fill-current ${flower.petalColor}`} />
        {/* Bottom 1 */}
        <path d="M150 150 Q130 180 150 190 Q170 180 150 150" className={`fill-current ${flower.petalColor}`} />
        {/* Center markings */}
        <path d="M150 150 L150 170 M145 155 L135 165 M155 155 L165 165" stroke={flower.centerColor.replace('text-', 'stroke-')} strokeWidth="2" />
      </g>
    );
  };

  // 5. Cup Center (Daffodil/Narcissus)
  const renderCupFlower = (petalColorClass: string, isPointy: boolean) => {
    return (
      <g>
        {/* Outer Petals */}
        {renderSimplePetals(6, 60, 30, isPointy ? 0.8 : 0.2)}
        {/* Cup */}
        <circle cx="150" cy="150" r="18" className={`fill-current ${flower.centerColor}`} />
        <circle cx="150" cy="150" r="12" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
      </g>
    );
  };

  // 6. Lily of the Valley (Hanging bells)
  const renderLilyValley = () => {
    // Main stem curve is handled in renderer, but we need to draw the top curve and bells here
    // We assume the base group is at 150, 150.
    // We need to draw a stem extension curving right
    return (
      <g>
        <path d="M150 150 Q150 100 200 120" stroke="#15803d" strokeWidth="4" fill="none" />
        {/* Bells */}
        {[0.3, 0.6, 0.9].map((t, i) => {
           // simple interp along Q curve (approx)
           const x = 150 + (200-150)*t; 
           const y = 150 + (120-150)*t - (Math.sin(t*Math.PI)*20); // slight arc
           return (
             <g key={i} transform={`translate(${x}, ${y})`}>
               <path 
                 d="M0 0 Q-5 5 0 10 Q5 5 0 0 M-3 10 Q0 12 3 10 L 0 0" 
                 fill="white" 
                 stroke="#e2e8f0" 
                 transform="scale(1.5) rotate(10)" 
               />
             </g>
           );
        })}
      </g>
    );
  };

  // 7. Stalk Flowers (Larkspur, Gladiolus)
  const renderStalk = (type: 'larkspur' | 'gladiolus') => {
    // Vertical stack of blooms
    const bloomPositions = [0, -30, -60];
    return (
      <g>
        <path d="M150 150 L150 80" stroke="#15803d" strokeWidth="4" />
        {bloomPositions.map((y, i) => (
          <g key={i} transform={`translate(150, ${150 + y}) scale(${1 - i*0.1})`}>
             {type === 'larkspur' 
               ? renderSimplePetals(5, 20, 15, 0.5) // Small 5 petals
               : <path d="M0 0 Q-15 -15 0 -30 Q15 -15 0 0" className={`fill-current ${flower.petalColor}`} transform="rotate(-15)"/> // Funnel shape
             }
          </g>
        ))}
      </g>
    );
  };
  
  // 8. Lotus (Water lily style)
  const renderLotus = () => {
      // Wide, many pointed petals, radiating
      const petals = [];
      const numPetals = 16;
      for (let i = 0; i < numPetals; i++) {
        const rotation = (360 / numPetals) * i;
        const scale = i % 2 === 0 ? 1 : 0.7; // Alternating layers
        petals.push(
          <path
            key={i}
            d="M150 150 Q140 120 150 100 Q160 120 150 150"
            transform={`rotate(${rotation} 150 150) scale(1, ${scale})`}
            className={`fill-current ${flower.petalColor}`}
            stroke="rgba(0,0,0,0.1)"
          />
        );
      }
      return <g>{petals}</g>;
  };
  
  // 9. Chrysanthemum (Many thin petals)
  const renderChrysanthemum = () => {
      return renderSimplePetals(24, 55, 10, 0.2);
  };


  // --- MAIN RENDER SWITCH ---
  const renderSpecificFlower = () => {
    switch (flower.name) {
      case 'Carnation': return renderRuffledFlower();
      case 'Violet': return renderViolet();
      case 'Daffodil': return renderCupFlower(flower.petalColor, true); // Pointy
      case 'Daisy': return (
        <g>
            {renderSimplePetals(16, 50, 12, 0.2)}
            <circle cx="150" cy="150" r="12" className={`fill-current ${flower.centerColor}`} />
        </g>
      );
      case 'Lily of the Valley': return renderLilyValley();
      case 'Rose': return renderRose();
      case 'Larkspur': return renderStalk('larkspur');
      case 'Gladiolus': return renderStalk('gladiolus');
      case 'Lotus': return renderLotus();
      case 'Marigold': return renderRuffledFlower(); // Similar structure
      case 'Chrysanthemum': return renderChrysanthemum();
      case 'Narcissus': return renderCupFlower(flower.petalColor, false); // Round
      default: return renderSimplePetals(12, 50, 20); // Fallback
    }
  };


  return (
    <div className="relative w-80 h-96 flex items-end justify-center overflow-visible">
      {/* SVG Container */}
      <svg 
        className="w-full h-full overflow-visible" 
        viewBox="0 0 300 400" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="2" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>

        {/* Main Group for Animation */}
        <g 
          className={`transition-all duration-1000 origin-bottom ${isGrowing ? 'grow-animation' : ''} ${isBroken ? 'opacity-50 rotate-12 translate-y-10' : ''}`}
          style={{ transformOrigin: '150px 400px' }}
        >
          {/* Stem */}
          <path 
            d="M150 400 C150 350 145 300 150 250 C155 200 150 150 150 150" 
            stroke="#15803d" 
            strokeWidth="5" 
            fill="none" 
            strokeLinecap="round"
          />
          
          {/* Leaves - Generic but stylized */}
          <g className="origin-center">
            <path 
              d="M150 340 Q110 320 90 330 Q110 350 150 345" 
              fill="#22c55e" 
              className="origin-right"
              style={{ transformOrigin: '150px 340px' }}
            />
            <path 
              d="M150 290 Q190 270 210 280 Q190 300 150 295" 
              fill="#22c55e"
              className="origin-left"
              style={{ transformOrigin: '150px 290px' }}
            />
          </g>

          {/* Flower Head Group */}
          <g 
            className={`${isBroken ? 'snap-animation' : ''}`} 
            style={{ transformOrigin: '150px 150px' }}
            filter="url(#shadow)"
          >
             {renderSpecificFlower()}
          </g>
        </g>
      </svg>
      
      {/* Soil/Base Shadow */}
      <div className="absolute bottom-2 w-32 h-3 bg-gray-300 rounded-[100%] opacity-40 blur-sm"></div>

      {/* Meaning Thought Cloud */}
      {!isGrowing && !isBroken && (
        <div className="absolute left-[65%] bottom-[45%] w-56 z-20 fade-in" style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}>
          {/* Cloud Shape */}
          <div className="bg-white p-4 rounded-[2rem] rounded-bl-none shadow-xl border border-pink-50 text-center relative transform hover:scale-105 transition-transform duration-300">
             <p className="font-serif text-lg italic text-gray-800 leading-tight">
               {flower.meaning}
             </p>
          </div>
          {/* Thought Bubbles Trail */}
          <div className="w-3 h-3 bg-white rounded-full shadow-sm ml-2 mt-1"></div>
          <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm ml-0.5 mt-1"></div>
        </div>
      )}

    </div>
  );
};