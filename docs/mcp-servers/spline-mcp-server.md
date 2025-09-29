# Spline MCP Server Integration

## Overview
The Spline MCP server provides comprehensive integration with Spline 3D scenes, enabling programmatic control of 3D objects, materials, animations, and interactions through the Model Context Protocol.

## Configuration

### Project MCP Configuration
**File**: `mcp.json`
```json
{
  "mcpServers": {
    "spline": {
      "command": "node",
      "args": [
        "spline-mcp-server/bin/cli.js",
        "--mode", "mcp",
        "--transport", "stdio"
      ],
      "env": {
        "SPLINE_API_KEY": ""
      }
    }
  }
}
```

### Cursor/Claude Desktop Configuration
**File**: `~/.cursor/mcp.json` or `~/Library/Application Support/Claude/claude_desktop_config.json`
```json
{
  "mcpServers": {
    "spline": {
      "command": "node",
      "args": [
        "C:\\Users\\Will\\OneDrive\\Documents\\Projects\\dm4\\disruptors-ai-marketing-hub\\spline-mcp-server\\bin\\cli.js",
        "--mode", "mcp",
        "--transport", "stdio"
      ],
      "env": {
        "SPLINE_API_KEY": ""
      }
    }
  }
}
```

## Installation

### Local Installation (Already Done)
The Spline MCP server is already installed in this project at:
```
spline-mcp-server/
├── bin/
│   └── cli.js          # Entry point
├── src/
│   ├── index.js        # Main server
│   ├── tools/          # 11 tool categories
│   ├── resources/      # Scene resources
│   └── prompts/        # AI prompts
├── docs/               # Documentation
└── examples/           # Usage examples
```

### Dependencies
All dependencies are installed:
- `@modelcontextprotocol/sdk@1.18.2`
- `axios@1.12.2`
- `dotenv@16.6.1`
- `express@4.21.2`
- `node-fetch@3.3.2`
- `yargs@17.7.2`
- `zod@3.25.76`

## Features

### 100+ MCP Tools Across 11 Categories

#### 1. Object Tools (`object-tools.js`)
- `getObjects` - List all objects in a scene
- `getObjectDetails` - Get detailed object information
- `createObject` - Create new 3D objects
- `updateObject` - Modify object properties
- `deleteObject` - Remove objects from scene
- `duplicateObject` - Clone existing objects
- `groupObjects` - Group multiple objects

#### 2. Material Tools (`material-tools.js`)
- `getMaterials` - List all materials
- `getMaterialDetails` - Get material properties
- `createMaterial` - Create new materials
- `updateMaterial` - Modify material properties
- `applyMaterial` - Apply materials to objects
- `createPBRMaterial` - Create PBR materials

#### 3. Scene Tools (`scene-tools.js`)
- `getSceneInfo` - Get scene metadata
- `exportScene` - Export in GLB, GLTF, FBX, OBJ formats
- `importModel` - Import external 3D models
- `optimizeScene` - Optimize for performance
- `getSceneStats` - Get performance statistics

#### 4. State & Event Tools (`state-event-tools.js`)
- `createState` - Define scene states
- `updateState` - Modify states
- `createEvent` - Set up event listeners
- `createTransition` - Define state transitions

#### 5. Action Tools (`action-tools.js`)
- `createAction` - Define custom actions
- `createAnimationAction` - Animate objects
- `createSoundAction` - Add sound effects
- `createVariableAction` - Manipulate variables

#### 6. Complete Event Tools (`complete-event-tools.js`)
Support for 20+ event types:
- Mouse events (click, hover, drag)
- Keyboard events
- Touch events
- Scroll events
- Physics events
- Custom events

#### 7. Advanced Material Tools (`advanced-material-tools.js`)
- `createLayeredMaterial` - Multi-layer materials
- `createShaderMaterial` - Custom shaders
- `createGlassMaterial` - Glass effects
- `createMetalMaterial` - Metallic materials
- `createEmissiveMaterial` - Glowing materials

