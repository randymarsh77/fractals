export default class RenderCache {

	constructor() {
		this.data = {};
	}

	static CreateKey(viewport) {
		const { minX, maxX, minY, maxY } = viewport;
		return `${minX}+${maxX}+${minY}+${maxY}`;
	}

	getAvailableData(key) {
		return this.data[key];
	}

	putData(key, data) {
		let chunks = this.data[key];
		if (!chunks) {
			chunks = [];
			this.data[key] = chunks;
		}

		chunks.push(data);
	}
}
