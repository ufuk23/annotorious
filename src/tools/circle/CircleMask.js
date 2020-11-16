import { SVG_NAMESPACE } from '../../SVG';

export default class CircleMask {

  constructor(imageDimensions, circle) {
    this.w = imageDimensions.naturalWidth;
    this.h = imageDimensions.naturalHeight;

    this.circle = circle;

    this.mask = document.createElementNS(SVG_NAMESPACE, 'path');
    this.mask.setAttribute('fill-rule', 'evenodd');    
    this.mask.setAttribute('class', 'a9s-selection-mask');

    this.mask.setAttribute('d', `M0 0 h${this.w} v${this.h} h-${this.w} z M${this.circle.getAttribute('points')} z`);
  }

  redraw = () => {
    this.mask.setAttribute('d', `M0 0 h${this.w} v${this.h} h-${this.w} z M${this.circle.getAttribute('points')} z`);
  }

  get element() {
    return this.mask;
  }

  destroy = () => {
    this.mask.parentNode.removeChild(this.mask);
  }
  
}