#### 8. Lighting & Camera Tools (`lighting-camera-tools.js`)
- `createLight` - Add point, spot, directional lights
- `updateLight` - Modify lighting properties
- `createCamera` - Add cameras
- `updateCamera` - Modify camera properties
- `createCameraPath` - Animate camera movements
- `configureShadows` - Set up shadow rendering

#### 9. Design Tools (`design-tools.js`)
Advanced 3D design features including Hana integration:
- AI-powered scene generation
- Procedural modeling
- Advanced geometry operations
- Smart object placement

#### 10. Runtime Tools (`runtime-tools.js`)
- `generateReactCode` - Generate React component code
- `generateJavaScriptCode` - Generate vanilla JS code
- `generateNextJSCode` - Generate Next.js code
- `createEventHandler` - Create custom event handlers
- `animateObject` - Create animations programmatically

#### 11. API & Webhook Tools (`api-webhook-tools.js`)
- `createWebhook` - Set up webhooks for external data
- `createAPICall` - Make API requests
- `connectDataSource` - Connect to data sources
- `createDataVisualization` - Build data visualizations

## Usage Examples

### Example 1: Load and Manipulate Spline Scene
```javascript
// Get scene information
const sceneInfo = await getSceneInfo({ sceneId: 'my-scene' });

// List all objects
const objects = await getObjects({ sceneId: 'my-scene' });

// Update object position
await updateObject({
  sceneId: 'my-scene',
  objectId: 'cube-1',
  properties: {
    position: { x: 0, y: 100, z: 0 },
    rotation: { x: 0, y: Math.PI, z: 0 }
  }
});
```

### Example 2: Generate React Component
```javascript
// Generate React code for a scene
const code = await generateReactCode({
  sceneUrl: '/scenes/hero.splinecode',
  componentName: 'HeroScene',
  features: ['scroll-animation', 'mouse-interaction']
});
```

### Example 3: Create Interactive Animation
```javascript
// Create scroll-triggered animation
await createEvent({
  sceneId: 'my-scene',
  eventType: 'scroll',
  trigger: {
    scrollProgress: 0.5
  },
  actions: [
    {
      type: 'animate',
      objectId: 'cube-1',
      properties: {
        position: { y: 200 },
        rotation: { y: Math.PI * 2 }
      },
      duration: 1000,
      easing: 'easeInOutCubic'
    }
  ]
});
```

### Example 4: Export Scene
```javascript
// Export scene in multiple formats
await exportScene({
  sceneId: 'my-scene',
  format: 'gltf',
  options: {
    includeAnimations: true,
    optimize: true,
    maxTextureSize: 2048
  }
});
```

## Integration with Existing Components

### SplineViewer Component
```jsx
import SplineViewer from '@/components/shared/SplineViewer';

// Use MCP to control the scene
<SplineViewer
  scene="/scenes/product.splinecode"
  onLoad={(splineApp) => {
    // Access splineApp through MCP
    configureShadows({ quality: 'high' });
    updateCamera({ fov: 45 });
  }}
/>
```

### SplineScrollAnimationEnhanced Component
```jsx
import SplineScrollAnimationEnhanced from '@/components/shared/SplineScrollAnimationEnhanced';

<SplineScrollAnimationEnhanced
  scene="/scenes/hero.splinecode"
  animations={{
    scrollProgress: [
      { progress: 0, objectId: 'logo', y: 0, rotation: 0 },
      { progress: 0.5, objectId: 'logo', y: 100, rotation: Math.PI }
    ]
  }}
/>
```

## Auto-Activation Triggers

The Spline MCP orchestrator agent automatically activates when:
- Keywords mentioned: "spline", "3d", "scene", "animation", "webgl"
- Working with `.spline` or `.splinecode` files
- Modifying Spline components
- Debugging 3D performance issues
- Creating interactive animations

## Project-Specific Integration

