import { Selection } from '@recogito/recogito-client-core';
import { toSVGTarget } from '../../selectors/EmbeddedSVG';
import { SVG_NAMESPACE } from '../../SVG';
import Mask from './CircleMask';

export default class RubberbandCircle {

  constructor(anchor, g, env) {
    this.g = document.createElementNS(SVG_NAMESPACE, 'g');
    this.g.setAttribute('class', 'a9s-selection');

    this.env = env;

    this.circle = document.createElementNS(SVG_NAMESPACE, 'g');

    this.outer = document.createElementNS(SVG_NAMESPACE, 'circle');
    this.outer.setAttribute('class', 'a9s-outer');

    this.inner = document.createElementNS(SVG_NAMESPACE, 'circle');
    this.inner.setAttribute('class', 'a9s-inner');

    this.points = [ anchor ];

    this.setPoints(this.points);

    this.mask = new Mask(env.image, this.inner);

    this.circle.appendChild(this.outer);
    this.circle.appendChild(this.inner);

    this.g.appendChild(this.mask.element);
    this.g.appendChild(this.circle);

    this.isCollapsed = true;

    g.appendChild(this.g);
  }

  setPoints = points => {
    const attr = points.map(t => `${t[0]},${t[1]}`).join(' ');
    this.outer.setAttribute('points', attr);
    this.inner.setAttribute('points', attr);
  }

  dragTo = xy => {
    this.isCollapsed = false;

    const rubberband = [ ...this.points, xy ];
    this.setPoints(rubberband);
    this.mask.redraw();
  }

  addPoint = xy => {
    // Don't add a new point if distance < 2 pixels
    const lastCorner = this.points[this.points.length - 1];
    const dist = Math.pow(xy[0] - lastCorner[0], 2) + Math.pow(xy[1] - lastCorner[1], 2);
    
    if (dist > 4) {
      this.points = [ ...this.points, xy ];
      this.setPoints(this.points);   
      this.mask.redraw();
    }
  }
  
  toCircle = xy => {
	this.outer.removeAttribute('points');
    this.inner.removeAttribute('points');
	
    const p1 = this.points[0];
    const p2 = this.points[1];
    var cx = (p1[0] + p2[0]) / 2;
	var cy = (p1[1] + p2[1]) / 2;
	var r = Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2)) / 2;
	r = Math.round(r * 100) / 100; // rounding
	
    if (r > 4) {
		this.inner.setAttribute('cx', cx);
		this.inner.setAttribute('cy', cy);
		this.inner.setAttribute('r', r);
		this.outer.setAttribute('cx', cx);
		this.outer.setAttribute('cy', cy);
		this.outer.setAttribute('r', r);  
    }
  }

  get element() {
    return this.circle;
  }

  destroy = () => {
    this.g.parentNode.removeChild(this.g);
    this.g = null;
  }

  toSelection = () => {
    return new Selection(toSVGTarget(this.g, this.env.image));
  }

}