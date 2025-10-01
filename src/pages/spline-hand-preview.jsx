import React, { useRef, useState, useCallback } from 'react';
import Spline from '@splinetool/react-spline';

/**
 * Spline Hand Scene Preview
 *
 * Development page to inspect the services_hand Spline scene
 * and explore available objects, animations, and interactions
 */
export default function SplineHandPreview() {
  const splineRef = useRef(null);
  const [sceneInfo, setSceneInfo] = useState({
    loaded: false,
    objects: [],
    selectedObject: null,
    error: null
  });

  const handleSplineLoad = useCallback((splineApp) => {
    console.log('🎨 Spline scene loaded successfully');
    console.log('Spline App:', splineApp);

    splineRef.current = splineApp;

    // Explore scene structure
    try {
      // Get all objects in the scene
      const allObjects = [];

      // Try to enumerate scene objects
      if (splineApp._scene) {
        console.log('Scene structure:', splineApp._scene);

        // Recursively find all objects
        const findObjects = (obj, depth = 0) => {
          if (!obj) return;

          const indent = '  '.repeat(depth);
          console.log(`${indent}Object:`, obj.name || 'unnamed', {
            type: obj.type,
            position: obj.position,
            rotation: obj.rotation,
            scale: obj.scale,
            visible: obj.visible
          });

          if (obj.name) {
            allObjects.push({
              name: obj.name,
              type: obj.type,
              position: obj.position ? { ...obj.position } : null,
              rotation: obj.rotation ? { ...obj.rotation } : null,
              scale: obj.scale ? { ...obj.scale } : null,
              visible: obj.visible
            });
          }

          if (obj.children && obj.children.length > 0) {
            obj.children.forEach(child => findObjects(child, depth + 1));
          }
        };

        findObjects(splineApp._scene);
      }

      // Try common object names
      const commonNames = [
        'Hand', 'hand', 'Hand_Model', 'HandModel',
        'Finger', 'finger', 'Thumb', 'thumb',
        'Palm', 'palm', 'Wrist', 'wrist',
        'Camera', 'camera', 'MainCamera',
        'Light', 'light', 'DirectionalLight',
        'Group', 'group', 'Scene', 'scene'
      ];

      commonNames.forEach(name => {
        try {
          const obj = splineApp.findObjectByName(name);
          if (obj) {
            console.log(`✅ Found object: ${name}`, obj);
            if (!allObjects.some(o => o.name === name)) {
              allObjects.push({
                name,
                type: obj.type,
                position: obj.position ? { ...obj.position } : null,
                rotation: obj.rotation ? { ...obj.rotation } : null,
                scale: obj.scale ? { ...obj.scale } : null,
                visible: obj.visible
              });
            }
          }
        } catch (e) {
          // Object not found, skip
        }
      });

      console.log('📦 All found objects:', allObjects);

      setSceneInfo({
        loaded: true,
        objects: allObjects,
        selectedObject: allObjects[0] || null,
        error: null
      });

    } catch (error) {
      console.error('❌ Error exploring scene:', error);
      setSceneInfo(prev => ({
        ...prev,
        loaded: true,
        error: error.message
      }));
    }
  }, []);

  const handleSplineError = useCallback((error) => {
    console.error('❌ Spline scene failed to load:', error);
    setSceneInfo(prev => ({
      ...prev,
      loaded: true,
      error: error.message
    }));
  }, []);

  const testObjectAnimation = (objectName) => {
    if (!splineRef.current) return;

    try {
      const obj = splineRef.current.findObjectByName(objectName);
      if (obj) {
        console.log(`🎬 Testing animation on: ${objectName}`, obj);

        // Test rotation
        obj.rotation.y += Math.PI / 4;

        // Test scale
        const currentScale = obj.scale.x;
        obj.scale.set(currentScale * 1.2, currentScale * 1.2, currentScale * 1.2);

        console.log('✨ Animation applied');
      } else {
        console.log('⚠️ Object not found:', objectName);
      }
    } catch (error) {
      console.error('❌ Animation test failed:', error);
    }
  };

  const testSplineEvent = (eventType) => {
    if (!splineRef.current) return;

    try {
      console.log(`🎪 Testing Spline event: ${eventType}`);
      splineRef.current.emitEvent('mouse', eventType);
      console.log('✨ Event emitted');
    } catch (error) {
      console.error('❌ Event test failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Control Panel */}
      <div className="fixed top-0 left-0 w-96 h-full bg-black/90 text-white p-6 overflow-y-auto z-50 border-r border-gray-700">
        <h1 className="text-2xl font-bold mb-4">Spline Hand Preview</h1>

        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-2">Scene Status</div>
          <div className={`px-3 py-2 rounded ${sceneInfo.loaded ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'}`}>
            {sceneInfo.loaded ? 'Loaded' : 'Loading...'}
          </div>
        </div>

        {sceneInfo.error && (
          <div className="mb-6 p-4 bg-red-900/50 text-red-300 rounded">
            <div className="font-bold mb-2">Error</div>
            <div className="text-sm">{sceneInfo.error}</div>
          </div>
        )}

        {/* Scene Objects */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">Scene Objects ({sceneInfo.objects.length})</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {sceneInfo.objects.length === 0 && sceneInfo.loaded && (
              <div className="text-sm text-gray-500 italic">No named objects found. Check console for scene structure.</div>
            )}
            {sceneInfo.objects.map((obj, index) => (
              <div
                key={index}
                className="p-3 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => setSceneInfo(prev => ({ ...prev, selectedObject: obj }))}
              >
                <div className="font-bold text-sm">{obj.name}</div>
                <div className="text-xs text-gray-400">{obj.type}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Object Details */}
        {sceneInfo.selectedObject && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3">Object Details</h2>
            <div className="bg-gray-800 rounded p-4 text-xs font-mono">
              <div className="mb-2">
                <span className="text-blue-400">name:</span> {sceneInfo.selectedObject.name}
              </div>
              <div className="mb-2">
                <span className="text-blue-400">type:</span> {sceneInfo.selectedObject.type}
              </div>
              {sceneInfo.selectedObject.position && (
                <div className="mb-2">
                  <span className="text-blue-400">position:</span>
                  <div className="ml-4">
                    x: {sceneInfo.selectedObject.position.x?.toFixed(2)}<br/>
                    y: {sceneInfo.selectedObject.position.y?.toFixed(2)}<br/>
                    z: {sceneInfo.selectedObject.position.z?.toFixed(2)}
                  </div>
                </div>
              )}
              {sceneInfo.selectedObject.rotation && (
                <div className="mb-2">
                  <span className="text-blue-400">rotation:</span>
                  <div className="ml-4">
                    x: {sceneInfo.selectedObject.rotation.x?.toFixed(2)}<br/>
                    y: {sceneInfo.selectedObject.rotation.y?.toFixed(2)}<br/>
                    z: {sceneInfo.selectedObject.rotation.z?.toFixed(2)}
                  </div>
                </div>
              )}
              {sceneInfo.selectedObject.scale && (
                <div className="mb-2">
                  <span className="text-blue-400">scale:</span>
                  <div className="ml-4">
                    x: {sceneInfo.selectedObject.scale.x?.toFixed(2)}<br/>
                    y: {sceneInfo.selectedObject.scale.y?.toFixed(2)}<br/>
                    z: {sceneInfo.selectedObject.scale.z?.toFixed(2)}
                  </div>
                </div>
              )}
              <div>
                <span className="text-blue-400">visible:</span> {sceneInfo.selectedObject.visible ? 'true' : 'false'}
              </div>
            </div>

            <button
              onClick={() => testObjectAnimation(sceneInfo.selectedObject.name)}
              className="mt-3 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors"
            >
              Test Animation
            </button>
          </div>
        )}

        {/* Event Testing */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">Test Events</h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => testSplineEvent('mouseDown')}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
            >
              mouseDown
            </button>
            <button
              onClick={() => testSplineEvent('mouseUp')}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
            >
              mouseUp
            </button>
            <button
              onClick={() => testSplineEvent('mouseHover')}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
            >
              mouseHover
            </button>
            <button
              onClick={() => testSplineEvent('keyDown')}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
            >
              keyDown
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-500 border-t border-gray-700 pt-4">
          <div className="font-bold mb-2">Instructions</div>
          <ul className="list-disc list-inside space-y-1">
            <li>Check browser console for detailed logs</li>
            <li>Click objects to view details</li>
            <li>Test animations and events</li>
            <li>Inspect object properties for scroll integration</li>
          </ul>
        </div>
      </div>

      {/* Spline Scene */}
      <div className="ml-96 h-screen relative bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Spline
          scene="https://prod.spline.design/XBh0IU16gBCVNZ0V/scene.splinecode"
          onLoad={handleSplineLoad}
          onError={handleSplineError}
          style={{
            width: '100%',
            height: '100%',
          }}
        />

        {/* Scene Info Overlay */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-3 rounded-lg text-sm">
          <div className="font-bold mb-1">Scene URL</div>
          <div className="text-xs text-gray-300 font-mono break-all">
            https://prod.spline.design/XBh0IU16gBCVNZ0V/scene.splinecode
          </div>
        </div>
      </div>
    </div>
  );
}