### Current Spline Assets
```
public/
  ├── scenes/                    # Spline scene files
  │   ├── hero.splinecode
  │   └── product.splinecode
src/
  ├── components/
  │   └── shared/
  │       ├── SplineViewer.jsx              # Basic viewer
  │       ├── SplineScrollAnimation.jsx     # Scroll integration
  │       └── SplineScrollAnimationEnhanced.jsx
  ├── utils/
  │   └── splineAnimations.js               # GSAP integration
  └── hooks/
      └── useSplinePerformance.js           # Performance monitoring
```

### GSAP Integration
The Spline MCP server works seamlessly with GSAP Master MCP:
```javascript
// Coordinate Spline + GSAP animations
gsap.timeline()
  .call(() => updateObject({ objectId: 'cube', scale: 1.5 }))
  .to('.text', { opacity: 1, duration: 1 })
  .call(() => createEvent({ type: 'click', objectId: 'button' }));
```

## Performance Optimization

### Best Practices
1. **Keep polygon counts manageable**
   - Mobile: < 50k polygons
   - Desktop: < 100k polygons
   - Use `optimizeScene()` tool

2. **Optimize textures**
   - Max 2048x2048 for desktop
   - Max 1024x1024 for mobile
   - Use `exportScene()` with optimization

3. **Monitor performance**
   - Use `getSceneStats()` tool
   - Integrate with `useSplinePerformance` hook
   - Set FPS targets (60fps desktop, 30fps mobile)

4. **Lazy loading**
   - Load scenes below the fold asynchronously
   - Use progressive loading for large assets

## Troubleshooting

### Common Issues

**Issue**: MCP server not connecting
```bash
# Test the server manually
node spline-mcp-server/bin/cli.js --mode mcp --transport stdio
```

**Issue**: Scene not loading
- Verify file path (must be `/scene.splinecode`)
- Check file exists in `public/` directory
- Ensure scene is exported as `.splinecode` not `.spline`

**Issue**: Performance problems
```javascript
// Use optimization tools
await optimizeScene({
  sceneId: 'my-scene',
  reduceLOD: true,
  compressTextures: true
});

// Check stats
const stats = await getSceneStats({ sceneId: 'my-scene' });
console.log('Polygons:', stats.polygonCount);
console.log('Textures:', stats.textureMemory);
```

## API Key (Optional)

Spline doesn't currently require an API key for most operations. The `SPLINE_API_KEY` environment variable is reserved for future features like:
- Cloud scene storage
- Team collaboration
- Advanced analytics
- Premium features

For now, leave it empty or remove it from the configuration.

## Resources

### Documentation
- **Project Guide**: `SPLINE_PRODUCTION_OPTIMIZATION_GUIDE.md`
- **Integration Guide**: `src/components/shared/SplineIntegrationGuide.md`
- **Animation Setup**: `YOUR_ANIMATION_SETUP.md`
- **Agent Config**: `.claude/agents/spline-3d-orchestrator.md`

### External Links
- **Spline Official Docs**: https://docs.spline.design
- **Runtime API**: https://www.npmjs.com/package/@splinetool/runtime
- **React Integration**: https://www.npmjs.com/package/@splinetool/react-spline
- **MCP Protocol**: https://modelcontextprotocol.io

## Testing

### Verify Installation
```bash
# Test CLI
node spline-mcp-server/bin/cli.js --help

# Check dependencies
cd spline-mcp-server && npm list --depth=0

# Test server startup
node spline-mcp-server/bin/cli.js --mode mcp --verbose
```

### Test Integration
```bash
# Run project with MCP
npm run dev

# Check MCP status
npm run mcp:status

# Monitor MCP health
npm run mcp:health
```

## Next Steps

1. **Restart Claude Code** to load the new MCP server
2. **Test basic commands** like "List all Spline objects"
3. **Create a simple scene** and manipulate it through MCP
4. **Integrate with existing components** using the runtime tools
5. **Optimize existing Spline scenes** using the optimization tools

## Support

For issues with:
- **MCP Server**: Check `spline-mcp-server/docs/`
- **Spline Integration**: See project docs in `docs/`
- **Performance**: Use `useSplinePerformance` hook
- **GSAP Integration**: See `GSAP_MASTER_SETUP_GUIDE.md`