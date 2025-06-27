// @TODO: Change this to an import from the github repo
/*
function validate(sparkline: SparkLines, opts: Record<string, number|number[]|SVGElement|string|string[]>) {
	if (!Array.isArray(opts.colors)) {
		opts.colors = sparkline.colors;
	}

	if (!opts.points) { return }
	sparkline.innerHTML = '';
	opts.points = (opts.points as string[]).map(item => parseInt(item, 10));
}*/

function parseIntWithDefault(val?: string, defaultValue = 0):number {
	let parsed = parseInt(val ?? ''+defaultValue, 10);
	return isNaN(parsed) ? defaultValue : parsed;
}

interface Opts {
    svg: SVGElement;
    width: number;
    height: number;
    gap: number;
    strokeWidth: number;
    type: string;
    colors: string[];
    points: number[];
    labels: null;
    format: null;
}

export class SparkLines extends HTMLElement {
    static define() {
        customElements.define('spark-lines', this);
    }
	get points(): number[] {
		return JSON.parse(this.getAttribute('points') ?? '[]');
	}
	get colors() {
		return ['gray']
	}
	#setup():Opts {

		let defaultOpts = {
			svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
			width: parseIntWithDefault(this.dataset.width, 100),
			height: parseIntWithDefault(this.dataset.height, 30),
			gap: parseIntWithDefault(this.dataset.gap, 5),
			strokeWidth: parseIntWithDefault(this.dataset.strokeWidth, 2),
			type: 'line',
			colors: this.colors || ['gray'],
            // need to adjust the points for instances where 0 of a
            // stat happen in a day
			points: this.points.map(point => point + 1),
			labels: null,
			format: null,
		};

        console.log(this.points);
		defaultOpts.svg.setAttribute('width', ''+defaultOpts.width);
		defaultOpts.svg.setAttribute('height', ''+defaultOpts.height);

		return defaultOpts
	}

	#line(opts: Opts) {
		const spacing = opts.width / (opts.points.length - 1);
		const maxValue = Math.max(...opts.points);

		const pointsCoords:string[] = [];
		opts.points.forEach((point:number, idx:number) => {
			const maxHeight = (point / maxValue) * opts.height;
			const x = idx * spacing;
			const y = opts.height - maxHeight;
			pointsCoords.push(`${x},${y}`);
		});

		const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
		line.setAttribute('points', pointsCoords.join(' '));
		line.setAttribute('fill', 'none');
		line.setAttribute('stroke-width', ''+opts.strokeWidth);
		line.setAttribute('stroke', opts.colors[0]);
		opts.svg.appendChild(line);

		this.appendChild(opts.svg);
	}
	connectedCallback() {
		const opts = this.#setup();
		this.#line(opts)
	}
}