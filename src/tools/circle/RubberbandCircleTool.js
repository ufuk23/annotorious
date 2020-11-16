import EventEmitter from 'tiny-emitter';
import RubberbandCircle from './RubberbandCircle';
import EditableCircle from './EditableCircle';

/**
 * A rubberband selector for Circle fragments.
 */
export default class RubberbandCircleTool extends EventEmitter {

  constructor(g, config, env) {
    super();

    this.svg = g.closest('svg');
    this.g = g;
    this.config = config;
    this.env = env;

    this.isDrawing = false;

    this.supportsModify = true;
  }

  _attachListeners = () => {
    this.svg.addEventListener('mousemove', this.onMouseMove);
    //this.svg.addEventListener('click', this.onClick);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  _detachListeners = () => {
    this.svg.removeEventListener('mousemove', this.onMouseMove);
    //this.svg.removeEventListener('click', this.onClick);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  _toSVG = (x, y) => {
    const pt = this.svg.createSVGPoint();

    const { left, top } = this.svg.getBoundingClientRect();
    pt.x = x + left;
    pt.y = y + top;

    return pt.matrixTransform(this.g.getScreenCTM().inverse());
  }

  startDrawing = evt => {
    if (!this.isDrawing) {
      this.isDrawing = true;

      const { x, y } = this._toSVG(evt.layerX, evt.layerY);
      this._attachListeners();
      this.rubberband = new RubberbandCircle([ x, y ], this.g, this.env);
    }
  }

  stop = () => {
    this._detachListeners();
    this.isDrawing = false;

    if (this.rubberband) {
      this.rubberband.destroy();
      this.rubberband = null;
    }
  }

  onMouseMove = evt => {	
    const { x , y } = this._toSVG(evt.layerX, evt.layerY);
    this.rubberband.dragTo([ x, y ]);
  }


  onMouseUp = evt => {
    this._detachListeners();
    this.isDrawing = false;


    const { x , y } = this._toSVG(evt.layerX, evt.layerY);
    this.rubberband.addPoint([ x, y ]);

	// UFUK
	this.rubberband.toCircle();


    // Emit the SVG shape with selection attached
    const shape = this.rubberband.g;
    shape.annotation = this.rubberband.toSelection();
    this.emit('complete', shape);
	
	
    // ...and remove the mask
    this.rubberband.mask.destroy();
  }

  onClick = evt => {
    this._detachListeners();
    this.isDrawing = false;


    const { x , y } = this._toSVG(evt.layerX, evt.layerY);
    this.rubberband.addPoint([ x, y ]);


    // Emit the SVG shape with selection attached
    const shape = this.rubberband.g;
    shape.annotation = this.rubberband.toSelection();
    this.emit('complete', shape);
  }

  createEditableShape = annotation =>
    new EditableCircle(annotation, this.g, this.config, this.env);

}
