import React, { useState, useRef, useEffect } from 'react';
import p5 from 'p5';
import somRegar from './assets/som-regar.mp3';
import './App.css';

const App = () => {
  const sketchRef = useRef();
  const [stage, setStage] = useState(0);  // O estado que controla o crescimento
  const [cloudPositions, setCloudPositions] = useState([50, 200, 350]);

  useEffect(() => {
    const s = (p) => {
      let angle = 0;
      let clouds = [...cloudPositions];
      let skyColor;

      p.setup = () => {
        const canvas = p.createCanvas(800, 500);
        canvas.parent(sketchRef.current);
        p.frameRate(30);
      };

      p.draw = () => {
        //background
        skyColor = p.lerpColor(p.color('#7FFFD4'), p.color('#7FFFD4'), 1);
        p.background(skyColor);

        //Sol
        p.noStroke();
        p.fill('#FFFF6F');
        p.ellipse(100, 100, 120, 120);

        //Nuvens
        p.fill(255);
        clouds.forEach((x, i) => {
          drawCloud(p, x, 80 + i * 30);
          clouds[i] = (x + 0.5) % 850; //faz as nuvens ficarem em loop
        });

        //Solo
        p.fill('#3e8e41');
        p.rect(0, 440, 800, 60);

        //Moinho
        p.push();
        p.translate(650, 330);
        drawWindmill(p, angle);
        p.pop();

        angle += 0.01;

        //Tulipas
        for (let i = 0; i < 6; i++) {
          drawTulip(p, 100 + i * 100, 440, stage);
        }

        setCloudPositions(clouds);
      };

      const drawTulip = (p, x, y, s) => {
        p.push();
        p.translate(x, y);

        if (s >= 1) {
          p.stroke('#3e8e41');
          p.strokeWeight(5);
          p.line(0, 0, 0, -60);
        }

        if (s >= 2) {
          p.strokeWeight(1);
          p.fill('#3cb371');
          p.ellipse(-10, -40, 20, 10);
          p.ellipse(10, -50, 20, 10);
        }

        if (s >= 3) {
          p.noStroke();
          p.fill('#f4c2c2');
          //pétalas da tulipa
          p.beginShape();
          p.vertex(0, -60);
          p.bezierVertex(-10, -80, -10, -100, 0, -110);
          p.bezierVertex(10, -100, 10, -80, 0, -60);
          p.endShape(p.CLOSE);
          //pétalas laterais
          p.beginShape();
          p.vertex(-5, -60);
          p.bezierVertex(-20, -85, -5, -90, -5, -110);
          p.bezierVertex(-5, -90, -10, -80, -5, -60);
          p.endShape(p.CLOSE);

          p.beginShape();
          p.vertex(5, -60);
          p.bezierVertex(20, -85, 5, -90, 5, -110);
          p.bezierVertex(5, -90, 10, -80, 5, -60);
          p.endShape(p.CLOSE);
        }

        p.pop();
      };

      const drawCloud = (p, x, y) => {
        p.ellipse(x, y, 60, 40);
        p.ellipse(x + 20, y + 10, 50, 30);
        p.ellipse(x - 20, y + 10, 50, 30);
      };

      const drawWindmill = (p, angle) => {
        // Torre
        p.fill('#b5651d');
        p.rect(-20, 0, 40, 110);

        // Base
        p.fill('#8b4513');
        p.triangle(-20, 110, 0, 60, 20, 110);

        // Hélices
        p.fill('#fff');
        p.rotate(angle);
        for (let i = 0; i < 4; i++) {
          p.ellipse(0, -40, 10, 80);
          p.rotate(p.HALF_PI);
        }
      };
    };

    const canvas = new p5(s);
    return () => canvas.remove();
  }, [stage]);

  const regar = () => {
    if (stage < 3) setStage(stage + 1);
    const audio = new Audio(somRegar);
    audio.play();
  };

  const reiniciar = () => {
    setStage(0);
  };

  return (
    <div className="app-container">
      <h1 className="title">🌷 Jardim de Tulipas</h1>
      <div ref={sketchRef} className="canvas-container"></div>
      <button className="water-btn" onClick={regar}>
        Regar 💧
      </button>
      <button className="reset-btn" onClick={reiniciar}>
        Reiniciar 🌱
      </button>
    </div>
  );
};

export default App;
