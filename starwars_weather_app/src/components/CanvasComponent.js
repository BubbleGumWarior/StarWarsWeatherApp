import React, { useEffect, useRef, useState } from 'react';

const CanvasComponent = ({ hyperSpace }) => {
  const canvasRef = useRef(null);

  const init = () => {

    //variables
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let pix = null;
    let imageData = null;
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    let center = null;
    let starHolder = [];
    let starBgHolder = [];
    const starHolderCount = 6666;
    let starSpeed = 20;
    const starSpeedMin = starSpeed;
    const starSpeedMax = 200;
    const starDistance = 8000;
    let fov = 300;
    const fovMin = 210;
    const fovMax = fov;
    const backgroundColor = { r: 0, g: 0, b: 0, a: 255 };
    let animationFrame = null;

  
    // Canvas Settings    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.position = 'fixed';
    canvas.style.left = '0';
    canvas.style.top = '0';
    center = { x: canvas.width / 2, y: canvas.height / 2 };

    //Image Settings
    imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    pix = imageData.data;

    //Generate Stars
    function addParticle( x, y, z, ox, oy, oz ) {
      return {        
        x: x,
        y: y,
        z: z,
        ox: ox,
        oy: oy,
        x2d: 0,
        y2d: 0,        
      };    
    };

    function addParticles() {
      for ( let i = 0; i < starHolderCount / 2; i++ ) {    
        const nz = Math.round( Math.random() * starDistance );
    
        const scale = fov / ( fov + nz ); 
    
        const w = ( canvasWidth * 3 ) / scale;
        const h = ( canvasHeight * 3 ) / scale;
        
        const x = Math.random() * w - ( w / 2 );
        const y = Math.random() * h - ( h / 2 );
        const z = nz;
    
        const colorValue = Math.floor( Math.random() * 55 ) + 25;
    
        const particle = addParticle( x, y, z, x, y, z );
        
        particle.color = { r: colorValue, g: colorValue, b: colorValue, a: 255 };
    
        starBgHolder.push( particle );    
      }
    
      for ( let i = 0; i < starHolderCount; i++ ) {        
        const nz = Math.round( Math.random() * starDistance );
    
        const x = Math.random() * 10000 - 5000;
        const y = Math.random() * 10000 - 5000;
        const z = nz;
        
        const colorValue = Math.floor( Math.random() * 155 ) + 100;
    
        const particle = addParticle( x, y, z, x, y, z );
        
        particle.color = { r: colorValue, g: colorValue, b: colorValue, a: 255 };
        particle.oColor = { r: colorValue, g: colorValue, b: colorValue, a: 255 };
        particle.w = 1;
        particle.distance = starDistance - z;
        particle.distanceTotal = Math.round( starDistance + fov - particle.w );
    
        starHolder.push( particle );    
      }    
    };

    function clearImageData() {
      for ( let i = 0, l = pix.length; i < l; i += 4 ) {    
        pix[ i ] = backgroundColor.r;
        pix[ i + 1 ] = backgroundColor.g;
        pix[ i + 2 ] = backgroundColor.b;
        pix[ i + 3 ] = backgroundColor.a;    
      }    
    };

    function setPixel( x, y, r, g, b, a ) {
      const i = ( x + y * canvasWidth ) * 4;
    
      pix[ i ]     = r;
      pix[ i + 1 ] = g;
      pix[ i + 2 ] = b;
      pix[ i + 3 ] = a;    
    };

    function setPixelAdditive( x, y, r, g, b, a ) {
      const i = ( x + y * canvasWidth ) * 4;
    
      pix[ i ]     = pix[ i ]     + r;
      pix[ i + 1 ] = pix[ i + 1 ] + g;
      pix[ i + 2 ] = pix[ i + 2 ] + b;
      pix[ i + 3 ] = a;    
    };

    function drawLine( x1, y1, x2, y2, r, g, b, a ) {
      const dx = Math.abs( x2 - x1 );
      const dy = Math.abs( y2 - y1 );
    
      const sx = ( x1 < x2 ) ? 1 : -1;
      const sy = ( y1 < y2 ) ? 1 : -1;
    
      let err = dx - dy;
    
      let lx = x1;
      let ly = y1;    
    
      while ( true ) {
    
        if ( lx > 0 && lx < canvasWidth && ly > 0 && ly < canvasHeight ) {    
          setPixel( lx, ly, r, g, b, a );    
        }
    
        if ( lx === x2 && ly === y2 ) {          
          break;          
        }
          
        const e2 = 2 * err;
    
        if ( e2 > -dx ) {     
          err -= dy; 
          lx += sx;     
        }
    
        if ( e2 < dy ) {     
          err += dx; 
          ly += sy;     
        }    
      }    
    };

    window.requestAnimFrame = ( function() {
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.msRequestAnimationFrame  
    } )();

    function render() {
      clearImageData();

      if ( hyperSpace ) {
        starSpeed += 2;

        if ( starSpeed > starSpeedMax ) {
          starSpeed = starSpeedMax;
        }
      }
      else {
        starSpeed -= 1;
        if ( starSpeed < starSpeedMin ) {
          starSpeed = starSpeedMin;
        }
      }

      if ( hyperSpace === false ) {
        fov += 0.5;
        if ( fov > fovMax ) {
          fov = fovMax;
        }
      }
      else {
        fov -= 1;
        if ( fov < fovMin ) {
          fov = fovMin;
        }
      }

      let warpSpeedValue;

      warpSpeedValue = starSpeed * ( starSpeed / ( starSpeedMax / 2 ) );

      for ( let i = 0, l = starBgHolder.length; i < l; i++ ) {

        const star = starBgHolder[ i ];
    
        const scale = fov / ( fov + star.z ); 
    
        star.x2d = ( star.x * scale ) + center.x; 
        star.y2d = ( star.y * scale ) + center.y; 
    
        if ( star.x2d > 0 && star.x2d < canvasWidth && star.y2d > 0 && star.y2d < canvasHeight ) {
    
          setPixel( star.x2d | 0, star.y2d | 0, star.color.r, star.color.g, star.color.b, 255 );
    
        }
    
      }

      for ( let i = 0, l = starHolder.length; i < l; i++ ) {

        const star = starHolder[ i ];
    
        star.z -= starSpeed;
        star.distance += starSpeed;
    
        if ( star.z < -fov + star.w ) {
    
          star.z = starDistance;
          star.distance = 0;
    
        } 
    
        //star color
    
        const distancePercent = star.distance / star.distanceTotal;
    
        star.color.r = Math.floor( star.oColor.r * distancePercent );
        star.color.g = Math.floor( star.oColor.g * distancePercent );
        star.color.b = Math.floor( star.oColor.b * distancePercent );
    
        //star draw
    
        const scale = fov / ( fov + star.z ); 
    
        star.x2d = ( star.x * scale ) + center.x; 
        star.y2d = ( star.y * scale ) + center.y; 
    
        if ( star.x2d > 0 && star.x2d < canvasWidth && star.y2d > 0 && star.y2d < canvasHeight ) {
    
          setPixelAdditive( star.x2d | 0, star.y2d | 0, star.color.r, star.color.g, star.color.b, 255 );
    
        }
    
        if ( starSpeed !== starSpeedMin ) {
    
          const nz = star.z + warpSpeedValue;
    
          const scale = fov / ( fov + nz ); 
    
          const x2d = ( star.x * scale ) + center.x; 
          const y2d = ( star.y * scale ) + center.y; 
    
          if ( x2d > 0 && x2d < canvasWidth && y2d > 0 && y2d < canvasHeight ) {
    
            drawLine( star.x2d | 0, star.y2d | 0, x2d | 0, y2d | 0, star.color.r, star.color.g, star.color.b, 255 );
    
          }
    
        }
      }

      ctx.putImageData( imageData, 0, 0 );

      animationFrame = window.requestAnimFrame( render );
    }// end of init

    addParticles();
    render();
  };

  useEffect(() => {
    init();
  }, [hyperSpace]);

  
  const canvasStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    zIndex: -1000,
  };

  return (
    <div>
      <canvas 
        ref={canvasRef} 
        style={canvasStyle}
      />
    </div>
  );
};

export default CanvasComponent;
